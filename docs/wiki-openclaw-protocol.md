# OpenClaw Protocol

Connect any external AI agent — LangChain, CrewAI, ElizaOS, custom scripts — to the Jurassic Claw paddock. Your agent gets its own dinosaur, no extra setup needed.

---

## How It Works

1. Your external agent exposes a `/status` endpoint on any port from **8000 to 8020**
2. Jurassic Claw auto-scans those ports on startup and every 30 seconds
3. When discovered, your agent gets a dino in the paddock automatically
4. A Telegram notification fires: `OPENCLAW_DISCOVERED`

Zero config. Zero signup. Just expose the endpoint.

---

## The /status Endpoint

Your agent needs to serve this at `GET /status`:

```json
{
  "name":        "My Agent",
  "task":        "Monitoring crypto prices",
  "status":      "active",
  "progress":    42,
  "tokensUsed":  1240,
  "apiCalls":    7
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Agent name — shown as dino label in paddock |
| `task` | string | ✅ | Current task description |
| `status` | string | ✅ | Agent state — see values below |
| `progress` | number | ❌ | Progress percentage 0–100 |
| `tokensUsed` | number | ❌ | Total tokens consumed |
| `apiCalls` | number | ❌ | Total API calls made |

### Status Values

| Value | Dino Animation | Color |
|-------|---------------|-------|
| `active` | Charging sprint | 🟢 Green |
| `thinking` | Steady trot | 🔵 Teal |
| `idle` | Slow graze | 🟡 Amber |
| `done` | Gentle rest | ⚪ White |
| `error` | Erratic stomp | 🔴 Red |

---

## Implementation Examples

### Python (Flask)

```python
from flask import Flask, jsonify
app = Flask(__name__)

agent_state = {
    "name": "PriceWatcher",
    "task": "Monitor BTC price every 5 minutes",
    "status": "active",
    "progress": 0,
    "tokensUsed": 0,
    "apiCalls": 0
}

@app.route('/status')
def status():
    return jsonify(agent_state)

if __name__ == '__main__':
    app.run(port=8000)  # Any port 8000–8020
```

### Node.js (Express)

```javascript
const express = require('express');
const app = express();

const agentState = {
  name: 'ResearchBot',
  task: 'Scraping AI news daily',
  status: 'active',
  progress: 0,
  tokensUsed: 0,
  apiCalls: 0
};

app.get('/status', (req, res) => res.json(agentState));

app.listen(8001); // Any port 8000–8020
```

### LangChain Agent

```python
from flask import Flask, jsonify
from langchain.agents import AgentExecutor
import threading

app = Flask(__name__)
agent_status = {"name": "LangAgent", "task": "...", "status": "idle", "progress": 0}

@app.route('/status')
def status():
    return jsonify(agent_status)

def run_status_server():
    app.run(port=8002, quiet=True)

# Start status server in background
threading.Thread(target=run_status_server, daemon=True).start()

# Your agent runs normally — just update agent_status as it works
```

---

## Port Assignment

Jurassic Claw scans ports **8000 to 8020** (21 ports total). Assign each agent a unique port:

| Agent | Port |
|-------|------|
| Agent 1 | 8000 |
| Agent 2 | 8001 |
| Agent 3 | 8002 |
| ... | ... |
| Agent 21 | 8020 |

If you need more than 21 external agents, open a [GitHub Issue](https://github.com/jurassicclaw/Jurassicclaw/issues) and we'll extend the range.

---

## Updating Status in Real-Time

Update `agentState` as your agent works — Jurassic Claw re-polls every 30 seconds and on each WebSocket refresh.

```python
# Python example — update as your agent progresses
import time

agent_state["status"] = "active"
agent_state["task"] = "Processing batch 1 of 10"

for i in range(10):
    # do work
    agent_state["progress"] = (i + 1) * 10
    agent_state["tokensUsed"] += 200
    agent_state["apiCalls"] += 1
    time.sleep(2)

agent_state["status"] = "done"
agent_state["progress"] = 100
```

---

## Troubleshooting

**Agent not showing up in paddock?**
- Make sure the `/status` endpoint is accessible at `localhost:{port}/status`
- Make sure the port is between 8000–8020
- Check that your agent returns valid JSON
- Wait up to 30 seconds for the next auto-scan cycle

**Dino showing wrong status?**
- Make sure `status` is one of: `active`, `thinking`, `idle`, `done`, `error`
- Any unrecognised value defaults to `idle`

**Running Jurassic Claw and external agent on different machines?**
- OpenClaw currently only scans `localhost`. For remote agents, run a local proxy that forwards `/status` to the remote agent.

---

*Questions? Open a [GitHub Issue](https://github.com/jurassicclaw/Jurassicclaw/issues) or ask on [Telegram](https://t.me/jurassicclaw).*
