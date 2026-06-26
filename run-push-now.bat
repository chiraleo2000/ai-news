@echo off
cd /d D:\ai-news
echo Pushing AI news 2026-06-25 to GitHub...
git push origin master
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS - GitHub Pages will update shortly
    echo Site: https://chiraleo2000.github.io/ai-news/
) else (
    echo Push failed with code %ERRORLEVEL%, trying pull+rebase...
    git pull --rebase origin master
    git push origin master
)
pause
