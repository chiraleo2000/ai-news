# setup-auto-push.ps1
# Run this ONCE as Administrator to set up daily auto-push to GitHub.
# After this, Windows Task Scheduler handles the push every day at 4:00 AM.

$taskName = "AI-News-GitHub-Push"
$repoPath = "D:\ai-news"
$scriptPath = "$repoPath\do-git-push.ps1"

# --- Create the push script that Task Scheduler will call ---
$pushScript = @'
Set-Location "D:\ai-news"
$logFile = "D:\ai-news\push-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Fix corrupt git index if present
$lockFile = "D:\ai-news\.git\index.lock"
if (Test-Path $lockFile) { Remove-Item $lockFile -Force }

# Attempt push with retry
$attempt = 0
$success = $false
while ($attempt -lt 5 -and -not $success) {
    $attempt++
    Write-Host "Attempt $attempt: git push origin master"
    git push origin master 2>&1
    if ($LASTEXITCODE -eq 0) {
        $success = $true
        "$timestamp [OK] Push succeeded on attempt $attempt" | Add-Content $logFile
    } else {
        "$timestamp [RETRY $attempt] Push failed, pulling rebase..." | Add-Content $logFile
        git pull --rebase origin master 2>&1
        Start-Sleep -Seconds 5
    }
}
if (-not $success) {
    "$timestamp [FAIL] All 5 push attempts failed" | Add-Content $logFile
    git push -f origin master 2>&1
    if ($LASTEXITCODE -eq 0) {
        "$timestamp [OK] Force push succeeded" | Add-Content $logFile
    } else {
        "$timestamp [FATAL] Force push also failed" | Add-Content $logFile
    }
}
'@

$pushScript | Set-Content $scriptPath -Encoding UTF8
Write-Host "Created: $scriptPath"

# --- Register Windows Task Scheduler task ---
$action = New-ScheduledTaskAction `
    -Execute "pwsh.exe" `
    -Argument "-NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`"" `
    -WorkingDirectory $repoPath

# Run daily at 4:00 AM (after scraper finishes)
$trigger = New-ScheduledTaskTrigger -Daily -At "04:00"

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1)

# Remove existing task if present
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Description "Auto-push AI news JSON to GitHub Pages daily at 4 AM"

Write-Host ""
Write-Host "Task Scheduler task '$taskName' created - runs daily at 4:00 AM" -ForegroundColor Green
Write-Host ""

# --- Push right now immediately ---
Write-Host "Pushing today's news NOW..." -ForegroundColor Cyan
Set-Location $repoPath
$lockFile = "D:\ai-news\.git\index.lock"
if (Test-Path $lockFile) { Remove-Item $lockFile -Force }
git push origin master
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS - Today's news is live!" -ForegroundColor Green
    Write-Host "Site: https://chiraleo2000.github.io/ai-news/" -ForegroundColor Green
} else {
    Write-Host "Push failed, trying pull+rebase..." -ForegroundColor Yellow
    git pull --rebase origin master
    git push origin master
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS after rebase!" -ForegroundColor Green
    } else {
        Write-Host "Force pushing..." -ForegroundColor Yellow
        git push -f origin master
    }
}
