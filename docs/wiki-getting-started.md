# Getting Started

Everything you need to go from zero to a live paddock with roaming dino agents.

---

## Option A — Use the Hosted Version (Fastest)

No setup needed. Just open the app and paste your API key.

```
https://jurassic-claw-production.up.railway.app
```

---

## Option B — Run Locally

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- An [Anthropic API key](https://console.anthropic.com)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/jurassicclaw/Jurassicclaw.git
cd Jurassicclaw

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

Open `.env` and fill in:

```env
# Required for local dev (optional — users can BYOK)
ANTHROPIC_API_KEY=sk-ant-...

# Optional — Telegram notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Model to use
CLAUDE_MODEL=claude-haiku-4-5-20251001
```

```bash
# 4. Start the server
npm start

# 5. Open in browser
open http://localhost:3333
```

---

## Option C — Deploy Your Own Railway Instance

See [DEPLOY.md](../DEPLOY.md) for the full Railway deployment guide.

---

## First Time Setup

### 1. Enter Your API Key

When you open the app for the first time, you'll land on `/setup`. Paste your Anthropic API key here.

> Your key is stored in your browser's `localStorage` only — it never gets sent to or stored on our server. See the [BYOK Guide](BYOK-Guide) for full details.

### 2. Spawn Your First Agent

Click **🦕 Spawn Agent** and fill in:

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | What to call your agent | `Rex` |
| **Emoji** | Visual identifier in the paddock | `🦖` |
| **Task** | What the agent should do | `Research the latest AI news and write a summary` |

Click **Spawn into Paddock** — your dinosaur appears and starts roaming immediately.

### 3. Watch the Paddock

Your agent is now running. The dino's movement tells you exactly what it's doing:

| Movement | Color | Meaning |
|----------|-------|---------|
| Charging sprint | 🟢 Green | Working hard, calling tools |
| Steady trot | 🔵 Teal | Thinking, reasoning |
| Slow graze | 🟡 Amber | Idle, waiting |
| Gentle rest | ⚪ White | Task completed |
| Erratic stomp | 🔴 Red | Error occurred |

### 4. Use the Panels

**LOGS tab** — real-time stream of everything the agent is doing, including tool calls and outputs.

**CHAT tab** — send a message directly to the running agent. Ask it what it's doing, redirect the task, or give new instructions.

**FILES tab** — every file your agent creates is available here to view and download.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Open Spawn Agent modal |
| `Esc` | Close modal |

---

## Telegram Notifications (Optional)

Set up Telegram to get notified when agents spawn, complete, or error.

```bash
# 1. Chat @BotFather on Telegram → /newbot → follow instructions
# 2. Copy the bot token
# 3. Add to .env:
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
TELEGRAM_CHAT_ID=-1001234567890
# 4. Restart server
```

You'll receive a message for every agent event. Your dinos text you. 📲

---

## Troubleshooting

**App won't load?**
- Make sure Node.js 18+ is installed: `node --version`
- Check the terminal for errors after `npm start`

**API key rejected?**
- Key must start with `sk-ant-`
- Get your key at [console.anthropic.com](https://console.anthropic.com)

**Agent not spawning?**
- Make sure your API key is registered (go to `/setup`)
- Check the LOGS tab for error details

**WebSocket not connecting?**
- Refresh the page
- Check that the server is still running

---

*Questions? Ask on [Telegram](https://t.me/jurassicclaw) or open a [GitHub Issue](https://github.com/jurassicclaw/Jurassicclaw/issues).*
