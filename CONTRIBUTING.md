# Contributing to Jurassic Claw 🦕

Thanks for wanting to contribute! Here's everything you need to know.

## Getting Started

```bash
git clone https://github.com/jurassicclaw/Jurassicclaw.git
cd Jurassicclaw
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm start
```

## How to Contribute

1. **Fork** the repo
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes** and test locally
4. **Commit**: `git commit -m "✨ your change"`
5. **Push**: `git push origin feature/your-feature`
6. **Open a Pull Request**

## What We'd Love Help With

- 🔌 **OpenClaw adapters** — integrations for LangChain, CrewAI, AutoGen, ElizaOS
- 🎨 **Dino animations** — new status visualizations and paddock effects
- 📊 **Analytics** — agent metrics, token usage charts, performance tracking
- 🌐 **i18n** — translations to other languages
- 🐛 **Bug fixes** — check open issues
- 📝 **Docs** — improve README, add examples

## Commit Style

```
✨ feat: add new feature
🐛 fix: fix a bug
📝 docs: update documentation
🎨 style: formatting, no logic change
♻️ refactor: code refactor
🔧 chore: build/config changes
```

## Code Style

- Use `const`/`let`, no `var`
- Async/await over callbacks
- Keep files focused — one responsibility per file
- Comment anything non-obvious

## Questions?

Open an issue or reach out on [Telegram](https://t.me/jurassicclaw).
