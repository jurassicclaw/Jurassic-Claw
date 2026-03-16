const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const agentManager = require('./agentManager');
const openclawConnector = require('./openclawConnector');
const telegramNotifier = require('./telegramNotifier');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3333;
const WORKSPACE_DIR = process.env.WORKSPACE_DIR || path.join(__dirname, '../workspace');

if (!fs.existsSync(WORKSPACE_DIR)) fs.mkdirSync(WORKSPACE_DIR, { recursive: true });

app.use(express.json());
app.set('trust proxy', 1); // Railway sits behind a proxy
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check for Railway
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'jurassicclaw', uptime: process.uptime() }));

// Session store: apiKey per session (in-memory)
const sessions = {}; // sessionId -> apiKey

// Broadcast to all WS clients
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

agentManager.setBroadcast(broadcast);
agentManager.setTelegramNotifier(telegramNotifier);
agentManager.setWorkspaceDir(WORKSPACE_DIR);

// ─── WebSocket ───────────────────────────────────────────────
wss.on('connection', (ws, req) => {
  ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to Jurassic Claw 🦕' }));
  // Send current agents state
  ws.send(JSON.stringify({ type: 'agents_snapshot', agents: agentManager.getAll() }));
});

// ─── Auth ─────────────────────────────────────────────────────
app.post('/api/auth/apikey', (req, res) => {
  const { apiKey, sessionId } = req.body;
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return res.status(400).json({ error: 'Invalid Anthropic API key format' });
  }
  sessions[sessionId] = apiKey;
  res.json({ success: true });
});

// ─── Agents ───────────────────────────────────────────────────
app.post('/api/agents', async (req, res) => {
  const { name, emoji, task, sessionId } = req.body;
  const apiKey = sessions[sessionId] || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(401).json({ error: 'No API key registered' });
  if (!name || !task) return res.status(400).json({ error: 'name and task required' });

  const agent = await agentManager.create({ name, emoji: emoji || '🦕', task, apiKey });
  res.json(agent);
});

app.get('/api/agents', (req, res) => {
  res.json(agentManager.getAll());
});

app.post('/api/agents/:id/start', async (req, res) => {
  const { sessionId } = req.body;
  const apiKey = sessions[sessionId] || process.env.ANTHROPIC_API_KEY;
  const agent = agentManager.get(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  await agentManager.start(req.params.id, apiKey);
  res.json({ success: true });
});

app.delete('/api/agents/:id', (req, res) => {
  agentManager.stop(req.params.id);
  res.json({ success: true });
});

app.post('/api/agents/:id/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  const apiKey = sessions[sessionId] || process.env.ANTHROPIC_API_KEY;
  const agent = agentManager.get(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  const reply = await agentManager.chat(req.params.id, message, apiKey);
  res.json({ reply });
});

// ─── Workspace ────────────────────────────────────────────────
app.get('/api/workspace/files', (req, res) => {
  try {
    const files = fs.readdirSync(WORKSPACE_DIR).map(name => {
      const stat = fs.statSync(path.join(WORKSPACE_DIR, name));
      return { name, size: stat.size, modified: stat.mtime };
    });
    res.json(files);
  } catch { res.json([]); }
});

app.get('/api/workspace/files/:name', (req, res) => {
  const filePath = path.join(WORKSPACE_DIR, req.params.name);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(filePath);
});

// ─── Routes ───────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/landing.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dashboard.html')));
app.get('/setup', (req, res) => res.sendFile(path.join(__dirname, '../frontend/setup.html')));

// ─── OpenClaw ─────────────────────────────────────────────────
openclawConnector.start(broadcast, agentManager);

server.listen(PORT, () => {
  console.log(`🦕 Jurassic Claw running on port ${PORT}`);
  telegramNotifier.send('🦕 Jurassic Claw server started!');
});
