@echo off
cd /d D:\ai-news
echo [%DATE% %TIME%] Starting git push... > D:\ai-news\push-log.txt
git push origin master >> D:\ai-news\push-log.txt 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Push succeeded >> D:\ai-news\push-log.txt
    echo SUCCESS - Site: https://chiraleo2000.github.io/ai-news/
) else (
    echo [RETRY] Pull rebase then push... >> D:\ai-news\push-log.txt
    git pull --rebase origin master >> D:\ai-news\push-log.txt 2>&1
    git push origin master >> D:\ai-news\push-log.txt 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Push succeeded after rebase >> D:\ai-news\push-log.txt
        echo SUCCESS after rebase
    ) else (
        echo [FORCE] Force pushing... >> D:\ai-news\push-log.txt
        git push -f origin master >> D:\ai-news\push-log.txt 2>&1
        echo [DONE] Check push-log.txt for result >> D:\ai-news\push-log.txt
    )
)
echo Done. Check D:\ai-news\push-log.txt for details.
timeout /t 3
