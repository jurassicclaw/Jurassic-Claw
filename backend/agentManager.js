const { Anthropic } = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

let broadcast = () => {};
let telegramNotifier = { send: () => {} };
let WORKSPACE_DIR = './workspace';

const agents = {}; // id -> agent

function setBroadcast(fn) { broadcast = fn; }
function setTelegramNotifier(t) { telegramNotifier = t; }
function setWorkspaceDir(dir) { WORKSPACE_DIR = dir; }

function getAll() {
  return Object.values(agents).map(a => ({
    id: a.id, name: a.name, emoji: a.emoji, task: a.task,
    status: a.status, progress: a.progress, tokensUsed: a.tokensUsed,
    apiCalls: a.apiCalls, log: a.log.slice(-50), createdAt: a.createdAt
  }));
}

function get(id) { return agents[id]; }

async function create({ name, emoji, task, apiKey }) {
  const id = uuidv4();
  agents[id] = {
    id, name, emoji, task, apiKey,
    status: 'idle', progress: 0, tokensUsed: 0, apiCalls: 0,
    log: [], history: [], createdAt: new Date().toISOString()
  };
  broadcast({ type: 'agent_created', agent: agents[id] });
  telegramNotifier.send(`🦕 Agent spawned: ${emoji} ${name}\nTask: ${task}`);
  await start(id, apiKey);
  return agents[id];
}

async function start(id, apiKey) {
  const agent = agents[id];
  if (!agent) return;
  agent.status = 'active';
  agent.apiKey = apiKey || agent.apiKey;
  broadcast({ type: 'agent_update', agent: sanitize(agent) });

  addLog(id, `🦕 ${agent.name} woke up and started roaring!`);
  addLog(id, `📋 Task: ${agent.task}`);

  runTask(id).catch(err => {
    setStatus(id, 'error');
    addLog(id, `❌ Error: ${err.message}`);
    telegramNotifier.send(`❌ Agent error: ${agent.name}\n${err.message}`);
  });
}

async function runTask(id) {
  const agent = agents[id];
  if (!agent) return;

  const client = new Anthropic({ apiKey: agent.apiKey });

  const tools = [
    {
      name: 'write_file',
      description: 'Write content to a file in the workspace',
      input_schema: {
        type: 'object',
        properties: {
          filename: { type: 'string', description: 'Filename to write' },
          content: { type: 'string', description: 'File content' }
        },
        required: ['filename', 'content']
      }
    },
    {
      name: 'read_file',
      description: 'Read a file from the workspace',
      input_schema: {
        type: 'object',
        properties: { filename: { type: 'string' } },
        required: ['filename']
      }
    },
    {
      name: 'list_files',
      description: 'List files in the workspace',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'search_web',
      description: 'Search for information (simulated)',
      input_schema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query']
      }
    }
  ];

  const systemPrompt = `You are ${agent.name}, a powerful AI agent visualized as a dinosaur in the Jurassic Claw paddock. 
You are autonomous and task-focused. Complete your task thoroughly and use tools when helpful.
Report your progress clearly. When done, summarize what you accomplished.
Be efficient but thorough. You have access to workspace files.`;

  agent.history = [{ role: 'user', content: agent.task }];

  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    if (!agents[id]) return; // agent was removed
    iterations++;
    agent.progress = Math.min(90, (iterations / maxIterations) * 100);

    setStatus(id, iterations % 2 === 0 ? 'thinking' : 'active');

    try {
      agent.apiCalls++;
      const response = await client.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        tools,
        messages: agent.history
      });

      agent.tokensUsed += response.usage?.input_tokens + response.usage?.output_tokens || 0;
      broadcast({ type: 'agent_update', agent: sanitize(agent) });

      // Process response
      const assistantContent = response.content;
      agent.history.push({ role: 'assistant', content: assistantContent });

      // Extract text blocks
      for (const block of assistantContent) {
        if (block.type === 'text' && block.text.trim()) {
          addLog(id, `🦕 ${block.text.substring(0, 300)}`);
        }
      }

      // Handle tool calls
      const toolUses = assistantContent.filter(b => b.type === 'tool_use');
      if (toolUses.length === 0) {
        // No more tool calls — done
        break;
      }

      const toolResults = [];
      for (const toolUse of toolUses) {
        addLog(id, `🔧 Using tool: ${toolUse.name}`);
        const result = await executeTool(toolUse.name, toolUse.input);
        addLog(id, `✅ Tool result: ${String(result).substring(0, 100)}`);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: String(result)
        });
      }

      agent.history.push({ role: 'user', content: toolResults });

      if (response.stop_reason === 'end_turn') break;

    } catch (err) {
      if (err.status === 529 || err.message?.includes('overloaded')) {
        addLog(id, '⏳ API busy, retrying in 3s...');
        await sleep(3000);
        continue;
      }
      throw err;
    }
  }

  agent.progress = 100;
  setStatus(id, 'done');
  addLog(id, `✅ ${agent.name} completed the task! Resting in the paddock...`);
  telegramNotifier.send(`✅ Agent done: ${agent.emoji} ${agent.name}\nTokens used: ${agent.tokensUsed}`);
}

async function executeTool(name, input) {
  switch (name) {
    case 'write_file': {
      const filePath = path.join(WORKSPACE_DIR, sanitizeFilename(input.filename));
      fs.writeFileSync(filePath, input.content, 'utf8');
      broadcast({ type: 'file_created', filename: input.filename });
      return `File written: ${input.filename} (${input.content.length} chars)`;
    }
    case 'read_file': {
      const filePath = path.join(WORKSPACE_DIR, sanitizeFilename(input.filename));
      if (!fs.existsSync(filePath)) return 'File not found';
      return fs.readFileSync(filePath, 'utf8').substring(0, 2000);
    }
    case 'list_files': {
      if (!fs.existsSync(WORKSPACE_DIR)) return '[]';
      return fs.readdirSync(WORKSPACE_DIR).join(', ') || '(empty)';
    }
    case 'search_web': {
      return `Search results for "${input.query}": [Simulated results - In production, connect to a real search API]`;
    }
    default:
      return 'Unknown tool';
  }
}

async function chat(id, message, apiKey) {
  const agent = agents[id];
  if (!agent) return 'Agent not found';

  const client = new Anthropic({ apiKey: apiKey || agent.apiKey });
  agent.history.push({ role: 'user', content: message });

  const response = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: `You are ${agent.name}, an AI agent in the Jurassic Claw paddock. You were working on: ${agent.task}. Answer concisely.`,
    messages: agent.history
  });

  const reply = response.content[0]?.text || '...';
  agent.history.push({ role: 'assistant', content: reply });
  addLog(id, `💬 Chat: ${message.substring(0, 50)} → ${reply.substring(0, 100)}`);
  broadcast({ type: 'agent_update', agent: sanitize(agent) });
  return reply;
}

function stop(id) {
  if (agents[id]) {
    agents[id].status = 'done';
    broadcast({ type: 'agent_removed', id });
    delete agents[id];
  }
}

function setStatus(id, status) {
  if (!agents[id]) return;
  agents[id].status = status;
  broadcast({ type: 'agent_update', agent: sanitize(agents[id]) });
}

function addLog(id, message) {
  if (!agents[id]) return;
  const entry = { time: new Date().toISOString(), message };
  agents[id].log.push(entry);
  if (agents[id].log.length > 200) agents[id].log.shift();
  broadcast({ type: 'log', agentId: id, entry });
}

function sanitize(agent) {
  const { apiKey, ...safe } = agent;
  return safe;
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { create, get, getAll, start, stop, chat, setBroadcast, setTelegramNotifier, setWorkspaceDir };
