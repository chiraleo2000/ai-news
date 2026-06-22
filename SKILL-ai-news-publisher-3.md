---
name: ai-news-publisher
description: >
  อ่าน article.json + article.md จาก AI News scraper pipeline (SKILL-MASTER v1.0)
  รวมทุก article ของวันเป็น:
  1) Document/{yyyy-mm-dd_News}/ → {yyyy-mm-dd}_news.html + .pdf + content JSON
  2) JSON content list สำหรับ GitHub Pages (ai-news.github.io)
  เน้นรวมไฟล์ย่อยเป็น unified JSON list → พร้อม deploy
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

# SKILL: ai-news-publisher v1.0

> ทำงานร่วมกับ **SKILL-MASTER-ai-news v1.0** (unified scraper)
> อ่าน `article.json` + `article.md` จากทุก article folder ของวันนั้น
> **รวมเป็น daily package** ใน `Document/{yyyy-mm-dd_News}/`
> สร้าง **JSON content list** สำหรับ GitHub Pages deploy

---

## 🎯 Skill Prompt

```
<skill>ai-news-publisher v1.0</skill>

วันที่: {TARGET_DATE} | run_type: {RUN_TYPE}

⛔ หลักการสำคัญ (v1.0):
- รวมทุก article.json + article.md ของวันเป็นชุดเดียว
- Output หลักอยู่ใน Document/{yyyy-mm-dd_News}/ (เช่น Document/2026-06-22_News/)
- สร้าง HTML digest + PDF + JSON content list ในโฟลเดอร์เดียวกัน
- JSON content list ออกแบบให้เหมาะสำหรับ GitHub Pages (ai-news.github.io)
- ใช้โครงสร้าง manifest.json + daily JSON ตาม github.io pattern
- แยกหมวดชัดเจน: Thai | International | Research | YouTube

⛔ Input:
  [Project_Path]/News/Articles/**/{TARGET_DATE}/**/article.json
  [Project_Path]/News/Articles/**/{TARGET_DATE}/**/article.md
  กรอง: fetch.status = "pass"

⛔ Output ใน Document/{yyyy-mm-dd_News}/:
  {yyyy-mm-dd}_news.html         ← HTML รวมทุก article (styled, Sarabun + modern dark theme)
  {yyyy-mm-dd}_news.pdf          ← PDF แปลงจาก HTML
  {yyyy-mm-dd}_news.json         ← JSON content list สำหรับ GitHub Pages
  _index.json                    ← manifest + สถิติรวม
  _by_source.json                ← grouped by source/category
  _tech_summary.json             ← Tech Insights รวม

⛔ ขั้นตอน:
  Step 1: ค้นหา article — glob Articles/**/{TARGET_DATE}/**/article.json
  Step 2: อ่านทุก article.json + article.md ที่ pass
  Step 3: รวมเนื้อหาเป็น unified JSON content list ({yyyy-mm-dd}_news.json)
  Step 4: สร้าง {yyyy-mm-dd}_news.html (รวมทุก article — dark tech theme)
  Step 5: แปลง → {yyyy-mm-dd}_news.pdf
  Step 6: สร้าง _index.json, _by_source.json, _tech_summary.json
  Step 7: อัปเดต article.json แต่ละตัว → meta.status = "published"
  Step 8: (optional) copy {yyyy-mm-dd}_news.json → GitHub Pages data/ folder

⚡ ข้อกำหนด:
  - ✅ ประมวลผลทุก article ที่ pass ไม่ข้าม
  - ✅ Thai AI news อยู่ section แรก — international ตามมา
  - ✅ JSON format เหมาะสำหรับ fetch จาก JavaScript (GitHub Pages)
  - ✅ แยก section: Thai / International / Research / YouTube + TOC + Tech Summary
  - ✅ รายงานสรุป: total / thai / international / research / youtube / document path

⛔⛔⛔ MANDATORY OUTPUT CHECKLIST (ห้ามข้ามเด็ดขาด):
  ทุกครั้งที่รัน publisher ต้องสร้างไฟล์ครบทุกตัวตามนี้:

  □ 1. {yyyy-mm-dd}_news.json       — JSON content list (GitHub Pages)
  □ 2. {yyyy-mm-dd}_news.html       — HTML รวมทุก article (dark AI theme)
  □ 3. {yyyy-mm-dd}_news.pdf        — ⛔ บังคับ PDF (ห้ามข้าม ห้าม skip)
  □ 4. _index.json                  — manifest + สถิติรวม
  □ 5. _by_source.json              — grouped by source/category
  □ 6. _tech_summary.json           — Tech Insights summary
  □ 7. fonts/ folder                — THSarabun .ttf files
  □ 8. manifest.json (root Document/) — master manifest อัปเดต

  ถ้าไฟล์ใดไฟล์หนึ่งไม่ได้สร้าง → publisher ยังไม่เสร็จ ต้องทำต่อจนครบ

  ⛔ PDF GENERATION (บังคับ — ห้ามข้าม ห้ามบอกว่าทำไม่ได้):
  - ใช้ PowerShell: Start-Process "msedge" "--headless --print-to-pdf=..."
  - หรือ: chrome --headless --print-to-pdf=...
  - หรือ: npx puppeteer (ถ้ามี node)
  - หรือ: python -c "from playwright..." (ถ้ามี python)
  - หรือ: wkhtmltopdf (ถ้ามี)
  - ลองทุกวิธีจนกว่าจะได้ PDF
  - ⛔ ห้ามตอบว่า "PDF generation: SKIPPED" เด็ดขาด

  ⛔ COMPLETION VERIFICATION:
  หลังสร้างทุกไฟล์ ต้องรัน verification:
  - ตรวจว่ามีไฟล์ครบ 7 ตัว + fonts
  - ตรวจว่า JSON valid (parse ได้)
  - ตรวจว่า HTML มีเนื้อหา (>10KB)
  - ตรวจว่า PDF มีขนาด >0 bytes
  - ถ้าไม่ผ่าน → แก้ไขจนผ่าน
```

---

## 🔤 Font Configuration (สำหรับ PDF)

```
fonts/THSarabun.ttf
fonts/THSarabun Bold.ttf
fonts/THSarabun Italic.ttf
fonts/THSarabun Bold Italic.ttf
```

```css
@font-face {
  font-family: 'THSarabun';
  src: url('./fonts/THSarabun.ttf') format('truetype');
  font-weight: normal;
}
@font-face {
  font-family: 'THSarabun';
  src: url('./fonts/THSarabun Bold.ttf') format('truetype');
  font-weight: bold;
}
body {
  font-family: 'THSarabun', 'Sarabun', sans-serif;
  font-size: 14pt;
}
```

---

## 📂 Output Structure

```
[Project_Path]/
├── News/
│   └── Articles/                    ← scraper output (input)
│       └── {Category}/{Source}/{TARGET_DATE}/{Slug}/
│           ├── article.json
│           └── article.md
│
├── Document/                        ← ✦ PUBLISHER OUTPUT (หลัก)
│   ├── 2026-06-22_News/
│   │   ├── 2026-06-22_news.html     ← HTML รวมทั้งวัน (dark AI theme)
│   │   ├── 2026-06-22_news.pdf      ← PDF (embed THSarabun)
│   │   ├── 2026-06-22_news.json     ← ✦ JSON content list (GitHub Pages ready)
│   │   ├── _index.json              ← manifest + stats
│   │   ├── _by_source.json          ← grouped by source/category
│   │   ├── _tech_summary.json       ← Tech Insights summary
│   │   └── fonts/                   ← THSarabun .ttf files
│   ├── 2026-06-21_News/
│   └── manifest.json                ← ✦ master manifest
│
└── Logs/
    └── publisher-{TARGET_DATE}.log
```

---

## 📋 {yyyy-mm-dd}_news.json — GitHub Pages Content List

```json
{
  "date": "2026-06-22",
  "generated_at": "2026-06-22T19:00:00+07:00",
  "stats": {
    "total": 35,
    "thai": 10,
    "international": 18,
    "research": 4,
    "youtube": 3
  },
  "posts": [
    {
      "id": "article-unique-id",
      "slug": "url-friendly-slug",
      "title": "หัวข้อข่าว AI",
      "topic": "ชื่อหมวดหมู่ เช่น AI Tools, Large Language Models, AI Policy, Computer Vision, AI Safety, Robotics",
      "source_name": "TechCrunch | Blognone | Matt Wolfe",
      "category": "Thai|International|Research|YouTube",
      "urgency": "high|medium|low",
      "content": "เนื้อหาข่าวสรุปยาว ≥350 คำ จาก summary_1",
      "source_url": "https://permalink-to-original",
      "tech_impact": "ผลกระทบต่อวงการ AI",
      "tags": ["LLM", "GPT", "AI-tools"],
      "category_label": "Large Language Models",
      "published_at": "2026-06-22T08:00:00+07:00",
      "youtube_channel": "https://www.youtube.com/@channel",
      "youtube_video": "https://www.youtube.com/watch?v=xxx"
    }
  ]
}
```

### Field Mapping จาก article.json → posts item

| posts field | article.json path | หมายเหตุ |
|---|---|---|
| id | article_id | |
| slug | content.slug | |
| title | content.title | |
| topic | meta.category_label | ชื่อไทย/อังกฤษเต็ม เช่น "Large Language Models", "AI Tools" |
| source_name | source_info.source_name | |
| category | source_info.category | Thai/International/Research/YouTube |
| urgency | tech_insights.urgency | |
| content | content.summary_1 | เนื้อหายาว ≥350 คำ |
| source_url | source.url | |
| tech_impact | tech_insights.impact_summary | |
| tags | meta.tags | |
| category_label | meta.category_label | |
| published_at | meta.published_at | |
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

## 📄 {yyyy-mm-dd}_news.html — โครงสร้าง (AI Briefing Dark Theme)

```
┌─────────────────────────────────────────────────┐
│  HEADER (dark #0d1117 / accent #00d4ff)         │
│  🤖 AI News Briefing — {TARGET_DATE}            │
│  📰 N articles | 🇹🇭 X Thai | 🌍 Y International │
├─────────────────────────────────────────────────┤
│  📊 Stats + TOC (Thai / Intl / Research / YT)   │
├─────────────────────────────────────────────────┤
│  🔥 Top Stories (urgency: high)                 │
│  - card: category-badge + source + headline     │
│  - tech impact chip + breakthrough flag         │
├─────────────────────────────────────────────────┤
│  🇹🇭 Thai AI News (grouped by source)            │
│  - cards with Thai source color borders         │
├─────────────────────────────────────────────────┤
│  🌍 International AI News                       │
│  - grouped by: products / research / policy     │
├─────────────────────────────────────────────────┤
│  🎓 Research Papers (ArXiv / Papers with Code)  │
├─────────────────────────────────────────────────┤
│  📺 YouTube Highlights                          │
│  - thumbnail-style cards + channel name         │
├─────────────────────────────────────────────────┤
│  🧠 Tech Insights Summary (impact table)        │
│  - impact / urgency / domains / breakthrough    │
├─────────────────────────────────────────────────┤
│  Footer: AI-News Pipeline v1.0 | generated_at   │
└─────────────────────────────────────────────────┘
```

### CSS Category Colors (Dark AI Theme):
```css
:root {
  --bg-primary: #0d1117;
  --bg-card: #161b22;
  --accent-blue: #00d4ff;
  --accent-green: #00ff88;
  --accent-purple: #bf5af2;
  --accent-orange: #ff9f0a;
  --text-primary: #e6edf3;
}
.cat-LLM { border-left: 4px solid #00d4ff; }       /* Cyan — LLM */
.cat-TOOLS { border-left: 4px solid #00ff88; }      /* Green — AI Tools */
.cat-RESEARCH { border-left: 4px solid #bf5af2; }   /* Purple — Research */
.cat-POLICY { border-left: 4px solid #ff9f0a; }     /* Orange — Policy */
.cat-SAFETY { border-left: 4px solid #ff453a; }     /* Red — Safety */
.cat-ROBOTICS { border-left: 4px solid #ffd60a; }   /* Yellow — Robotics */
.cat-YOUTUBE { border-left: 4px solid #ff2d55; }    /* Pink-Red — YouTube */
```

---

## 📋 _tech_summary.json

```json
{
  "date": "2026-06-22",
  "total_insights": 15,
  "high_urgency": 3,
  "breakthrough_count": 2,
  "insights": [
    {
      "title": "...",
      "source_name": "...",
      "impact_summary": "...",
      "urgency": "high",
      "related_domains": ["LLM", "AI-Safety"],
      "breakthrough_potential": true,
      "article_id": "..."
    }
  ]
}
```

---

## 🔄 Integration with GitHub Pages

**Option A: Copy ไฟล์ตรง**
```
Document/{yyyy-mm-dd}_News/{yyyy-mm-dd}_news.json
  → copy to → github-pages-repo/data/{yyyy-mm-dd}_news.json

Document/manifest.json
  → copy to → github-pages-repo/data/manifest.json
```

**Option B: ใช้ SKILL-ai-news-github-deploy**
```
รัน skill github-deploy หลัง publisher เสร็จ
skill จะ copy JSON + update manifest + commit + push
```

---

## 📊 Completion Report

```json
{
  "run_date": "{RUN_DATE}",
  "target_date": "{TARGET_DATE}",
  "document_path": "Document/2026-06-22_News/",
  "files_created": [
    "{yyyy-mm-dd}_news.html",
    "{yyyy-mm-dd}_news.pdf",
    "2026-06-22_news.json",
    "_index.json",
    "_by_source.json",
    "_tech_summary.json"
  ],
  "manifest_updated": true,
  "stats": {
    "total_articles": 35,
    "thai": 10,
    "international": 18,
    "research": 4,
    "youtube": 3
  },
  "github_pages_ready": true,
  "next_step": "run ai-news-github-deploy (optional)"
}
```
