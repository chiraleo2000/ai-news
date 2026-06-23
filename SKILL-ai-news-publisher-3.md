---
name: ai-news-publisher
description: >
  AI News Publisher v3.0 — reads batch JSON / article.json files, produces
  daily package: comprehensive JSON + HTML + PDF. Copies to github-pages/data/.
  Summary per post: 100-150 words enforced.
agents: [main_agent, general_purpose]
trigger:
  - "publish ข่าว AI"
  - "สร้าง AI daily digest"
  - "combine ข่าว AI รายวัน"
  - "เผยแพร่ข่าว AI"
  - "generate ai content json"
requires:
  - ai-news-master-pipeline
---
# SKILL: ai-news-publisher v3.0

---

## 🎯 Skill Prompt

```
<skill>ai-news-publisher v3.0</skill>
date: {TARGET_DATE}

⛔ INPUT (read in this order):
  1. News/Batches/{TARGET_DATE}/batch_*.json  ← preferred (v3.0)
  2. News/Articles/**/{TARGET_DATE}/**/article.json  ← fallback (v2 compat)
  Filter: fetch.status = "pass" only

⛔ OUTPUT (4 files):
  Document/{DATE}_News/
    {DATE}_news.json   ← comprehensive JSON for GitHub Pages
    {DATE}_news.html   ← light cyberpunk HTML digest
    {DATE}_news.pdf    ← PDF (msedge/chrome headless)
    _index.json        ← stats only

  Document/manifest.json  ← master manifest (ADD new entry at index 0)

  github-pages/data/
    {DATE}_news.json   ← COPY of main JSON
    manifest.json      ← COPY/sync with Document/manifest.json

⛔ SUMMARY RULE (⚡ ENFORCE):
  Every post content field = 100-150 words EXACTLY
  Use content.summary_1 from article if available and within range
  If too long → trim | if too short → expand with context
  Count words before writing — NO exceptions

⛔ TOPIC CLASSIFICATION per post:
  topic_group:
    ai-trends    → category=Research OR tags/title match: LLM/model/training/arxiv/safety/benchmark
    tech-trends  → tags/title match: tool/product/API/release/iOS/coding/platform
    thailand     → category=Thai OR source is Thai media
    global       → tags/title match: policy/regulation/business/talent/geopolitics

⛔ STEPS:
  1. Read all input files (batch or individual)
  2. Classify each article → topic_group
  3. Build posts array with 100-150 word content
  4. Write {DATE}_news.json (comprehensive)
  5. Write {DATE}_news.html (cyberpunk theme)
  6. Generate {DATE}_news.pdf (headless browser)
  7. Write _index.json (stats)
  8. Update Document/manifest.json (add at index 0)
  9. Copy JSON + manifest → github-pages/data/

⛔ COMPLETION CHECK:
  □ {DATE}_news.json exists and parses
  □ All posts have content = 100-150 words
  □ All posts have topic_group
  □ manifest.json valid JSON, new entry at [0]
  □ github-pages/data/ has latest JSON + manifest
```

---

## 📋 {DATE}_news.json Schema

```json
{
  "date": "2026-06-22",
  "generated_at": "ISO-8601",
  "schema_version": "3.0",
  "stats": {
    "total": 35,
    "by_topic": { "ai_trends": 12, "tech_trends": 8, "thailand": 10, "global": 5 },
    "by_category": { "thai": 10, "international": 18, "research": 4, "youtube": 3 },
    "urgency": { "high": 5, "medium": 18, "low": 12 },
    "breakthrough_count": 2
  },
  "posts": [{
    "id": "hash",
    "slug": "url-slug",
    "title": "Article title",
    "topic": "AI Research",
    "topic_group": "ai-trends|tech-trends|thailand|global",
    "source_name": "TechCrunch",
    "category": "Thai|International|Research|YouTube",
    "urgency": "high|medium|low",
    "content": "EXACTLY 100-150 words. Single dense paragraph. What happened, who, numbers, why it matters.",
    "source_url": "https://permalink",
    "tech_impact": "1 sentence impact",
    "tags": ["tag1", "tag2"],
    "published_at": "ISO-8601",
    "breakthrough_potential": false,
    "related_domains": ["LLM"],
    "actions_developer": ["action 1", "action 2"],
    "actions_business": ["action 1", "action 2"],
    "youtube_channel": "",
    "youtube_video": ""
  }]
}
```

---

## 📋 Document/manifest.json

```json
["2026-06-22_news.json", "2026-06-21_news.json", "2026-06-20_news.json"]
```
Rule: add new entry at **index 0** — never delete old entries.

---

## 📋 _index.json

```json
{
  "date": "2026-06-22",
  "pipeline_version": "3.0",
  "total_articles": 35,
  "topic_breakdown": { "ai_trends": 12, "tech_trends": 8, "thailand": 10, "global": 5 },
  "files": ["{DATE}_news.json", "{DATE}_news.html", "{DATE}_news.pdf"]
}
```

---

## 📁 File Structure

```
d:\ai-news\
├── News/Batches/{DATE}/batch_1.json   ← input (v3)
├── News/Articles/**/{DATE}/**/        ← input fallback (v2)
├── Document/{DATE}_News/
│   ├── {DATE}_news.json               ← main output
│   ├── {DATE}_news.html
│   ├── {DATE}_news.pdf
│   └── _index.json
├── Document/manifest.json
└── github-pages/data/
    ├── {DATE}_news.json               ← copy → triggers deploy
    └── manifest.json
```

---

## 📊 Completion Report

```json
{
  "target_date": "{DATE}",
  "files_created": ["{DATE}_news.json", "{DATE}_news.html", "{DATE}_news.pdf", "_index.json"],
  "total_articles": 35,
  "topic_breakdown": { "ai_trends": 12, "tech_trends": 8, "thailand": 10, "global": 5 },
  "summary_word_check": "pass — all 100-150 words",
  "manifest_updated": true,
  "github_pages_ready": true,
  "next_step": "run ai-news-github-deploy"
}
```
