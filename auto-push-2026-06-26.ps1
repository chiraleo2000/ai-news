# Auto-generated push script for 2026-06-25 + 2026-06-26
# Run this from D:\ai-news to push both committed news files
Set-Location "D:\ai-news"
Write-Host "Starting git push (2 pending commits: 2026-06-25 + 2026-06-26)..."
git log --oneline origin/master..HEAD 2>$null
git push origin master
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Pushed AI news to GitHub Pages"
    Write-Host "Site: https://chiraleo2000.github.io/ai-news/"
    Write-Host "Actions: https://github.com/chiraleo2000/ai-news/actions"
    Remove-Item "D:\ai-news\auto-push-2026-06-26.ps1" -Force -ErrorAction SilentlyContinue
    Remove-Item "D:\ai-news\auto-push-2026-06-25.ps1" -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "FAILED: trying pull --rebase then push..."
    git pull --rebase origin master
    git push -f origin master
}
