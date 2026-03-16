const http = require('http');

let broadcastFn = () => {};
let agentMgr = null;

const OPENCLAW_PORTS = Array.from({ length: 21 }, (_, i) => 8000 + i);
const discovered = new Set();

function start(broadcast, agentManager) {
  broadcastFn = broadcast;
  agentMgr = agentManager;
  scan();
  setInterval(scan, 30000); // Re-scan every 30s
}

function scan() {
  OPENCLAW_PORTS.forEach(port => {
    checkPort(port);
  });
}

function checkPort(port) {
  const options = { hostname: 'localhost', port, path: '/status', timeout: 1000 };
  const req = http.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const status = JSON.parse(data);
        const key = `${port}`;
        if (!discovered.has(key)) {
          discovered.add(key);
          console.log(`🔌 OpenClaw agent discovered on port ${port}:`, status.name);
          broadcastFn({
            type: 'openclaw_discovered',
            port,
            agent: status
          });
        } else {
          // Update existing
          broadcastFn({ type: 'openclaw_update', port, agent: status });
        }
      } catch {}
    });
  });
  req.on('error', () => {
    // Port not open — if we had it, remove it
    const key = `${port}`;
    if (discovered.has(key)) {
      discovered.delete(key);
      broadcastFn({ type: 'openclaw_lost', port });
    }
  });
  req.end();
}

module.exports = { start };
