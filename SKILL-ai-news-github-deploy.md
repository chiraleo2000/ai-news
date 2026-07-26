---
name: ai-news-github-deploy
description: >
  Auto-deploy daily AI news JSON to chiraleo2000/ai-news GitHub Pages.
  MUST run in Cursor Windows Shell (not Linux sandbox). Copy JSON, update manifests,
  git push master until SUCCESS. Never ask user to push. No .ps1 / .push-trigger / Task Scheduler.
agents: [main_agent, general_purpose]
trigger:
  - "deploy ai news"
  - "push ai-news"
  - "update ai news github"
  - "ai-news deploy"
---

# SKILL: ai-news-github-deploy v9.0

> Full steps: [ai-news-github-deploy-SKILL.md](ai-news-github-deploy-SKILL.md)

**Runtime:** Cursor Agent on Windows only. Linux `/sessions/` sandbox cannot push.

**Never** write `.push-trigger` or tell the user to run `git push`. If sandbox-blocked, say re-run in Cursor Windows.

## Flow

1. Clear `.git` locks
2. Copy `Document/{today}_News/{today}_news.json` → `data/` (+ `github-pages/data/` if present)
3. Prepend manifests
4. `git add` only: `data/`, `github-pages/data/`, `Document/{today}_News/`, `Document/manifest.json`
5. Commit `Update AI news {today}` if needed → `git push origin master` (retry / rebase) → verify `HEAD == origin/master`

Live: https://chiraleo2000.github.io/ai-news/
