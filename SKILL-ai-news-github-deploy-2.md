---
name: ai-news-github-deploy
description: >
  Deploy daily AI news JSON to https://chiraleo2000.github.io/ai-news/
  Copies JSON → github-pages/data/ → git push → GitHub Actions deploys.
  CRITICAL: uses --git-dir flag (nested .git/.git structure).
agents: [main_agent, general_purpose]
trigger:
  - "deploy github pages ai"
  - "update github ai news"
  - "push ai news pages"
  - "ai-news deploy"
  - "สร้างเว็บข่าว AI"
requires:
  - ai-news-publisher
---
# SKILL: ai-news-github-deploy v3.0

---

## ⛔ ABSOLUTE RULES

```
✅ Use execute_pwsh only — NO computer-use, NO desktop control
✅ Push MUST succeed — retry up to 5 times, force push on attempt 5
✅ Never ask permission — just do it
✅ Report "completed" ONLY after push exit code = 0

⛔ CRITICAL GIT STRUCTURE:
  github-pages/.git/       ← NOT the real git (it's a wrapper dir)
  github-pages/.git/.git/  ← REAL git database (use this)

  EVERY git command:
  git --git-dir="d:\ai-news\github-pages\.git\.git" ^
      --work-tree="d:\ai-news\github-pages" <cmd>

  ❌ NEVER: git -C d:\ai-news\github-pages (resolves to parent repo!)
  ❌ NEVER: cd github-pages && git (same problem!)
```

---

## ⚡ Execution Steps

```
PATHS:
  GIT  = git --git-dir="d:\ai-news\github-pages\.git\.git" --work-tree="d:\ai-news\github-pages"
  SRC  = d:\ai-news\Document\{DATE}_News\{DATE}_news.json
  DEST = d:\ai-news\github-pages\data\{DATE}_news.json
  MFT  = d:\ai-news\github-pages\data\manifest.json
  SITE = https://chiraleo2000.github.io/ai-news/
  REPO = https://github.com/chiraleo2000/ai-news.git

Step 0 — Clear lock:
  if (Test-Path "d:\ai-news\github-pages\.git\.git\index.lock") {
    Remove-Item "d:\ai-news\github-pages\.git\.git\index.lock" -Force
  }

Step 1 — Source JSON:
  If SRC missing → build from batches (see Fallback)
  If SRC exists → proceed

Step 2 — Copy JSON:
  Copy-Item SRC DEST -Force

Step 3 — Update manifest.json:
  Read MFT → parse JSON array
  If "{DATE}_news.json" not at [0] → prepend it
  Write back as valid JSON array (sorted newest-first)

Step 3.5 — Validate manifest:
  Must: parse OK | closing ] | {DATE} at index 0 | file > 50 bytes
  If invalid → fix → rewrite → re-validate before proceeding

Step 3.6 — Verify site files exist:
  index.html | assets/style.css | js/app.js | .nojekyll | .github/workflows/static.yml
  If any missing → recreate before commit

Step 4 — Git commit + push:
  $GIT add -A
  $GIT commit -m "Add AI news {DATE}"
  $GIT push origin master

Step 5 — Retry on failure:
  Attempt 2: pull --rebase origin master → push origin master
  Attempt 3: fetch origin; reset --soft origin/master; add -A; commit; push
  Attempt 4: pull --allow-unrelated-histories → push
  Attempt 5: push -f origin master

Step 6 — Verify + report
```

---

## 🔄 Fallback: Build JSON from scratch

```
1. Find News\Batches\{DATE}\batch_*.json → extract articles arrays → combine
   OR find News\Articles\**\{DATE}\**\article.json (fetch.status=pass)
2. Classify each article → topic_group
3. Ensure content = 100-150 words (trim/expand if needed)
4. Produce:
{
  "date": "{DATE}", "generated_at": "ISO-8601", "schema_version": "3.0",
  "stats": { "total": N, "by_topic": {...}, "by_category": {...} },
  "posts": [{ ...full post object with topic_group + 100-150 word content ... }]
}
5. Write directly to github-pages/data/{DATE}_news.json
6. Continue to Step 3 (update manifest)
```

---

## 📋 Config

| Key | Value |
|-----|-------|
| Git remote | `https://github.com/chiraleo2000/ai-news.git` |
| Site URL | `https://chiraleo2000.github.io/ai-news/` |
| Actions URL | `https://github.com/chiraleo2000/ai-news/actions` |
| Branch | `master` |
| Real git DB | `d:\ai-news\github-pages\.git\.git` |

---

## 📊 Completion Report

```json
{
  "date": "{DATE}",
  "json_copied": true,
  "manifest_valid": true,
  "manifest_entry_at_index_0": "{DATE}_news.json",
  "git_pushed": true,
  "push_attempts": 1,
  "site_url": "https://chiraleo2000.github.io/ai-news/",
  "actions_url": "https://github.com/chiraleo2000/ai-news/actions",
  "status": "SUCCESS ✅"
}
```

---

## 🔗 Full Pipeline

```
SKILL-MASTER   → News/Batches/{DATE}/batch_*.json
SKILL-publisher → Document/{DATE}_News/{DATE}_news.json + github-pages/data/ copy
SKILL-deploy   → git push → GitHub Actions → https://chiraleo2000.github.io/ai-news/

Site reads: data/manifest.json → data/{DATE}_news.json
JS classifies posts into 4 columns: AI Trends | Tech Trends | Thailand | Global
```
