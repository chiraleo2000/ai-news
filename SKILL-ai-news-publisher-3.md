---
name: ai-news-publisher
description: >
  AI News Publisher v2.0 — Batch-Oriented, Fewer Files, More Coverage
  อ่าน article.json + article.md จาก AI News scraper pipeline (SKILL-MASTER v1.0)
  รวมทุก article ของวันเป็น:
  1) Document/{yyyy-mm-dd_News}/ → unified output package
  2) JSON content list สำหรับ GitHub Pages (4-topic structure)
  
  KEY CHANGE v2.0: Focus on COVERAGE over file count
  - สร้างน้อยไฟล์ลง แต่เนื้อหาครอบคลุมมากขึ้น
  - Batch processing: รวมทุก article เป็น single comprehensive JSON
  - 4 Topic Categories: AI Trends, Tech Trends, Thailand, Global
  - ไม่ต้องสร้าง _by_source.json / _tech_summary.json แยก → รวมใน main JSON
agents: [main_agent, general_purpose]
trigger:
  - "publish ข่าว AI"
  - "สร้าง AI daily digest"
  - "combine ข่าว AI รายวัน"
  - "เผยแพร่ข่าว AI"
  - "สร้าง ai document"
  - "generate ai content json"
requires:
  - ai-news-master-pipeline
---

# SKILL: ai-news-publisher v2.0

> ทำงานร่วมกับ **SKILL-MASTER-ai-news v1.0** (unified scraper)
> อ่าน `article.json` + `article.md` จากทุก article folder ของวันนั้น
> **รวมเป็น daily package** ใน `Document/{yyyy-mm-dd_News}/`
> สร้าง **JSON content list** สำหรับ GitHub Pages deploy
>
> **v2.0 KEY PRINCIPLES:**
> - **FEWER FILES, MORE COVERAGE** — รวมข้อมูลทั้งหมดใน fewer output files
> - **BATCH-ORIENTED** — ประมวลผลทุก article ทีเดียวจบ
> - **4-TOPIC STRUCTURE** — จัดหมวดตาม: AI Trends / Tech Trends / Thailand / Global

---

## 🎯 Skill Prompt

```
<skill>ai-news-publisher v2.0</skill>

วันที่: {TARGET_DATE} | run_type: {RUN_TYPE}

⛔ KEY PRINCIPLES v2.0:
- FEWER FILES, MORE COVERAGE: ไม่ต้องสร้างหลายไฟล์แยก → รวมทุกอย่างใน main JSON
- BATCH-ORIENTED: อ่านทุก article.json ทีเดียว → produce single comprehensive output
- 4-TOPIC CLASSIFICATION: จัดทุก article ลง 4 หมวด:
  1. AI Trends — LLM, research, training, safety, benchmarks, models
  2. Tech Trends — tools, products, platforms, developer ecosystem
  3. Thailand AI & Tech — Thai sources, Thai companies, DEPA, Thai ecosystem
  4. Global AI & Tech — policy, business, regulation, talent, geopolitics

⛔ Input:
  [Project_Path]/News/Articles/**/{TARGET_DATE}/**/article.json
  [Project_Path]/News/Articles/**/{TARGET_DATE}/**/article.md
  กรอง: fetch.status = "pass"

⛔ Output Files (MINIMAL — 4 files only):
  Document/{yyyy-mm-dd_News}/
    {yyyy-mm-dd}_news.json         ← ✦ MAIN: comprehensive JSON (includes stats, topics, insights)
    {yyyy-mm-dd}_news.html         ← HTML digest (light cyberpunk theme)
    {yyyy-mm-dd}_news.pdf          ← PDF version
    _index.json                    ← minimal manifest + stats only

  Document/manifest.json           ← master manifest (array of filenames)

  github-pages/data/
    {yyyy-mm-dd}_news.json         ← COPY of main JSON (ready for web)
    manifest.json                  ← COPY/update of master manifest

⛔ ขั้นตอน (Batch Processing):
  Step 1: GLOB — find all Articles/**/{TARGET_DATE}/**/article.json
  Step 2: BATCH READ — read ALL article.json files at once
  Step 3: CLASSIFY — assign each post to 1 of 4 topics
  Step 4: PRODUCE JSON — single {yyyy-mm-dd}_news.json with full data + embedded insights
  Step 5: PRODUCE HTML — light cyberpunk themed daily digest
  Step 6: PRODUCE PDF — from HTML (msedge/chrome headless)
  Step 7: UPDATE manifests — Document/manifest.json + github-pages/data/manifest.json
  Step 8: COPY JSON → github-pages/data/

⛔ COVERAGE RULES:
  - ✅ EVERY article that passes = INCLUDED (no skipping)
  - ✅ Each post content field = EXACTLY 100-150 words (STRICT word count)
  - ⛔ SUMMARY WORD COUNT RULE (MANDATORY):
    - MINIMUM: 100 words — content below 100 words is REJECTED
    - MAXIMUM: 150 words — content above 150 words must be trimmed
    - Content covers: WHAT happened, WHO, KEY numbers/facts, WHY it matters
    - Format: single dense paragraph, NO bullet points, NO headers
    - Count words before writing — enforce strictly per article
  - ✅ Each post includes tech_insights embedded (not separate file)
  - ✅ Each post includes actions_developer + actions_business
  - ✅ Topic classification embedded per-post (topic_group field)
  - ✅ Stats section includes topic breakdown
  - ❌ NO separate _by_source.json (merged into main JSON)
  - ❌ NO separate _tech_summary.json (merged into main JSON)
  - ❌ FEWER files = LESS overhead = MORE content per file

⛔ PDF GENERATION (บังคับ):
  - ใช้ PowerShell: Start-Process "msedge" "--headless --print-to-pdf=..."
  - หรือ: chrome --headless --print-to-pdf=...
  - ลองทุกวิธีจนกว่าจะได้ PDF
```

---

## 🔤 Font Configuration (v2.0 — Google Fonts)

No local font files needed. The HTML uses Google Fonts CDN:
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

For PDF generation, use system fonts (Segoe UI / Arial / Tahoma for Thai support).

---

## 📂 Output Structure (v2.0 — Fewer Files, More Coverage)

```
[Project_Path]/
├── News/
│   └── Articles/                    ← scraper output (input)
│       └── {Category}/{Source}/{TARGET_DATE}/{Slug}/
│           ├── article.json
│           └── article.md
│
├── Document/                        ← ✦ PUBLISHER OUTPUT (v2.0)
│   ├── 2026-06-22_News/
│   │   ├── 2026-06-22_news.json     ← ✦ COMPREHENSIVE JSON (stats + insights + all posts)
│   │   ├── 2026-06-22_news.html     ← HTML digest (light cyberpunk theme)
│   │   ├── 2026-06-22_news.pdf      ← PDF version
│   │   └── _index.json              ← minimal manifest + stats
│   ├── 2026-06-21_News/
│   └── manifest.json                ← ✦ master manifest (array of filenames)
│
├── github-pages/                    ← ✦ DEPLOYED SITE
│   ├── index.html                   ← Light Cyberpunk UI (4 topic tabs)
│   ├── assets/style.css             ← Cyberpunk CSS
│   ├── js/app.js                    ← Topic classification + rendering
│   ├── data/
│   │   ├── manifest.json
│   │   └── {yyyy-mm-dd}_news.json   ← daily JSON (copied from Document/)
│   └── .github/workflows/static.yml
│
└── Logs/
    └── publisher-{TARGET_DATE}.log
```

### ⛔ WHAT WE REMOVED (v2.0 streamlining):
- ❌ `_by_source.json` — merged into main JSON stats
- ❌ `_tech_summary.json` — merged into main JSON top_insights
- ❌ `fonts/` folder — using Google Fonts (Orbitron/Rajdhani) instead
- ❌ `article.html` — modal in index.html replaces separate page

### ✅ WHAT WE ADDED (v2.0 coverage):
- ✅ `topic_group` field per post — enables 4-tab UI
- ✅ `top_insights` array in JSON — high-urgency items surfaced
- ✅ `actions_developer` + `actions_business` per post — full insights inline
- ✅ `breakthrough_potential` + `related_domains` per post

---

## 📋 {yyyy-mm-dd}_news.json — GitHub Pages Content (v2.0 Comprehensive)

```json
{
  "date": "2026-06-22",
  "generated_at": "2026-06-22T19:00:00+07:00",
  "schema_version": "2.0",
  "stats": {
    "total": 35,
    "by_topic": {
      "ai_trends": 12,
      "tech_trends": 8,
      "thailand": 10,
      "global": 5
    },
    "by_source_category": {
      "thai": 10,
      "international": 18,
      "research": 4,
      "youtube": 3
    },
    "urgency_breakdown": {
      "high": 5,
      "medium": 18,
      "low": 12
    },
    "breakthrough_count": 2
  },
  "top_insights": [
    {
      "title": "...",
      "impact_summary": "...",
      "urgency": "high",
      "related_domains": ["LLM", "AI-Safety"],
      "article_id": "..."
    }
  ],
  "posts": [
    {
      "id": "article-unique-id",
      "slug": "url-friendly-slug",
      "title": "หัวข้อข่าว AI",
      "topic": "AI Research",
      "topic_group": "ai-trends",
      "source_name": "TechCrunch",
      "category": "International",
      "urgency": "high",
      "content": "100-150 words STRICT. Single dense paragraph. Covers what/who/numbers/why-matters.",
      "source_url": "https://permalink-to-original",
      "tech_impact": "ผลกระทบต่อวงการ AI",
      "tags": ["LLM", "GPT", "AI-tools"],
      "category_label": "Large Language Models",
      "published_at": "2026-06-22T08:00:00+07:00",
      "breakthrough_potential": false,
      "related_domains": ["LLM", "NLP"],
      "actions_developer": ["action 1", "action 2"],
      "actions_business": ["action 1", "action 2"],
      "youtube_channel": "",
      "youtube_video": ""
    }
  ]
}
```

### topic_group Classification Rules (สำหรับ publisher)

| topic_group | Criteria |
|---|---|
| `ai-trends` | category=Research, OR topic contains "Research"/"Safety", OR tags match LLM/training/model keywords |
| `tech-trends` | topic contains "Tools"/"Products", OR tags match coding/platform/API keywords |
| `thailand` | category=Thai, OR source is Thai media, OR tags match Thai keywords |
| `global` | topic contains "Policy"/"Business", OR tags match regulation/talent/geopolitics keywords |

### Field Mapping จาก article.json → posts item (v2.0)

| posts field | article.json path | หมายเหตุ |
|---|---|---|
| id | article_id | |
| slug | content.slug | |
| title | content.title | |
| topic | meta.category_label | |
| topic_group | (classified) | ai-trends / tech-trends / thailand / global |
| source_name | source_info.source_name | |
| category | source_info.category | Thai/International/Research/YouTube |
| urgency | tech_insights.urgency | |
| content | content.summary_1 | 100-150 words STRICT (single paragraph) |
| source_url | source.url | |
| tech_impact | tech_insights.impact_summary | |
| tags | meta.tags | |
| category_label | meta.category_label | |
| published_at | meta.published_at | |
| breakthrough_potential | tech_insights.breakthrough_potential | |
| related_domains | tech_insights.related_domains | |
| actions_developer | tech_insights.actions_developer | |
| actions_business | tech_insights.actions_business | |
| youtube_channel | media_links.youtube_channel | |
| youtube_video | media_links.youtube_video | |

---

## 📋 Document/manifest.json — Master Manifest

```json
[
  "2026-06-22_news.json",
  "2026-06-21_news.json",
  "2026-06-20_news.json"
]
```

กฎการอัปเดต manifest:
- เพิ่มไฟล์ใหม่ที่ **บนสุด** (ล่าสุดก่อน)
- ไม่ลบรายการเก่า (ADD ONLY)
- format: `{yyyy-mm-dd}_news.json`

---

## 📄 {yyyy-mm-dd}_news.html — Light Cyberpunk Theme (v2.0)

```
┌─────────────────────────────────────────────────┐
│  HEADER (dark #1a1a2e / neon cyan accent)        │
│  ⚡ AI NEWS DAILY — {TARGET_DATE}                │
│  📰 N articles | 4 topic categories              │
├─────────────────────────────────────────────────┤
│  📊 Stats (AI Trends / Tech / Thailand / Global) │
├─────────────────────────────────────────────────┤
│  🧠 AI TRENDS section                            │
│  - Research papers, LLM news, model releases     │
│  - Cards with cyan left-border                   │
├─────────────────────────────────────────────────┤
│  ⚙️ TECH TRENDS section                          │
│  - Tools, products, developer platforms          │
│  - Cards with purple left-border                 │
├─────────────────────────────────────────────────┤
│  🇹🇭 THAILAND AI & TECH section                   │
│  - Thai sources, Thai ecosystem news             │
│  - Cards with orange left-border                 │
├─────────────────────────────────────────────────┤
│  🌐 GLOBAL AI & TECH section                     │
│  - Policy, business, regulation, talent moves    │
│  - Cards with green left-border                  │
├─────────────────────────────────────────────────┤
│  Footer: AI News Pipeline v2.0 | generated_at    │
└─────────────────────────────────────────────────┘
```

### CSS — Light Cyberpunk Theme:
```css
:root {
  --bg-primary: #f0f2f8;
  --bg-card: #ffffff;
  --bg-header: #1a1a2e;
  --neon-cyan: #00d4ff;
  --neon-magenta: #ff00ff;
  --neon-green: #00ff88;
  --neon-purple: #a855f7;
  --neon-orange: #ff6b35;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
}
/* Topic border colors */
.topic-ai-trends { border-left: 4px solid #00d4ff; }
.topic-tech-trends { border-left: 4px solid #a855f7; }
.topic-thailand { border-left: 4px solid #ff6b35; }
.topic-global { border-left: 4px solid #00ff88; }
```

Font: Google Fonts — Orbitron (display) + Rajdhani (body) + Share Tech Mono (code/labels)

---

## 📋 _index.json (Minimal — v2.0)

```json
{
  "date": "2026-06-22",
  "generated_at": "ISO-8601",
  "pipeline_version": "2.0",
  "total_articles": 35,
  "topic_breakdown": {
    "ai_trends": 12,
    "tech_trends": 8,
    "thailand": 10,
    "global": 5
  },
  "files": [
    "{yyyy-mm-dd}_news.json",
    "{yyyy-mm-dd}_news.html",
    "{yyyy-mm-dd}_news.pdf"
  ]
}
```

---

## 🔄 Integration with GitHub Pages (v2.0 — Direct Copy)

```
Document/{yyyy-mm-dd}_News/{yyyy-mm-dd}_news.json
  → COPY to → github-pages/data/{yyyy-mm-dd}_news.json

Document/manifest.json
  → COPY to → github-pages/data/manifest.json
```

The GitHub Pages site (index.html) automatically:
1. Fetches manifest.json to list available dates
2. Loads the latest daily JSON
3. Classifies posts into 4 topic tabs client-side
4. Renders cards with topic-colored borders
5. Shows stats breakdown per topic

**No separate deploy step needed** — just copy JSON + update manifest + git push.

---

## 📊 Completion Report (v2.0)

```json
{
  "run_date": "{RUN_DATE}",
  "target_date": "{TARGET_DATE}",
  "pipeline_version": "2.0",
  "document_path": "Document/2026-06-22_News/",
  "files_created": [
    "{yyyy-mm-dd}_news.json",
    "{yyyy-mm-dd}_news.html",
    "{yyyy-mm-dd}_news.pdf",
    "_index.json"
  ],
  "files_removed_from_v1": [
    "_by_source.json (merged into main JSON)",
    "_tech_summary.json (merged into main JSON)",
    "fonts/ (using Google Fonts)"
  ],
  "manifest_updated": true,
  "github_pages_json_copied": true,
  "stats": {
    "total_articles": 35,
    "topic_breakdown": {
      "ai_trends": 12,
      "tech_trends": 8,
      "thailand": 10,
      "global": 5
    }
  },
  "coverage": "100% — all pass articles included with full insights",
  "next_step": "run ai-news-github-deploy"
}
```
