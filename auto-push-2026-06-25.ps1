# Auto-generated push script for 2026-06-25
# Run this from D:\ai-news to push the committed news data
Set-Location "D:\ai-news"
Write-Host "Starting git push for 2026-06-25 news..."
git push origin master
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Pushed AI news 2026-06-25 to GitHub Pages"
    Write-Host "Site: https://chiraleo2000.github.io/ai-news/"
    Remove-Item "D:\ai-news\auto-push-2026-06-25.ps1" -Force
} else {
    Write-Host "FAILED: git push returned $LASTEXITCODE"
    git pull --rebase origin master
    git push origin master
}
