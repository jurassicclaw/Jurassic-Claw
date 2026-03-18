# Good First Issues — Ready to Post

Copy-paste these into GitHub Issues after enabling the label `good first issue`.

---

## Issue 1 — Add copy button to log panel

**Title:** `[GOOD FIRST ISSUE] Add copy button to log panel`
**Labels:** `good first issue`, `enhancement`, `frontend`

### What needs to be done
Add a "Copy logs" button to the LOGS panel in `dashboard.html` that copies all visible log entries to the clipboard.

### Acceptance criteria
- [ ] Button appears in the top-right corner of the LOGS panel
- [ ] Clicking it copies all log text to clipboard
- [ ] Shows brief "Copied!" feedback for 1.5 seconds
- [ ] Works in Chrome, Firefox, Safari

### Hints
- All log entries are `<div class="log-entry">` elements inside `#logContainer`
- Use `navigator.clipboard.writeText()`
- Styling should match the existing `.btn-sm` class

---

## Issue 2 — Add agent token usage to sidebar

**Title:** `[GOOD FIRST ISSUE] Show token usage per agent in sidebar`
**Labels:** `good first issue`, `enhancement`, `frontend`

### What needs to be done
The sidebar agent cards already receive `tokensUsed` data. Display it more prominently — add a small progress bar that fills based on a 10,000 token "soft limit" threshold.

### Acceptance criteria
- [ ] Small token bar visible under each agent card in sidebar
- [ ] Bar fills from 0 to 10k tokens (capped at full)
- [ ] Colour: green → amber → red as tokens increase
- [ ] Tooltip on hover shows exact count

### Hints
- Agent data is in `state.agents[id].tokensUsed`
- `renderSidebar()` in `dashboard.html` builds each card
- Keep it subtle — 2px height bar is enough

---

## Issue 3 — OpenClaw adapter for Python agents

**Title:** `[GOOD FIRST ISSUE] Add OpenClaw adapter example for Python`
**Labels:** `good first issue`, `documentation`, `openclaw`

### What needs to be done
Create a standalone Python file `examples/openclaw_python.py` that shows how to add OpenClaw support to any Python AI agent in under 20 lines.

### Acceptance criteria
- [ ] File is at `examples/openclaw_python.py`
- [ ] Uses only Python standard library + Flask (or http.server)
- [ ] Exposes `GET /status` on port 8000
- [ ] Includes comments explaining each part
- [ ] README updated to link to the example

### Hints
- See [OpenClaw Protocol wiki](../../wiki/OpenClaw-Protocol) for the `/status` contract
- Keep it minimal — the simpler the better for a first example

---

## Issue 4 — Dark/light mode toggle

**Title:** `[GOOD FIRST ISSUE] Add light mode toggle to dashboard`
**Labels:** `good first issue`, `enhancement`, `frontend`

### What needs to be done
Add a toggle button to the dashboard topbar that switches between the current dark theme and a light theme.

### Acceptance criteria
- [ ] Toggle button in topbar (🌙 / ☀️)
- [ ] Light theme has readable contrast — no black text on dark bg
- [ ] Preference saved to localStorage
- [ ] Smooth CSS transition on toggle

### Hints
- Add a `.light-mode` class to `<body>` and override CSS variables
- Current theme uses `--green`, `--surface`, `--border`, `--text` variables
- Preference key: `jc_theme`

---

## Issue 5 — Add keyboard shortcut cheatsheet

**Title:** `[GOOD FIRST ISSUE] Add keyboard shortcut tooltip/modal`
**Labels:** `good first issue`, `enhancement`, `frontend`

### What needs to be done
Add a `?` keyboard shortcut that shows a small modal listing all available keyboard shortcuts.

### Acceptance criteria
- [ ] Press `?` to open the modal
- [ ] Lists: `N` = spawn agent, `Esc` = close modal, `?` = show shortcuts
- [ ] Modal closes on `Esc` or clicking outside
- [ ] Matches existing modal styling

### Hints
- Existing modal pattern is in `#spawnModal` — reuse the same styles
- Add listener in the existing `keydown` handler at bottom of `dashboard.html`

---

*After posting, pin a comment to each issue saying "Leave a comment before starting so we can assign it to you." This prevents two people working on the same thing.*
