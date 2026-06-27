# ============================================================
# AI News — Task Scheduler Setup (Run ONCE as Administrator)
# ============================================================
# Registers a Windows Task Scheduler job that runs push-to-github.ps1
# daily at 11:30 AM. This ensures any commits made by Claude's
# scheduled tasks get pushed even if the sandbox couldn't push.
#
# After running this once, you can delete this file.
# The actual push logic lives in: push-to-github.ps1
# ============================================================

$taskName   = "AI-News-GitHub-AutoPush"
$repoPath   = "D:\ai-news"
$pushScript = Join-Path $repoPath "push-to-github.ps1"

# Verify push script exists
if (-not (Test-Path $pushScript)) {
    Write-Host "ERROR: $pushScript not found!" -ForegroundColor Red
    exit 1
}

# Register Task Scheduler
$action = New-ScheduledTaskAction `
    -Execute "pwsh.exe" `
    -Argument "-NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$pushScript`"" `
    -WorkingDirectory $repoPath

$trigger = New-ScheduledTaskTrigger -Daily -At "11:30AM"

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
    -RestartCount 2 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable $true

# Remove old task if exists, then register new
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Description "Auto-push AI news commits to GitHub Pages (daily 11:30 AM)" | Out-Null

Write-Host "Task '$taskName' registered successfully." -ForegroundColor Green
Write-Host "  Runs daily at 11:30 AM"
Write-Host "  Script: $pushScript"
Write-Host ""
Write-Host "To test now, run:" -ForegroundColor Cyan
Write-Host "  pwsh -File `"$pushScript`""
