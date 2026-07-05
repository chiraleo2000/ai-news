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

# SKILL: ai-news-github-deploy v6.0

> **One-shot auto-deploy** — copy JSON → commit → push immediately
> ใช้ `execute_pwsh` เท่านั้น — ห้าม computer-use / desktop control

---

## ⛔ ABSOLUTE RULES

| ❌ FORBIDDEN | ✅ USE INSTEAD |
|---|---|
| computer-use / desktop control | execute_pwsh |
| ถามยืนยัน "push ไหม?" | push เสมอ ไม่ถาม |
| สร้าง .push-trigger / watcher | push ตรงจาก execute_pwsh |
| สร้าง script ใหม่ | ใช้ push-to-github.ps1 ที่มีอยู่ |
| สร้าง branch ใหม่ | push master เท่านั้น |
| commit batch/log/report files | ใช้ .gitignore exclude แล้ว |

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
├── push-to-github.ps1              ← Push script
└── SKILL-ai-news-github-deploy-2.md ← This file
```

**NOT tracked** (in .gitignore): News/Batches/, Logs/, run-reports, .push-trigger, weekly summaries

---

## ⚡ EXECUTION — 5 STEPS, FULLY AUTOMATIC

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
```

Also sync to github-pages/data/ if that folder exists:
```powershell
$gpDst = "D:\AI-news\github-pages\data\${today}_news.json"
if (Test-Path "D:\AI-news\github-pages\data") { Copy-Item $src $gpDst -Force }
```

### Step 3: Update manifest.json

Read `data/manifest.json`, add `"{DATE}_news.json"` at index 0 if not already present, write back.

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
**Never stage**: Batches, Logs, run-reports, .push-trigger, scripts

### Step 5: Push immediately

```powershell
git push origin master
```

If push fails with "non-fast-forward" / "rejected":
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

Last resort (after 5 failures):
```powershell
git push -f origin master
```

---

## ✅ SUCCESS = push exit code 0

After push succeeds, the site updates within ~2 minutes via GitHub Actions.

| URL | Purpose |
|-----|---------|
| https://chiraleo2000.github.io/ai-news/ | Live site |
| https://chiraleo2000.github.io/ai-news/data/manifest.json | Data manifest |
| https://github.com/chiraleo2000/ai-news/actions | Deploy status |

---

## 🔄 Error Recovery (automatic, no user input)

| Error | Fix |
|-------|-----|
| .git/index.lock exists | Remove all *.lock recursively |
| Push rejected (non-fast-forward) | git pull --rebase → push |
| Push rejected (diverged) | git pull --strategy-option=theirs → push |
| Source JSON not found | Check Document/{DATE}_News/ exists first |
| Authentication failure | Re-set remote: `git remote set-url origin "https://$(Get-Content .github-pat)@github.com/chiraleo2000/ai-news.git"` |

---

## 🔐 Authentication

**PAT is stored in `.github-pat` file** (excluded from git via .gitignore).

**Remote URL must have PAT embedded for auto-push to work.**

⛔ Before every push attempt, ensure remote URL has PAT:
```powershell
$pat = (Get-Content "D:\AI-news\.github-pat" -Raw).Trim()
$currentUrl = git remote get-url origin
if ($currentUrl -notlike "*ghp_*") {
    git remote set-url origin "https://${pat}@github.com/chiraleo2000/ai-news.git"
}
```

**For Claude scheduled tasks (Linux sandbox):**
```bash
PAT=$(cat /path/to/.github-pat | tr -d '\n')
git remote set-url origin "https://${PAT}@github.com/chiraleo2000/ai-news.git"
```

**If push gives 403 or auth error → re-read PAT from file and set remote URL.**
