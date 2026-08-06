---
name: ai-news-github-deploy
description: >
  Deploy today's AI news JSON to chiraleo2000/ai-news (GitHub Pages).
  MUST run on Windows Cursor Shell (not Linux sandbox). Copies Document JSON into
  data/ (+ github-pages/data mirror), updates manifests, commits allowed paths only,
  then git push master until SUCCESS. Never ask questions, never use computer-use,
  never create .push-trigger / .ps1 / Task Scheduler files, never ask user to push.
---

# SKILL: ai-news-github-deploy v9.0

## CRITICAL: where this skill may run

| Runtime | Allowed? | Why |
|---------|----------|-----|
| **Cursor Agent Shell on Windows** (`C:\Users\AI-PC-DEV\Documents\ai-news`) | ✅ REQUIRED | Can delete `.git/*.lock`, has GitHub network, `git push` works |
| Linux `/sessions/*/mnt/...` sandbox | ❌ FORBIDDEN for push | NTFS locks + proxy block GitHub |
| computer-use / desktop / GUI | ❌ FORBIDDEN | Unattended approval dialogs fail |

If you detect Linux sandbox (`/sessions/` path, no outbound GitHub):

1. You may still copy JSON + update manifests (files sync to Windows disk).
2. **Do NOT** write `.push-trigger`, `.ps1`, `.bat`, `.cmd`, or status reminder files.
3. **Do NOT** tell the user to run `git push`.
4. Final reply: `BLOCKED: sandbox has no GitHub network — re-run this skill in Cursor on Windows to push.`
5. Stop. Do not claim SUCCESS.

**Push success only counts when `git push origin master` exits 0 from Windows Shell and `HEAD == origin/master`.**

## Hard rules

- Do NOT ask questions or confirmation. Finish in one run.
- Shell/PowerShell only. Branch `master` only.
- NEVER stage/commit: `*.ps1`, `*.bat`, `*.bundle`, `.github-pat`, `.push-trigger`, `TRIGGER-PUSH.txt`, logs, batches, reports.
- NEVER put a PAT into a committed file. If auth needs `.github-pat`, set remote URL only for the push, then restore to `https://github.com/chiraleo2000/ai-news.git`.
- NEVER create `.push-trigger` or report `PUSH_TRIGGERED`. Retry push until it works, or report BLOCKED/ERROR.

## Paths

| Item | Path |
|------|------|
| Repo root | `C:\Users\AI-PC-DEV\Documents\ai-news` |
| Source | `Document/{date}_News/{date}_news.json` |
| Data | `data/{date}_news.json` + `data/manifest.json` |
| Mirror | `github-pages/data/` (same files, if folder exists) |
| Live | https://chiraleo2000.github.io/ai-news/ |
| Clean remote | `https://github.com/chiraleo2000/ai-news.git` |

## Execution (PowerShell — all steps)

```powershell
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\AI-PC-DEV\Documents\ai-news"
$REPO = (git rev-parse --show-toplevel).Trim()
Set-Location $REPO

# 1–2. Clear locks
Get-ChildItem .git -Recurse -Filter "*.lock" -ErrorAction SilentlyContinue |
  Remove-Item -Force -ErrorAction SilentlyContinue

# 3. Date
$today = Get-Date -Format "yyyy-MM-dd"
$src = Join-Path $REPO "Document\${today}_News\${today}_news.json"
if (-not (Test-Path $src)) {
  Write-Output "ERROR: missing source Document/${today}_News/${today}_news.json"
  exit 2
}

# 4–5. Copy JSON
$dest = Join-Path $REPO "data\${today}_news.json"
Copy-Item $src $dest -Force
$gpData = Join-Path $REPO "github-pages\data"
if (Test-Path $gpData) {
  Copy-Item $src (Join-Path $gpData "${today}_news.json") -Force
}

# 6. Prepend manifests (no duplicates)
function Update-Manifest([string]$path, [string]$entry) {
  if (-not (Test-Path $path)) { return }
  python -c @"
import json
entry = '$entry'
path = r'$path'
with open(path, 'r', encoding='utf-8') as f:
    m = json.load(f)
if not isinstance(m, list):
    m = []
if entry not in m:
    m = [entry] + [x for x in m if x != entry]
with open(path, 'w', encoding='utf-8') as f:
    json.dump(m, f, ensure_ascii=False, indent=2)
print(f'[MANIFEST] {path} -> {len(m)} entries, first={m[0]}')
"@
}
$entry = "${today}_news.json"
Update-Manifest (Join-Path $REPO "data\manifest.json") $entry
if (Test-Path $gpData) {
  Update-Manifest (Join-Path $gpData "manifest.json") $entry
}

# 7. Stage ONLY allowed paths
git add -- "data/"
if (Test-Path $gpData) { git add -- "github-pages/data/" }
git add -- "Document/${today}_News/"
if (Test-Path "Document\manifest.json") { git add -- "Document/manifest.json" }

# Unstage forbidden junk if accidentally matched
git reset HEAD -- "*.ps1" "*.bat" "*.bundle" ".github-pat" ".push-trigger" "TRIGGER-PUSH.txt" 2>$null

# 8. Commit if needed
$staged = git diff --cached --name-only
if (-not $staged) {
  # Still push if ahead of origin
  git fetch origin 2>$null
  $ahead = [int](git rev-list --count "origin/master..HEAD" 2>$null)
  if ($ahead -eq 0) {
    Write-Output "SUCCESS ✅ — nothing new to commit"
    exit 0
  }
} else {
  git commit -m "Update AI news $today"
}

# Auth helper: temporary PAT from .github-pat if present
$cleanRemote = "https://github.com/chiraleo2000/ai-news.git"
$patFile = Join-Path $REPO ".github-pat"
$usedPat = $false
if (Test-Path $patFile) {
  $pat = (Get-Content $patFile -Raw).Trim()
  if ($pat) {
    git remote set-url origin "https://$pat@github.com/chiraleo2000/ai-news.git"
    $usedPat = $true
  }
}

# 9–10. Push with retries (must succeed on Windows)
$ok = $false
for ($i = 1; $i -le 5; $i++) {
  Get-ChildItem .git -Recurse -Filter "*.lock" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue
  git push origin master
  if ($LASTEXITCODE -eq 0) { $ok = $true; break }
  if ($i -le 2) {
    git pull --rebase origin master
  } elseif ($i -eq 3) {
    git fetch origin
    git pull origin master --allow-unrelated-histories
  }
  Start-Sleep -Seconds 2
}

if ($usedPat) {
  git remote set-url origin $cleanRemote
}

if (-not $ok) {
  Write-Output "BLOCKED: sandbox has no GitHub network — re-run this skill in Cursor on Windows to push."
  exit 1
}

git fetch origin
if ((git rev-parse HEAD) -ne (git rev-parse origin/master)) {
  Write-Output "BLOCKED: sandbox has no GitHub network — re-run this skill in Cursor on Windows to push."
  exit 1
}

Write-Output "SUCCESS ✅ — pushed to GitHub — https://chiraleo2000.github.io/ai-news/"
```

## Final reply (exactly one line)

- `SUCCESS ✅ — pushed to GitHub — https://chiraleo2000.github.io/ai-news/`
- `SUCCESS ✅ — nothing new to commit`
- `BLOCKED: sandbox has no GitHub network — re-run this skill in Cursor on Windows to push.`
- `ERROR: missing source Document/{date}_News/{date}_news.json`

⛔ Removed (do not use): `PUSH_TRIGGERED`, `.push-trigger`, Task Scheduler, manual `git push` instructions.

## Success criteria

- `data/{date}_news.json` present (and github-pages mirror if applicable)
- Manifest(s) have `{date}_news.json` at index 0
- `git rev-parse HEAD` equals `origin/master`
- User was never asked to run a command
