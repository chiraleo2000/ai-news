# ============================================================
# AI News — Publish Script (Commit + Push)
# ============================================================
# PURPOSE: Stage new JSON data & blog files, commit, and push
# USAGE:
#   pwsh -File publish-news.ps1
#   pwsh -File publish-news.ps1 -Message "Add 2026-07-01 news"
#
# WHAT IT DOES:
#   1. Clears stale git locks
#   2. Copies today's news JSON to github-pages/data/
#   3. Updates github-pages/data/manifest.json
#   4. Stages all new/modified data + document files
#   5. Commits with auto-generated message
#   6. Pushes to origin/master (with retry + rebase)
# ============================================================

param(
    [string]$RepoPath = "D:\AI-news",
    [string]$Message = "",
    [switch]$SkipPush = $false
)

Set-Location $RepoPath
$log = Join-Path $RepoPath "push-log.txt"
$ts  = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$today = Get-Date -Format "yyyy-MM-dd"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " AI News Publisher — $today" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Clear stale git locks ─────────────────────────────────
Write-Host "[1/6] Clearing stale git locks..." -ForegroundColor Yellow
Get-ChildItem (Join-Path $RepoPath ".git") -Recurse -Filter "*.lock" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

# ── 2. Sync JSON to github-pages/data/ ───────────────────────
Write-Host "[2/6] Syncing data JSON to github-pages/data/..." -ForegroundColor Yellow
$sourceData = Join-Path $RepoPath "data"
$destData   = Join-Path $RepoPath "github-pages\data"

if (Test-Path $sourceData) {
    # Copy all news JSON files
    Get-ChildItem $sourceData -Filter "*_news.json" | ForEach-Object {
        $destFile = Join-Path $destData $_.Name
        if (-not (Test-Path $destFile) -or (Get-Item $_.FullName).LastWriteTime -gt (Get-Item $destFile).LastWriteTime) {
            Copy-Item $_.FullName $destFile -Force
            Write-Host "  Copied: $($_.Name)" -ForegroundColor Gray
        }
    }
    # Copy manifest
    $srcManifest = Join-Path $sourceData "manifest.json"
    if (Test-Path $srcManifest) {
        Copy-Item $srcManifest (Join-Path $destData "manifest.json") -Force
        Write-Host "  Copied: manifest.json" -ForegroundColor Gray
    }
}

# ── 3. Ensure git user config ────────────────────────────────
Write-Host "[3/6] Checking git config..." -ForegroundColor Yellow
$email = git config user.email 2>$null
if (-not $email) {
    git config user.email "ai-news-bot@chiraleo2000.github.io"
    git config user.name "AI News Bot"
}

# ── 4. Stage files ───────────────────────────────────────────
Write-Host "[4/6] Staging files..." -ForegroundColor Yellow

# Stage data files
git add "data/*.json" 2>$null
git add "github-pages/data/*.json" 2>$null

# Stage documents
git add "Document/" 2>$null

# Stage news articles (blogs)
git add "News/" 2>$null

# Stage github-pages site files (HTML, JS, CSS)
git add "github-pages/index.html" 2>$null
git add "github-pages/js/" 2>$null
git add "github-pages/assets/" 2>$null

# Stage logs
git add "Logs/" 2>$null

# Check if there's anything to commit
$status = git status --porcelain 2>$null
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host ""
    Write-Host "Nothing to commit. Working tree is clean." -ForegroundColor Green
    "$ts [SKIP] Nothing to commit" | Add-Content $log
    exit 0
}

# Show summary of staged files
$stagedCount = (git diff --cached --name-only 2>$null | Measure-Object).Count
Write-Host "  Staged $stagedCount file(s)" -ForegroundColor Gray

# ── 5. Commit ────────────────────────────────────────────────
Write-Host "[5/6] Committing..." -ForegroundColor Yellow

if ([string]::IsNullOrWhiteSpace($Message)) {
    # Auto-generate commit message
    $newJsonFiles = git diff --cached --name-only --diff-filter=A 2>$null | 
        Where-Object { $_ -like "data/*_news.json" -or $_ -like "github-pages/data/*_news.json" }
    $newsCount = (git diff --cached --name-only 2>$null | Where-Object { $_ -like "News/*" } | Measure-Object).Count
    $docCount  = (git diff --cached --name-only 2>$null | Where-Object { $_ -like "Document/*" } | Measure-Object).Count

    $Message = "Update AI news $today"
    $parts = @()
    if ($newsCount -gt 0) { $parts += "$newsCount articles" }
    if ($docCount -gt 0)  { $parts += "$docCount documents" }
    if ($parts.Count -gt 0) { $Message += " ($($parts -join ', '))" }
}

git commit -m $Message 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Commit failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Committed: $Message" -ForegroundColor Gray
"$ts [COMMIT] $Message" | Add-Content $log

# ── 6. Push ──────────────────────────────────────────────────
if ($SkipPush) {
    Write-Host ""
    Write-Host "Skipping push (-SkipPush flag set)" -ForegroundColor Yellow
    exit 0
}

Write-Host "[6/6] Pushing to origin/master..." -ForegroundColor Yellow

$maxRetries = 5
$pushed = $false

for ($i = 1; $i -le $maxRetries; $i++) {
    Write-Host "  Attempt $i/$maxRetries..." -ForegroundColor Gray
    $output = git push origin master 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pushed = $true
        "$ts [OK] Push succeeded on attempt $i" | Add-Content $log
        break
    }

    # Pull with rebase to get ahead of remote
    Write-Host "  Failed — pulling with rebase..." -ForegroundColor Gray
    git pull --rebase origin master 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        # If rebase fails, abort and try merge with theirs strategy
        git rebase --abort 2>$null
        git pull origin master --strategy-option=theirs 2>&1 | Out-Null
    }
    Start-Sleep -Seconds 2
}

# Force push as last resort
if (-not $pushed) {
    Write-Host "  Force pushing as last resort..." -ForegroundColor Yellow
    git push -f origin master 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pushed = $true
        "$ts [OK] Force push succeeded" | Add-Content $log
    }
}

# ── Result ────────────────────────────────────────────────────
Write-Host ""
if ($pushed) {
    Write-Host "SUCCESS: Published to GitHub Pages" -ForegroundColor Green
    Write-Host "  Site: https://chiraleo2000.github.io/ai-news/" -ForegroundColor Cyan
    Write-Host "  Repo: https://github.com/chiraleo2000/ai-news" -ForegroundColor Cyan
    "$ts [DONE] Publish complete" | Add-Content $log
    exit 0
} else {
    Write-Host "FAILED: Could not push after all attempts" -ForegroundColor Red
    "$ts [FAIL] Push failed" | Add-Content $log
    exit 1
}
