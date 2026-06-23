# Deploy Report — 2026-06-22

## Status: ✅ LIVE & WORKING

### Site
- **URL:** https://chiraleo2000.github.io/ai-news/
- **Actions:** https://github.com/chiraleo2000/ai-news/actions
- **Remote:** https://github.com/chiraleo2000/ai-news.git
- **Branch:** master

### Root Cause of 404 (FIXED)
The `github-pages/` directory had a **nested .git structure** (`.git/.git`).
Previous git commands (`git -C github-pages`) resolved to the PARENT repo's `.git`,
so commits never went to the correct remote.

**Fix:** Use explicit `--git-dir` flag:
```powershell
git --git-dir="d:\ai-news\github-pages\.git\.git" --work-tree="d:\ai-news\github-pages" <command>
```

### Files on GitHub (confirmed via API)
```
index.html              ← Main page (4-column layout)
assets/style.css        ← Light cyberpunk CSS
js/app.js               ← Topic classification + filters
data/manifest.json      ← ["2026-06-22_news.json"]
data/2026-06-22_news.json ← 34 articles
.nojekyll
.github/workflows/static.yml
```

### UI Features
- **4-column layout**: AI Trends (15) | Tech Trends (5) | Thailand (11) | Global (3)
- **Filters**: Date archive, urgency, source dropdown, text search
- **Blog cards**: Urgency indicator, title, excerpt, tags, breakthrough badge
- **Modal detail**: Full content, tech impact, dev/biz actions, source link
- **Light cyberpunk theme**: Neon accents on light background, Orbitron font

### Daily Update Process
1. Run SKILL-MASTER → scrape news into batches
2. Run SKILL-publisher → create `Document/{date}_News/{date}_news.json`
3. Copy JSON → `github-pages/data/{date}_news.json`
4. Update `github-pages/data/manifest.json` (add new date at index 0)
5. Git commit + push (using `--git-dir` flag!)
6. GitHub Actions auto-deploys → new date appears in archive dropdown
