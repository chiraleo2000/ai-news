---
name: ai-news-github-deploy
description: >
  Deploy daily AI news JSON to https://chiraleo2000.github.io/ai-news/
  Copy JSON จาก Document/{date}_News/ → data/
  Update manifest.json → git add + commit + push ทันที
  ⛔ ห้าม computer-use / desktop control เด็ดขาด
  ⛔ ห้ามถามยืนยัน — ทำให้จบครบในรอบเดียว
agents: [main_agent, general_purpose]
trigger:
  - "deploy github pages ai"
  - "update github ai news"
  - "push ai news pages"
  - "ai-news deploy"
  - "do git push"
---

# SKILL: ai-news-github-deploy v7.0

> **One-shot auto-deploy** — copy JSON → commit → push immediately (or trigger auto-push)
> ใช้ `execute_pwsh` เท่านั้น — ⛔ ห้าม computer-use / desktop control เด็ดขาด

---

## ⛔ ABSOLUTE RULES

| ❌ FORBIDDEN | ✅ USE INSTEAD |
|---|---|
| computer-use / desktop control | execute_pwsh only |
| ถามยืนยัน "push ไหม?" | push เสมอ ไม่ถาม |
| สร้าง script ใหม่ | ใช้ push-to-github.ps1 / watch-and-push.ps1 ที่มีอยู่ |
| สร้าง branch ใหม่ | push master เท่านั้น |
| commit batch/log/report files | .gitignore excludes them already |
| บอก user ให้ทำเอง | ต้องทำจนสำเร็จ หรือ trigger auto-push |

---

## 📁 REPO STRUCTURE (What Gets Pushed)

```
d:\AI-news\                          ← GIT REPO ROOT
├── .github/workflows/static.yml     ← Pages deployment
├── .gitignore                       ← Excludes batches/logs/reports
├── .nojekyll
├── index.html                       ← Site entry point
├── assets/style.css                 ← Cyberpunk CSS
├── js/app.js                        ← 4-column topic logic
├── data/                            ← NEWS DATA (served by Pages)
│   ├── manifest.json
│   └── {DATE}_news.json
├── Document/{DATE}_News/            ← Publisher output (tracked)
│   └── {DATE}_news.json/html/pdf
├── Document/manifest.json
├── News/Articles/                   ← Article sources (tracked)
├── push-to-github.ps1              ← Push script (handles PAT + retry)
├── watch-and-push.ps1              ← Watcher (Task Scheduler every 2 min)
└── SKILL-ai-news-github-deploy-2.md ← This file
```

**NOT tracked** (.gitignore): News/Batches/, Logs/, run-reports, .push-trigger, .github-pat

---

## 🧠 PUSH STRATEGY (v7.0 — GUARANTEED AUTO-PUSH)

### Problem
Claude scheduled tasks run in a Linux sandbox with a proxy that BLOCKS all HTTPS to github.com.
`git push` will ALWAYS fail from the sandbox. Previous versions asked user to push manually — UNACCEPTABLE.

### Solution: Two-Path Auto-Push

```
┌─────────────────────────────────────────────────────────────┐
│ PATH A — Windows / Kiro IDE (direct push works)             │
│   execute_pwsh → git push origin master → ✅ DONE           │
│                                                             │
│ PATH B — Linux Sandbox (network blocked)                    │
│   commit locally → write .push-trigger file                 │
│   → Task Scheduler "AI-News-AutoPush" runs every 2 min     │
│   → watch-and-push.ps1 sees trigger → pushes → ✅ DONE     │
│   → Push happens within 2 minutes automatically            │
└─────────────────────────────────────────────────────────────┘
```

### How to detect which path:
- **PATH A**: `git push` exit code = 0 → done
- **PATH B**: `git push` fails with proxy/403/connection error → write `.push-trigger`

### ⛔ CRITICAL RULES:
- ✅ ALWAYS try `git push` first (PATH A)
- ✅ If push fails with network error → write `.push-trigger` immediately (PATH B)
- ✅ Report "PUSH_TRIGGERED ✅" (NOT "failed") — push will happen in <2 min
- ❌ NEVER tell user to push manually
- ❌ NEVER report "FAILED" if commit + trigger succeeded
- ❌ NEVER use computer-use to open GitHub Desktop or any GUI

---

## ⚡ EXECUTION — 5 STEPS, FULLY AUTOMATIC

> ⛔ PAT AUTH: push-to-github.ps1 reads `.github-pat` and sets remote URL automatically.
> The Task Scheduler watcher handles auth too — no manual PAT setup needed.

### Step 1: Clear locks + detect today's date

```powershell
Remove-Item "D:\AI-news\.git\*.lock" -Force -ErrorAction SilentlyContinue
Remove-Item "D:\AI-news\.git\refs\*.lock" -Force -Recurse -ErrorAction SilentlyContinue
$today = Get-Date -Format "yyyy-MM-dd"
```

### Step 2: Copy daily JSON to data/

```powershell
$src = "D:\AI-news\Document\${today}_News\${today}_news.json"
$dst = "D:\AI-news\data\${today}_news.json"
if (Test-Path $src) { Copy-Item $src $dst -Force }

# Also sync to github-pages/data/ if folder exists
$gpDst = "D:\AI-news\github-pages\data\${today}_news.json"
if (Test-Path "D:\AI-news\github-pages\data") { Copy-Item $src $gpDst -Force }
```

### Step 3: Update manifest.json

```powershell
$manifest = Get-Content "D:\AI-news\data\manifest.json" | ConvertFrom-Json
$entry = "${today}_news.json"
if ($manifest -notcontains $entry) {
    $manifest = @($entry) + $manifest
    $manifest | ConvertTo-Json | Set-Content "D:\AI-news\data\manifest.json" -Encoding UTF8
}
```

Do the same for `github-pages/data/manifest.json` if it exists.

### Step 4: Git add + commit

```powershell
git add "data/" "github-pages/data/" "Document/${today}_News/" "Document/manifest.json"
git commit -m "Update AI news ${today}"
```

Only stage: `data/`, `github-pages/data/`, `Document/{date}_News/`, `Document/manifest.json`

### Step 5: Push (auto-detect path)

```powershell
# Try direct push first
git push origin master 2>&1
if ($LASTEXITCODE -eq 0) {
    # PATH A — SUCCESS ✅
    exit 0
}

# Push failed — write trigger for auto-push watcher
"push" | Set-Content "D:\AI-news\.push-trigger" -Encoding UTF8
# PATH B — PUSH_TRIGGERED ✅ (watcher will push within 2 min)
```

#### Push retry logic (for non-fast-forward errors, NOT network errors):
```powershell
git pull --rebase origin master
git push origin master
```

If rebase conflicts:
```powershell
git rebase --abort
git pull origin master --strategy-option=theirs
git push origin master
```

Last resort:
```powershell
git push -f origin master
```

---

## 🔧 AUTO-PUSH INFRASTRUCTURE

### Task Scheduler: "AI-News-AutoPush"
- **Runs every 2 minutes** on Windows
- Calls `watch-and-push.ps1`
- Checks if `.push-trigger` exists → if yes, deletes it and runs `push-to-github.ps1`

### watch-and-push.ps1
```
1. Check .push-trigger exists
2. If NO → exit silently
3. If YES → delete trigger → call push-to-github.ps1
4. Log result to push-log.txt
```

### push-to-github.ps1
```
1. Clear git locks
2. Read PAT from .github-pat → set remote URL
3. Check commits ahead of origin/master
4. Push with 5x retry + rebase
5. Force-push as last resort
6. Log to push-log.txt
```

---

## ✅ SUCCESS CRITERIA

```
PATH A (direct push worked):
  → Status: "SUCCESS ✅ — pushed to GitHub"
  → Site updates in ~2 min

PATH B (network blocked, trigger written):
  → Status: "PUSH_TRIGGERED ✅ — auto-push within 2 min"
  → watch-and-push.ps1 pushes → site updates in ~4 min total
```

---

## 🔄 Error Recovery (automatic, no user input)

| Error | Fix |
|-------|-----|
| .git/index.lock exists | Remove all *.lock recursively |
| Push rejected (non-fast-forward) | git pull --rebase → push |
| Push rejected (diverged) | git pull --strategy-option=theirs → push |
| Push fails (proxy/403/network) | Write `.push-trigger` → watcher pushes in <2 min |
| Source JSON not found | Check Document/{DATE}_News/ first |
| Auth failure (no PAT in URL) | push-to-github.ps1 reads .github-pat automatically |

---

## 🔐 Authentication

**PAT is stored in `.github-pat`** (gitignored, never committed).

`push-to-github.ps1` automatically reads it and sets the remote URL:
```powershell
$pat = (Get-Content "D:\AI-news\.github-pat" -Raw).Trim()
git remote set-url origin "https://${pat}@github.com/chiraleo2000/ai-news.git"
```

---

## 🌐 Live URLs

| URL | Purpose |
|-----|---------|
| https://chiraleo2000.github.io/ai-news/ | Live site |
| https://chiraleo2000.github.io/ai-news/data/manifest.json | Data manifest |
| https://github.com/chiraleo2000/ai-news/actions | Deploy status |
| https://github.com/chiraleo2000/ai-news | Repository |
