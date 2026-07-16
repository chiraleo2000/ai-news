# ============================================================
# AI News — GitHub Push Script (universal)
# ============================================================
# PURPOSE: Push local commits to origin/master on GitHub
# USAGE:
#   1. Windows Task Scheduler (daily auto-push)
#   2. Manual: pwsh -File push-to-github.ps1
#   3. Called by Claude after committing locally
#
# BEHAVIOR:
#   - Clears stale git locks
#   - Checks if there are unpushed commits
#   - Pushes with retry + rebase logic
#   - Force-pushes as last resort
#   - Logs results to push-log.txt
#
# REQUIREMENTS:
#   - Git installed and on PATH
#   - PAT embedded in remote URL (already configured)
#   - Run from D:\ai-news or set -RepoPath parameter
# ============================================================

param(
    [string]$RepoPath = "D:\ai-news"
)

Set-Location $RepoPath
$log = Join-Path $RepoPath "push-log.txt"
$ts  = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# ── 1. Clear stale git locks ─────────────────────────────────
Get-ChildItem (Join-Path $RepoPath ".git") -Recurse -Filter "*.lock" -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

# ── 2. Ensure git user config + PAT in remote URL ────────────
$email = git config user.email 2>$null
if (-not $email) {
    git config user.email "ai-news-bot@chiraleo2000.github.io"
    git config user.name "AI News Bot"
}

# Ensure PAT is embedded in remote URL (required for scheduled/auto push)
$currentUrl = git remote get-url origin 2>$null
if ($currentUrl -notlike "*ghp_*") {
    $patFile = Join-Path $RepoPath ".github-pat"
    if (Test-Path $patFile) {
        $pat = (Get-Content $patFile -Raw).Trim()
        git remote set-url origin "https://${pat}@github.com/chiraleo2000/ai-news.git"
        Write-Host "  PAT set in remote URL"
    }
}

# ── 3. Check if there are commits to push ────────────────────
$ahead = git rev-list --count origin/master..HEAD 2>$null
if ($ahead -eq "0" -or [string]::IsNullOrWhiteSpace($ahead)) {
    "$ts [SKIP] Nothing to push (0 commits ahead)" | Tee-Object -FilePath $log -Append
    Write-Host "Nothing to push. Repo is up to date with origin/master."
    exit 0
}
"$ts [START] Pushing $ahead commit(s) to origin/master..." | Tee-Object -FilePath $log -Append

# ── 4. Push with retry logic ─────────────────────────────────
$maxRetries = 5
$pushed = $false

for ($i = 1; $i -le $maxRetries; $i++) {
    Write-Host "Push attempt $i/$maxRetries..."
    $output = git push origin master 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pushed = $true
        "$ts [OK] Push succeeded on attempt $i" | Tee-Object -FilePath $log -Append
        break
    }

    "$ts [RETRY $i] Push failed, rebasing..." | Add-Content $log
    Write-Host "  Push failed. Pulling with rebase..."

    git pull --rebase origin master 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        git rebase --abort 2>$null
        git pull origin master --strategy-option=theirs 2>&1 | Out-Null
    }
    Start-Sleep -Seconds 2
}

# ── 5. Force push as last resort ─────────────────────────────
if (-not $pushed) {
    "$ts [FORCE] Force pushing after $maxRetries failed attempts..." | Add-Content $log
    Write-Host "Force pushing..."
    git push -f origin master 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pushed = $true
        "$ts [OK] Force push succeeded" | Add-Content $log
    }
}

# ── 6. Final result ──────────────────────────────────────────
if ($pushed) {
    Write-Host ""
    Write-Host "SUCCESS: Pushed to GitHub Pages" -ForegroundColor Green
    Write-Host "  Site: https://chiraleo2000.github.io/ai-news/"
    Write-Host "  Actions: https://github.com/chiraleo2000/ai-news/actions"
    "$ts [DONE] Push complete. Site will update in ~2 min." | Add-Content $log
    exit 0
} else {
    Write-Host ""
    Write-Host "FAILED: Could not push after $maxRetries attempts + force push" -ForegroundColor Red
    "$ts [FAIL] All push attempts failed" | Add-Content $log
    exit 1
}
