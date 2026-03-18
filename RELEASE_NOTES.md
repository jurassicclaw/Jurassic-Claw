# 🦕 Jurassic Claw v1.0.0

**Your AI Agents, But They're Dinosaurs.**

We're excited to release Jurassic Claw v1.0.0 — the first stable release of the real-time AI agent monitoring dashboard that turns your Claude AI agents into animated dinosaurs.

---

## 🎉 What's in v1.0.0

### Core Features

| Feature | Description |
|---------|-------------|
| 🦕 **Live Paddock** | Real-time animated dinosaurs per agent. Speed and color map to agent status. |
| ⚡ **WebSocket Feed** | Zero-latency streaming of logs, tool calls, and status updates. |
| 🔒 **BYOK Auth** | Bring Your Own Key — API key stored in localStorage only, never on server. |
| 💬 **Direct Chat** | Chat with any running agent in real-time. Redirect tasks, ask questions. |
| 📂 **Files Tab** | View and download every file your agents create in the workspace. |
| 🔌 **OpenClaw Protocol** | Auto-discover external agents (LangChain, CrewAI, ElizaOS) on ports 8000–8020. |
| 📱 **Telegram Notifications** | Get notified on agent spawn, completion, error, and OpenClaw discovery. |
| 🔄 **Session Persistence** | API key auto re-registers from localStorage on server restart. |

### Infrastructure

- **Deployed on Railway** — [jurassic-claw-production.up.railway.app](https://jurassic-claw-production.up.railway.app)
- **Health endpoint** at `/health` for Railway uptime monitoring
- **WebSocket reconnection** — auto-reconnects on disconnect
- **Trust proxy** configured for Railway's reverse proxy

### Dino Status Guide

| State | Animation | Color | Meaning |
|-------|-----------|-------|---------|
| Active | Charging sprint | 🟢 Green | Processing, calling tools |
| Thinking | Steady trot | 🔵 Teal | Reasoning between steps |
| Idle | Slow graze | 🟡 Amber | Waiting for input |
| Done | Gentle rest | ⚪ White | Task completed |
| Error | Erratic stomp | 🔴 Red | Agent error |

### OpenClaw Protocol

External agents can join the paddock by exposing:

```
GET /status → { name, task, status, progress, tokensUsed, apiCalls }
```

Jurassic Claw auto-scans ports **8000–8020** on startup and every 30 seconds.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Real-time | WebSocket (ws) |
| AI | Claude API — `claude-haiku-4-5-20251001` |
| Frontend | Vanilla HTML/CSS/JS |
| Deploy | Railway |

---

## 🚀 Quick Start

```bash
git clone https://github.com/jurassicclaw/Jurassicclaw.git
cd Jurassicclaw
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
npm start
# Open http://localhost:3333
```

Or use the hosted version: [jurassic-claw-production.up.railway.app](https://jurassic-claw-production.up.railway.app)

---

## 📖 Documentation

- [Getting Started](../../wiki/Getting-Started)
- [OpenClaw Protocol](../../wiki/OpenClaw-Protocol)
- [BYOK Guide](../../wiki/BYOK-Guide)
- [Deploy to Railway](DEPLOY.md)

---

## 🗺️ What's Next

### Phase 3 (Current)
- Leaderboard
- Agent templates
- Usage stats
- Weekly shipped updates

### Phase 4
- Team workspaces
- Paddock of the Week
- Public showcase

### Phase 5
- $JURA token on Solana
- Token gating — free agent runs for holders
- Governance

---

## 🤝 Contributing

PRs welcome! Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Looking for a place to start? Check the [Good First Issues](https://github.com/jurassicclaw/Jurassicclaw/issues?q=label%3A%22good+first+issue%22).

---

## 📄 License

MIT — free to use, fork, and deploy.

---

**🦕 Built with Claude API · Deployed on Railway · MIT License**

[jurassicclaw.xyz](https://jurassicclaw.xyz) · [@jurassicclaw](https://x.com/jurassicclaw) · [t.me/jurassicclaw](https://t.me/jurassicclaw)
