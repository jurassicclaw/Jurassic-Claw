# 🚂 Deploy Jurassic Claw ke Railway

Panduan lengkap deploy dari nol sampai live.

---

## Prerequisites

- Akun GitHub (gratis)
- Akun Railway (gratis) → https://railway.app
- Anthropic API key → https://console.anthropic.com

---

## Step 1 — Push ke GitHub

```bash
# Di folder jurassicclaw/
git init
git add .
git commit -m "🦕 initial commit — Jurassic Claw"

# Buat repo baru di github.com/new
# Namanya: Jurassicclaw (sesuai PRD)
git remote add origin https://github.com/USERNAME/Jurassicclaw.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Buat Project di Railway

1. Buka https://railway.app → Login dengan GitHub
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repo `Jurassicclaw`
5. Railway otomatis detect Node.js dan mulai build

---

## Step 3 — Set Environment Variables

Di Railway dashboard → project kamu → tab **"Variables"** → tambahkan:

| Variable | Value | Wajib? |
|----------|-------|--------|
| `PORT` | Railway set otomatis, **jangan diisi** | — |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Opsional (BYOK) |
| `TELEGRAM_BOT_TOKEN` | Token dari @BotFather | Opsional |
| `TELEGRAM_CHAT_ID` | ID channel/group Telegram | Opsional |
| `CLAUDE_MODEL` | `claude-haiku-4-5-20251001` | Opsional |

> ⚠️ `PORT` diatur otomatis oleh Railway. Jangan set manual.

### Cara dapat Telegram Bot Token (opsional):
1. Buka Telegram → cari **@BotFather**
2. Ketik `/newbot` → ikuti instruksi
3. Copy token yang diberikan → paste ke `TELEGRAM_BOT_TOKEN`
4. Untuk `TELEGRAM_CHAT_ID`: forward pesan dari group/channel ke @userinfobot

---

## Step 4 — Set Custom Domain (opsional)

Di Railway → project → tab **"Settings"** → **"Domains"**:
- Klik **"Generate Domain"** → dapat URL gratis: `jurassicclaw-production.up.railway.app`
- Atau tambah custom domain: `app.jurassicclaw.xyz`

### Kalau pakai custom domain di Hostinger:
1. Di Railway → copy domain Railway kamu
2. Di Hostinger DNS → tambah record:
   ```
   Type: CNAME
   Name: app
   Value: jurassicclaw-production.up.railway.app
   ```
3. Di Railway → tambahkan `app.jurassicclaw.xyz` sebagai custom domain
4. Railway otomatis handle SSL

---

## Step 5 — Verify Deploy

Setelah deploy selesai (biasanya 1-2 menit):

```bash
# Test health endpoint
curl https://jurassicclaw-production.up.railway.app/health
# Expected: {"status":"ok","service":"jurassicclaw","uptime":...}

# Test API
curl https://jurassicclaw-production.up.railway.app/api/agents
# Expected: []
```

Buka URL di browser → harusnya muncul halaman setup/dashboard.

---

## Step 6 — Auto-Deploy (sudah aktif)

Railway otomatis redeploy setiap kali kamu push ke `main`:

```bash
# Update code
git add .
git commit -m "✨ update fitur X"
git push origin main
# Railway langsung rebuild & redeploy
```

---

## Troubleshooting

### Build gagal
- Cek tab **"Build Logs"** di Railway dashboard
- Pastikan `package.json` ada dan `"main": "backend/server.js"`
- Pastikan semua dependencies ada di `dependencies` (bukan `devDependencies`)

### App crash setelah deploy
- Cek tab **"Deploy Logs"** di Railway
- Pastikan `PORT` tidak di-hardcode (sudah pakai `process.env.PORT`)
- Cek apakah ada error di logs

### WebSocket tidak connect
- Railway support WebSocket secara native ✅
- Pastikan kode pakai `ws://` untuk HTTP dan `wss://` untuk HTTPS
- Dashboard sudah handle ini otomatis berdasarkan `location.protocol`

### Memory limit
- Railway free tier: 512MB RAM
- Kalau banyak agents berjalan simultan, bisa kena limit
- Solution: upgrade plan atau limit max agents

---

## Railway Free Tier Limits

| Resource | Free Tier |
|----------|-----------|
| RAM | 512 MB |
| CPU | Shared |
| Bandwidth | 100 GB/bulan |
| Deploy hours | 500 jam/bulan |
| Sleep | Tidak sleep (selalu aktif) |

> Free tier cukup untuk development dan early users. Upgrade ke Hobby ($5/bulan) untuk production.

---

## Environment Variables Lengkap

```env
# Wajib untuk production — Railway set otomatis
PORT=                        # JANGAN diisi, Railway yang set

# Optional default API key (pengguna bisa BYOK)
ANTHROPIC_API_KEY=sk-ant-...

# Telegram (opsional)
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
TELEGRAM_CHAT_ID=-1001234567890

# Model Claude yang dipakai
CLAUDE_MODEL=claude-haiku-4-5-20251001

# Workspace (Railway pakai ephemeral filesystem)
# File akan hilang saat redeploy — normal untuk MVP
WORKSPACE_DIR=./workspace
```

---

## ⚠️ Catatan Penting untuk Production

1. **Filesystem ephemeral** — Railway restart akan menghapus file di `workspace/`. Beritahu user untuk download file sebelum redeploy. (Phase 4: pindah ke persistent storage / S3)

2. **In-memory sessions** — Kalau Railway restart, semua sessions hilang. Dashboard sudah handle ini dengan auto re-register dari localStorage saat load.

3. **BYOK is safe** — API key user tidak pernah disimpan di server Railway. Hanya di localStorage browser user.

4. **Scale** — Untuk team workspaces (Phase 4), perlu tambah Redis untuk session sharing antar instances.

---

*Deploy selesai? Share link-nya di @jurassicclaw 🦕*
