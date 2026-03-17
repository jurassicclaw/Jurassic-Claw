# BYOK Guide

BYOK stands for **Bring Your Own Key**. Jurassic Claw uses a BYOK model for Anthropic API keys — meaning you supply your own key, and we never store it.

---

## How It Works

```
You enter your API key on /setup
        ↓
Key is saved to your browser's localStorage
        ↓
On each agent action, key is sent from your browser → Railway server → Anthropic API
        ↓
Railway server uses key for that request only — never persists it
        ↓
Session ends → key lives only in your browser
```

---

## Why BYOK?

### For You
- **Privacy** — your API key never sits in our database
- **Control** — you can revoke it from Anthropic's console at any time
- **No surprise bills** — you see exactly what you're spending in Anthropic's dashboard
- **No lock-in** — stop using Jurassic Claw, your key is safe

### For Us
- **Simpler** — no need to manage API key storage or billing infrastructure
- **Trustless** — open source means you can verify everything yourself
- **Free to run** — no API costs on our end means the app stays free

---

## Security Details

| Question | Answer |
|----------|--------|
| Is my key stored on your server? | ❌ Never persisted |
| Where is my key stored? | ✅ Your browser's `localStorage` only |
| Is my key sent over the network? | ✅ Yes — to register your session on Railway, over HTTPS |
| Can Jurassic Claw team see my key? | ❌ No — not logged, not stored |
| What happens if Railway restarts? | Your key auto re-registers from localStorage on next dashboard load |
| Is the code auditable? | ✅ Fully open source — [check it yourself](https://github.com/jurassicclaw/Jurassicclaw) |

---

## Getting Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy the key — it starts with `sk-ant-`

> ⚠️ Store your key somewhere safe. Anthropic only shows it once.

---

## Entering Your Key in Jurassic Claw

1. Open [jurassic-claw-production.up.railway.app/setup](https://jurassic-claw-production.up.railway.app/setup)
2. Paste your key into the input field
3. Click **🦕 Enter the Paddock**
4. You're in — key is saved to localStorage and session is registered

---

## What If I Want to Change My Key?

Click the 🔑 button in the top-right of the dashboard, or go directly to `/setup`. Enter the new key and it replaces the old one in localStorage.

---

## What If I Want to Remove My Key?

Open your browser's developer tools:

```
F12 → Application → Local Storage → your domain → delete jc_api_key
```

Or simply clear your browser's site data for the Jurassic Claw domain.

---

## Costs

Jurassic Claw uses `claude-haiku-4-5-20251001` by default — the fastest and most affordable Claude model. A typical agent task costs roughly **$0.001–0.01** depending on task length.

You can monitor your usage at [console.anthropic.com/usage](https://console.anthropic.com/usage).

---

## Self-Hosting

If you self-host Jurassic Claw, you can set a default `ANTHROPIC_API_KEY` in `.env`. This means users don't need to enter their own key — your server key is used instead. Only do this if you trust your users, as they will consume from your quota.

```env
# .env — default key for all users (optional)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Phase 5 — $JURA Token

In Phase 5, $JURA token holders above a threshold will be able to use Jurassic Claw **without an API key** — Jurassic Claw will cover the API costs from token launch funds. See [$JURA Token](https://github.com/jurassicclaw/Jurassicclaw#-jura-token) for details.

---

*Questions? Open a [GitHub Issue](https://github.com/jurassicclaw/Jurassicclaw/issues) or ask on [Telegram](https://t.me/jurassicclaw).*
