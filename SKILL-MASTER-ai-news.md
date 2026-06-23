---
name: ai-news-master-pipeline
description: >
  Master pipeline v2.0 (Source-First) + Registry (60+ แหล่งข่าว AI)
  Strategy: Source-First — ดึงจากเว็บแหล่งข่าว AI โดยตรงก่อน → aggregator เสริม
  Strict 24-hour filter — เก็บเฉพาะข่าวภายใน 24 ชม.
  แบ่ง 3 batches (1=Thai, 2=International, 3=Research/YouTube)
  
  v2.0 KEY CHANGE: BATCH-ORIENTED, FEWER FILES, MORE COVERAGE
  - Focus on COVERAGE: ดึงข่าวให้ครอบคลุมที่สุดจากทุกแหล่ง
  - BATCH writing: รวม articles จาก batch เดียวกันเป็น batch JSON ไฟล์เดียว
  - แทนที่จะสร้าง article.json ทีละตัว → สร้าง batch_{N}_{date}.json รวมหลาย articles
  - 4 Topic Classification: AI Trends, Tech Trends, Thailand, Global
  
  Output: News/Articles/{Category}/{Source}/{TARGET_DATE}/{Slug}/ (individual)
          OR News/Batches/{TARGET_DATE}/batch_{N}.json (batch mode — preferred)
agents: [main_agent, general_purpose]
trigger:
  - "กวาดข่าว AI"
  - "scrape ai news"
  - "ai-news master"
  - "run ai pipeline"
  - "กวาดข่าวเทคโนโลยี"
---
# SKILL-MASTER: ai-news-pipeline v2.0

> **Source-First + Token-Efficient + Batch-Oriented**
> ดึงจากเว็บแหล่งข่าว AI โดยตรงก่อน → fallback ไป aggregator
> Strict 24-hour filter — เก็บเฉพาะข่าวที่เผยแพร่ภายใน 24 ชม. ล่าสุดเท่านั้น
> **v2.0: BATCH WRITING** — รวมหลาย articles ใน file เดียว (ลดจำนวนไฟล์)
> **v2.0: COVERAGE FOCUS** — เน้นครอบคลุมข่าวจากหลายแหล่ง
> **4 Topic Categories**: AI Trends / Tech Trends / Thailand / Global
> Registry ครบ 70+ แหล่ง

---

## 🎯 Master Skill Prompt (v2.0)

```
<skill>ai-news-master-pipeline v2.0</skill>

กวาดข่าว/บทความ/วิดีโอ AI & Tech (Source-First + Batch-Oriented)
run: {RUN_DATE} | target: {TARGET_DATE}
mode: batch-sequential (1 → 2 → 3) หรือ parallel (Haiku 4.5 × 3)

⛔ v2.0 BATCH-ORIENTED APPROACH:
  - แทนที่สร้าง article.json ทีละตัว → รวมเป็น batch JSON
  - แต่ละ batch สร้างไฟล์ output 2 แบบ:
    A) PREFERRED: News/Batches/{TARGET_DATE}/batch_{N}.json (รวมทุก article ใน batch เดียว)
    B) FALLBACK: News/Articles/{Category}/{Source}/{TARGET_DATE}/{Slug}/article.json (แยกทีละตัว)
  - Batch JSON = array ของ articles → publisher อ่านง่าย ไฟล์น้อย
  - COVERAGE GOAL: ดึงข่าวให้ได้มากที่สุด ≥10 articles ต่อ batch (target)

⛔ 4 TOPIC CLASSIFICATION (ทุก article ต้องระบุ):
  topic_group: "ai-trends" | "tech-trends" | "thailand" | "global"
  Rules:
  - ai-trends: LLM, research papers, model training, safety, benchmarks, foundation models
  - tech-trends: AI tools, products, developer platforms, coding assistants, APIs
  - thailand: Thai sources (any), Thai companies, Thai government AI, DEPA, EEC
  - global: AI policy, business moves, regulation, talent, geopolitics, investments

⛔ STRICT 24-HOUR FILTER (บังคับทุก article):
  - เก็บเฉพาะเนื้อหาที่ published ภายใน 24 ชม. ก่อน RUN_DATE
  - ถ้า RUN_DATE = 2026-06-22 เวลา 07:00 → เก็บข่าว 21 มิ.ย. 07:00 ถึง 22 มิ.ย. 07:00
  - ถ้ามี published_date → ต้องอยู่ใน window 24 ชม. เท่านั้น
  - ถ้าไม่มี date → ต้องอยู่ position 1-3 ของหน้าข่าวล่าสุด (ถือว่าใหม่)
  - ❌ ข่าวเก่ากว่า 24 ชม. = SKIP ทันที ห้ามเก็บ

⛔ FETCH STRATEGY (Source-First — ประหยัด tokens):
  Priority Order:
  1. 🌐 Direct Source URL — web_fetch โดยตรงที่ main_url (หน้าข่าวหลัก)
     - ลอง truncated mode ก่อน (ประหยัด tokens)
     - ถ้าได้ title + date + body ≥300 chars → ใช้เลย
     - ถ้าไม่ได้ → ลอง rendered mode (1 retry)
  2. 📰 Tier 1 Aggregator — web_search → web_fetch
     - ใช้เมื่อ direct fetch ล้มเหลว หรือ เว็บใช้ JS rendering
  3. 📺 YouTube Channel — web_search หา title + description
     - ดึง metadata เท่านั้น ไม่ต้อง fetch video content
     - เก็บ channel_url + video_url + title + published_date

⛔ TOKEN EFFICIENCY RULES:
  - web_fetch ใช้ truncated mode เป็น default (8KB แรก)
  - อ่านแค่ title + date + summary → สร้าง article ทันที
  - ห้าม fetch full body ถ้า truncated ให้ข้อมูลพอแล้ว
  - ห้าม fetch ซ้ำ URL เดิม
  - ข้ามแหล่งที่ไม่มีข่าวใหม่ → รายงาน "no_news_today"
  - จำกัด web_search ≤3 queries ต่อ batch (increased for coverage)
  - จำกัด web_fetch ≤15 URLs ต่อ batch (increased for coverage)

⛔ COVERAGE RULES (v2.0 — เน้นครอบคลุม):
  - TARGET: ≥10 articles per batch (ถ้าแหล่งข่าวมีข่าวใหม่)
  - ถ้า direct fetch ล้มเหลว → ลอง aggregator ทันที (ไม่ข้าม)
  - ถ้า source A ไม่มีข่าว → ไปต่อ source B ทันที (ไม่เสียเวลา)
  - สำคัญ: BREADTH over DEPTH — ดึงข่าวจากหลายแหล่งดีกว่าเจาะลึกแหล่งเดียว
  - รวม articles ทั้ง batch เป็น single JSON file

⛔ OUTPUT RULES (v2.0 — Batch Mode):
  - PREFERRED OUTPUT: News/Batches/{TARGET_DATE}/batch_{N}.json
    - Contains array of all articles from that batch
    - Single file write = fewer operations = more efficient
  - ALSO CREATE individual: News/Articles/{Category}/{Source}/{TARGET_DATE}/{Slug}/
    - article.json + article.md (for backward compatibility)
  - fetch PASS เท่านั้น (HTTP 200 + body ≥300 chars + title)
  - source.url = permalink (ห้าม homepage/listing page)
  - summary_1 = paragraph เดียว 100-150 คำ (STRICT — count words before writing)
  - ⛔ SUMMARY WORD COUNT RULE:
    - MINIMUM: 100 words — summaries below 100 words are REJECTED
    - MAXIMUM: 150 words — summaries above 150 words must be trimmed
    - Content: cover WHAT happened, WHO is involved, KEY numbers/facts, WHY it matters
    - Format: single dense paragraph, NO bullet points, NO headers inside
    - Verify word count before writing each summary
  - ADD ONLY — ห้ามลบ article เก่า ห้ามเขียนทับ
  - ทุก article ต้องมี topic_group field

⛔ SAME-DAY RE-RUN RULES (รันวันเดียวกันซ้ำ):
  - กรณีรัน batch ซ้ำในวันเดียวกัน (TARGET_DATE เดิม):
    1. SCAN ก่อนสร้าง — ตรวจ existing articles ใน News/Articles/**/{TARGET_DATE}/
    2. DEDUP by source.url — ถ้า source.url ซ้ำกับ article ที่มีอยู่แล้ว → SKIP
    3. DEDUP by title similarity — ถ้า title เหมือน/คล้ายกัน ≥90% → SKIP
    4. ADD ONLY new articles — เฉพาะข่าวใหม่ที่ยังไม่มี
    5. ห้ามลบ/เขียนทับ article เดิมเด็ดขาด
    6. Report ต้องระบุ: articles_skipped_duplicate: N

⛔ Tech Insights (ทุก article ต้องมี):
  - impact_summary: 1 ประโยค (ห้าม "N/A" ถ้า urgency ≥ medium)
  - actions_developer: 2 ข้อเสมอ
  - actions_business: 2 ข้อเสมอ
  - urgency: high/medium/low
  - related_domains: array
  - breakthrough_potential: true/false

⛔ Output per batch (PREFERRED — Batch Mode):
  News/Batches/{TARGET_DATE}/batch_{N}.json  ← array of articles
  
  ALSO per article (backward compat):
  News/Articles/{Category}/{Source}/{TARGET_DATE}/{Slug}/
    article.json  ← schema v2.0
    article.md    ← readable summary + Tech Insights
```

---

## 🔍 Source Priority (Source-First)

### Priority 1: Direct Source URLs (main_url — ลองก่อนเสมอ)

```
web_fetch(url=main_url, mode="truncated")
├─ ✅ HTTP 200 + title + date within 24h + body ≥300 chars → USE
├─ ⚠️ HTTP 200 แต่ body <300 chars → retry mode="rendered"
└─ ❌ HTTP error / timeout / JS-only → fallback to Priority 2
```

### Priority 2: Tier 1 Aggregators (fallback)

| Source | Domain | Coverage | Fetch Mode |
|---|---|---|---|
| TechCrunch | techcrunch.com/ai | AI Startup / Products | rendered |
| The Verge | theverge.com/ai | Consumer AI | rendered |
| VentureBeat | venturebeat.com/ai | Enterprise AI | rendered |
| Ars Technica | arstechnica.com/ai | Deep Tech | rendered |
| MIT Tech Review | technologyreview.com | AI Research | rendered |
| Blognone | blognone.com | Thai IT/AI | truncated |
| Beartai | beartai.com | Thai Tech | truncated |

### Priority 3: YouTube Channels (metadata only — ไม่ fetch video)

- fetch: web_search "[channel_name] latest video site:youtube.com"
- เก็บ: channel_url + latest_video_url + title + published_date
- ไม่นับเป็น source.url หลัก แต่เก็บใน media_links field

---

## 📋 Strict 24-Hour Filter Logic

```
RUN_DATE = 2026-06-22T07:00:00+07:00

WINDOW_START = 2026-06-21T07:00:00+07:00
WINDOW_END   = 2026-06-22T07:00:00+07:00

สำหรับทุก article candidate:
  IF published_date EXISTS:
    IF published_date >= WINDOW_START AND published_date <= WINDOW_END:
      ✅ KEEP
    ELSE:
      ❌ SKIP — "older than 24h"
  ELSE (no date visible):
    IF position <= 3 on latest news page:
      ✅ KEEP (assume fresh)
    ELSE:
      ❌ SKIP — "cannot confirm freshness"
```

---

## 📦 Batch Division v2.0 (3 batches → 4 topic output)

```
┌─────────────────────────────────────────────────────────────┐
│  BATCH 1 (Thai Sources) — ข่าว AI ภาษาไทย                   │
│  → topic_group: "thailand" (primary)                        │
│  → Output: News/Batches/{DATE}/batch_1.json                 │
│  File: SKILL-ai-news-batch1-thai.md                         │
├─────────────────────────────────────────────────────────────┤
│  BATCH 2 (International Web) — สื่อต่างประเทศหลัก           │
│  → topic_group: "ai-trends" / "tech-trends" / "global"      │
│  → Output: News/Batches/{DATE}/batch_2.json                 │
│  File: SKILL-ai-news-batch2-international.md                │
├─────────────────────────────────────────────────────────────┤
│  BATCH 3 (Research + YouTube) — งานวิจัย + ช่อง YouTube     │
│  → topic_group: "ai-trends" (research) / varies (YT)        │
│  → Output: News/Batches/{DATE}/batch_3.json                 │
│  File: SKILL-ai-news-batch3-research-yt.md                  │
└─────────────────────────────────────────────────────────────┘
```

### Batch JSON Format (v2.0)

```json
// News/Batches/{TARGET_DATE}/batch_1.json
{
  "batch": 1,
  "target_date": "2026-06-22",
  "generated_at": "ISO-8601",
  "total_articles": 8,
  "articles": [
    { /* full article object (same schema as individual article.json) */ },
    { /* ... */ }
  ]
}
```

This batch format means:
- 3 JSON files per day (one per batch) instead of 30+ individual files
- Publisher reads 3 files instead of globbing dozens of directories
- Same article schema — just wrapped in an array

---

## 🔄 Execution Modes

### Mode A: Sequential (Sonnet — single context)
```
1. โหลด SKILL-MASTER-ai-news.md
2. รัน Batch 1 → Batch 2 → Batch 3
3. สร้าง Final Completion Report
```

### Mode B: Parallel (Haiku 4.5 × 3 — recommended)
```
1. รัน SKILL-ai-news-batch1-thai.md → Haiku instance 1
2. รัน SKILL-ai-news-batch2-international.md → Haiku instance 2
3. รัน SKILL-ai-news-batch3-research-yt.md → Haiku instance 3
4. รวมผลจาก 3 instances → Final Completion Report
```

---

## 📄 article.json Schema v2.0

```json
{
  "article_id": "unique-hash",
  "schema_version": "2.0",
  "topic_group": "ai-trends|tech-trends|thailand|global",
  "source_info": {
    "category": "Thai|International|Research|YouTube",
    "source_name": "ชื่อสำนักข่าว/ช่อง",
    "registry_key": "category/source_name",
    "domain": "AI-product|AI-research|AI-policy|AI-tools|AI-business|AI-safety",
    "main_url": "https://homepage-or-news-section"
  },
  "source": {
    "url": "https://permalink-to-article",
    "type": "direct|aggregator|youtube",
    "origin": "direct|indirect",
    "source_match_confidence": "high|medium|low",
    "fetch_priority_used": "1_direct|2_aggregator|3_youtube"
  },
  "fetch": {
    "status": "pass|fail",
    "http_status": 200,
    "fetched_at": "ISO-8601",
    "fetch_mode": "truncated|rendered|search",
    "retries": 0,
    "fail_reason": null
  },
  "meta": {
    "published_at": "ISO-8601",
    "scraped_at": "ISO-8601",
    "run_date": "yyyy-mm-dd",
    "target_date": "yyyy-mm-dd",
    "within_24h": true,
    "status": "scraped|published",
    "batch": "1|2|3",
    "category": "AI-PRODUCT|AI-RESEARCH|AI-POLICY|AI-TOOLS|AI-BUSINESS|AI-SAFETY",
    "category_label": "หมวดหมู่ภาษาไทย",
    "news_type": "ข่าว|บทความ|วิดีโอ|วิจัย|ประกาศ",
    "tags": [],
    "language": "th|en"
  },
  "content": {
    "title": "หัวข้อข่าว",
    "slug": "url-friendly-slug",
    "summary": "สรุป 1-2 ประโยค",
    "summary_1": "สรุป paragraph เดียว (100-150 คำ STRICT — count words)",
    "body_text": "เนื้อหาย่อ (ห้ามเกิน 500 คำ)",
    "language": "th|en",
    "original_language": "th|en"
  },
  "tech_insights": {
    "impact_summary": "ผลกระทบหลักต่อวงการ AI/Tech (ห้าม N/A ถ้า urgency ≥ medium)",
    "actions_developer": ["action 1", "action 2"],
    "actions_business": ["action 1", "action 2"],
    "urgency": "high|medium|low",
    "related_domains": ["LLM", "Computer Vision", "Robotics", "etc"],
    "breakthrough_potential": false
  },
  "media_links": {
    "youtube_channel": "https://youtube.com/@channel",
    "youtube_video": "https://youtube.com/watch?v=xxx"
  },
  "paths": {
    "relative": "Category/Source/date/slug",
    "article_md": "article.md",
    "article_json": "article.json",
    "batch_file": "News/Batches/{date}/batch_{N}.json"
  }
}
```

---

## 📄 article.md Template

```markdown
# {content.title}

**แหล่งข่าว:** {source_info.source_name} ({source_info.category})
**วันที่:** {meta.target_date}
**ลิ้งค์:** [{source.type}]({source.url})
**หมวดหมู่:** {meta.category_label} | Batch: {meta.batch}

---

## สรุปข่าว

{content.summary_1 — 100-150 คำ paragraph เดียว STRICT}

---

## Tech Insights

**ผลกระทบ:** {tech_insights.impact_summary}
**ระดับความสำคัญ:** {tech_insights.urgency}

### นักพัฒนา/Engineer ควรทำอะไร
- {tech_insights.actions_developer[0]}
- {tech_insights.actions_developer[1]}

### ธุรกิจ/องค์กร ควรทำอะไร
- {tech_insights.actions_business[0]}
- {tech_insights.actions_business[1]}

**สาขาที่เกี่ยวข้อง:** {tech_insights.related_domains}

---

## แหล่งที่มา
- **Source:** [{source.type}]({source.url})
- **สำนักข่าว:** {source_info.main_url}
- **Fetch priority:** {source.fetch_priority_used}

---
*AI-News Pipeline v1.0 | run: {meta.run_date} | target: {meta.target_date} | batch: {meta.batch}*
```

---

## 📊 Batch Completion Report Template (v2.0)

```json
{
  "batch": "1",
  "status": "completed",
  "output_file": "News/Batches/{TARGET_DATE}/batch_1.json",
  "sources_attempted": 24,
  "articles_created": 8,
  "articles_skipped_duplicate": 0,
  "topic_breakdown": {
    "ai_trends": 2,
    "tech_trends": 1,
    "thailand": 5,
    "global": 0
  },
  "sources_with_news": [],
  "sources_no_news": [],
  "direct_fetch_success": 5,
  "aggregator_fallback_used": 3,
  "skipped_older_than_24h": 2,
  "coverage_score": "good|fair|poor",
  "token_usage_estimate": "low|medium|high",
  "next_batch": "2"
}
```

---

## 📊 Final Completion Report (v2.0)

```json
{
  "run_date": "{RUN_DATE}",
  "target_date": "{TARGET_DATE}",
  "pipeline": "ai-news-master-v2.0",
  "strategy": "source-first + batch-oriented",
  "output_mode": "batch",
  "batch_files": [
    "News/Batches/{TARGET_DATE}/batch_1.json",
    "News/Batches/{TARGET_DATE}/batch_2.json",
    "News/Batches/{TARGET_DATE}/batch_3.json"
  ],
  "batches": {
    "1": { "attempted": 24, "articles_created": 8, "coverage_score": "good" },
    "2": { "attempted": 31, "articles_created": 12, "coverage_score": "good" },
    "3": { "attempted": 16, "articles_created": 6, "coverage_score": "fair" }
  },
  "articles_total": 26,
  "topic_breakdown": {
    "ai_trends": 10,
    "tech_trends": 6,
    "thailand": 5,
    "global": 5
  },
  "articles_skipped_duplicate_total": 0,
  "skipped_older_than_24h": 4,
  "fetch_stats": {
    "direct_attempted": 40,
    "direct_success": 20,
    "aggregator_attempted": 10,
    "aggregator_success": 6,
    "youtube_metadata_fetched": 4,
    "total_web_fetch": 30,
    "success_rate": "66%"
  },
  "files_created_total": 3,
  "next_step": "run ai-news-publisher → ai-news-github-deploy"
}
```

---

# ═══════════════════════════════════════════════════════════════
# 📚 FULL URL REGISTRY v3.0 (92 แหล่งข่าว AI)
# ═══════════════════════════════════════════════════════════════

> main_url = หน้าหลักของแหล่งข่าว (อัปเดตทุกวัน — ไม่ใช่ URL บทความเฉพาะ)
> youtube_channel = URL ช่องหลัก (ไม่ใช่ URL วิดีโอเฉพาะ)

---

## 📦 BATCH 1 — Thai AI & Tech Sources (28 แหล่ง)

### B1-A: เว็บไซต์ข่าวเทคโนโลยีไทย

| # | registry_key | source | main_url | search_keywords |
|---|---|---|---|---|
| 1 | Thai/Blognone | Blognone | https://www.blognone.com | "AI technology Thailand blognone" |
| 2 | Thai/Beartai | Beartai | https://www.beartai.com/news | "AI tech beartai ไทย" |
| 3 | Thai/Techsauce | Techsauce | https://techsauce.co | "AI startup Thailand techsauce" |
| 4 | Thai/Thumbsup | Thumbsup | https://www.thumbsup.in.th | "AI Thailand thumbsup" |
| 5 | Thai/TechTalkThai | TechTalkThai | https://www.techtalkthai.com | "enterprise AI TechTalkThai" |
| 6 | Thai/BangkokBizAI | Bangkok Biz AI | https://www.bangkokbiznews.com/category/tech/ai | "AI Bangkok business news" |
| 7 | Thai/PrachachatAI | Prachachat AI | https://www.prachachat.net/tag/ปัญญาประดิษฐ์ | "AI ปัญญาประดิษฐ์ ประชาชาติ" |
| 8 | Thai/ThairathAI | Thairath AI | https://www.thairath.co.th/tags/AI | "AI ไทยรัฐ เทคโนโลยี" |
| 9 | Thai/Thaiware | Thaiware News | https://news.thaiware.com | "AI IT ข่าว thaiware" |
| 10 | Thai/EnTechReview | EnTechReview | https://entechreview.com | "AI review tech Thai" |
| 11 | Thai/ThaiPBS | Thai PBS Tech | https://www.thaipbs.or.th/news/technology | "AI technology Thai PBS" |
| 12 | Thai/SpringNews | Spring News Tech | https://www.springnews.co.th/digital-tech | "AI tech spring news ไทย" |
| 13 | Thai/INNNews | INN News Tech | https://www.innnews.co.th/category/news/tech | "AI tech INN News ไทย" |
| 14 | Thai/ThaiPR | ThaiPR IT | https://www.thaipr.net/it | "AI IT press release ThaiPR" |
| 15 | Thai/TheStandard | The Standard Tech | https://thestandard.co/technology | "AI tech The Standard ไทย" |
| 16 | Thai/Positioning | Positioning Mag | https://positioningmag.com/topics/technology | "AI tech Positioning Thailand" |
| 17 | Thai/ManagerTech | Manager Online Cyber | https://mgronline.com/cyberbiz | "AI tech manager online ไทย" |
| 18 | Thai/NationTech | Nation TV Tech | https://www.nationtv.tv/category/technology | "AI technology nation ไทย" |

### B1-B: YouTube ช่องไทย

| # | registry_key | channel | channel_url | search_keywords |
|---|---|---|---|---|
| 15 | YT-Thai/BorntoDev | BorntoDev | https://www.youtube.com/@borntodev | "BorntoDev AI latest" |
| 16 | YT-Thai/Sertis | Sertis Corp | https://www.youtube.com/@SertisOfficial | "Sertis AI tech latest" |
| 17 | YT-Thai/Techsauce | Techsauce TV | https://www.youtube.com/@techsaucetv | "Techsauce AI latest" |
| 18 | YT-Thai/TechTalkThai | TechTalkThai TV | https://www.youtube.com/@TechTalkThaiTV | "TechTalkThai latest AI" |
| 19 | YT-Thai/Beartai | Beartai | https://www.youtube.com/@beartai | "Beartai AI tech latest" |
| 20 | YT-Thai/Blognone | Blognone | https://www.youtube.com/@blognone | "Blognone AI latest" |
| 21 | YT-Thai/SpringNews | Spring News Online | https://www.youtube.com/@springnewsonline | "Spring News tech AI latest" |
| 22 | YT-Thai/NBT2HD | NBT2HD | https://www.youtube.com/@NBT2HDchannel | "NBT2HD เศรษฐกิจ เทคโนโลยี AI" |
| 23 | YT-Thai/AIWeekly | AI Weekly TH | https://www.youtube.com/@aiweeklyth | "AI news weekly Thai" |
| 24 | YT-Thai/DataScience | DataScience TH | https://www.youtube.com/@datascienceth | "data science AI Thailand latest" |

---

## 📦 BATCH 2 — International Web Sources (40 แหล่ง)

### B2-A: AI News & Media หลัก

| # | registry_key | source | main_url | search_keywords |
|---|---|---|---|---|
| 1 | Intl/TechCrunch | TechCrunch AI | https://techcrunch.com/category/artificial-intelligence | "AI startup TechCrunch latest" |
| 2 | Intl/TheVerge | The Verge AI | https://www.theverge.com/ai-artificial-intelligence | "AI news The Verge latest" |
| 3 | Intl/VentureBeat | VentureBeat AI | https://venturebeat.com/category/ai | "AI enterprise VentureBeat" |
| 4 | Intl/Wired | Wired AI | https://www.wired.com/tag/artificial-intelligence | "AI policy Wired latest" |
| 5 | Intl/ArsTechnica | Ars Technica AI | https://arstechnica.com/ai | "AI research Ars Technica latest" |
| 6 | Intl/MIT | MIT Tech Review AI | https://www.technologyreview.com/topic/artificial-intelligence | "MIT AI research latest" |
| 7 | Intl/MarkTechPost | MarkTechPost | https://www.marktechpost.com | "AI ML paper marktech latest" |
| 8 | Intl/Reuters | Reuters AI | https://www.reuters.com/technology/artificial-intelligence | "AI Reuters news latest" |
| 9 | Intl/Bloomberg | Bloomberg Tech | https://www.bloomberg.com/technology | "AI Bloomberg tech latest" |
| 10 | Intl/CNBC | CNBC Tech | https://www.cnbc.com/technology | "AI CNBC tech latest" |
| 11 | Intl/Forbes | Forbes AI | https://www.forbes.com/ai | "AI Forbes latest" |
| 12 | Intl/Fortune | Fortune Tech | https://fortune.com/section/tech | "AI Fortune tech latest" |
| 13 | Intl/TheAtlantic | The Atlantic Tech | https://www.theatlantic.com/technology | "AI Atlantic latest" |
| 14 | Intl/Axios | Axios AI | https://www.axios.com/technology/ai | "AI Axios latest" |
| 15 | Intl/TheInformation | The Information AI | https://www.theinformation.com | "AI The Information latest" |
| 16 | Intl/Pandaily | Pandaily | https://pandaily.com | "China AI Pandaily latest" |
| 17 | Intl/KrASIA | KrASIA | https://kr.asia | "Southeast Asia AI KrASIA" |
| 18 | Intl/ChinaEconReview | China Economic Review | https://chinaeconomicreview.com | "China AI business economic review" |
| 19 | Intl/SCMP | South China Morning Post Tech | https://www.scmp.com/technology | "China AI policy SCMP latest" |
| 20 | Intl/NikkeiAsia | Nikkei Asia Tech | https://asia.nikkei.com/Business/Technology | "Asia AI Nikkei latest" |
| 21 | Intl/TechInAsia | Tech in Asia | https://www.techinasia.com | "Southeast Asia AI startup latest" |
| 22 | Intl/RestOfWorld | Rest of World Tech | https://restofworld.org/section/technology | "global south AI tech latest" |
| 23 | Intl/Semafor | Semafor Tech | https://www.semafor.com/vertical/tech | "AI policy Semafor latest" |

### B2-B: AI-Specific Newsletters & Digest

| # | registry_key | source | main_url | search_keywords |
|---|---|---|---|---|
| 20 | Digest/TheBatch | The Batch (DeepLearning.AI) | https://www.deeplearning.ai/the-batch | "AI weekly batch DeepLearning" |
| 21 | Digest/ImportAI | Import AI | https://importai.substack.com | "AI research import weekly Jack Clark" |
| 22 | Digest/BuildFast | BuildFastWithAI | https://www.buildfastwithai.com/blogs | "AI tools daily build fast" |
| 23 | Digest/HackerNews | Hacker News AI | https://news.ycombinator.com/?q=AI | "AI HackerNews latest discussion" |
| 24 | Digest/OpenAI | OpenAI Blog | https://openai.com/news | "OpenAI announcement latest" |
| 25 | Digest/Anthropic | Anthropic News | https://www.anthropic.com/news | "Anthropic Claude announcement latest" |
| 26 | Digest/Google | Google DeepMind | https://deepmind.google/discover/blog | "Google DeepMind AI research latest" |
| 27 | Digest/Meta | Meta AI Blog | https://ai.meta.com/blog | "Meta AI LLaMA announcement latest" |
| 28 | Digest/HuggingFace | HuggingFace Blog | https://huggingface.co/blog | "HuggingFace model release latest" |
| 29 | Digest/AINewsThompson | AI News (Alan D Thompson) | https://lifearchitect.ai/news | "AI global tracker Alan Thompson" |
| 30 | Digest/RecsysFrontier | Recsys Frontier | https://www.recsys-frontier.com | "AI weekly deep analysis recsys" |
| 31 | Digest/DigitalApplied | DigitalApplied | https://www.digitalapplied.com/blog | "AI strategy policy digital applied" |
| 32 | Digest/Mistral | Mistral AI Blog | https://mistral.ai/news | "Mistral AI model release latest" |
| 33 | Digest/xAI | xAI Blog | https://x.ai/blog | "xAI Grok announcement latest" |
| 34 | Digest/Cohere | Cohere Blog | https://cohere.com/blog | "Cohere enterprise AI latest" |
| 35 | Digest/Perplexity | Perplexity Blog | https://www.perplexity.ai/hub/blog | "Perplexity AI search latest" |
| 36 | Digest/AISnakeOil | AI Snake Oil | https://www.aisnakeoil.com | "AI hype criticism latest" |
| 37 | Digest/BenedictEvans | Benedict Evans | https://www.ben-evans.com | "AI industry analysis Benedict Evans" |
| 38 | Digest/SimonWillison | Simon Willison Blog | https://simonwillison.net | "LLM tools Simon Willison latest" |
| 39 | Digest/LilianWeng | Lil'Log (Lilian Weng) | https://lilianweng.github.io | "AI research Lilian Weng latest" |
| 40 | Digest/TheSequence | The Sequence AI | https://thesequence.substack.com | "AI research weekly sequence" |

---

## 📦 BATCH 3 — Research + YouTube International (24 แหล่ง)

### B3-A: AI Research Sources

| # | registry_key | source | main_url | search_keywords |
|---|---|---|---|---|
| 1 | Research/ArXiv | ArXiv AI (cs.AI) | https://arxiv.org/list/cs.AI/recent | "AI paper arxiv latest cs.AI" |
| 2 | Research/ArXivLG | ArXiv ML (cs.LG) | https://arxiv.org/list/cs.LG/recent | "ML paper arxiv latest cs.LG" |
| 3 | Research/ArXivCL | ArXiv NLP (cs.CL) | https://arxiv.org/list/cs.CL/recent | "NLP paper arxiv latest cs.CL" |
| 4 | Research/ArXivCV | ArXiv Vision (cs.CV) | https://arxiv.org/list/cs.CV/recent | "computer vision paper arxiv cs.CV" |
| 5 | Research/PapersWithCode | Papers with Code | https://paperswithcode.com | "AI SOTA paper benchmark latest" |
| 6 | Research/Semantic | Semantic Scholar AI | https://www.semanticscholar.org/topic/Artificial-Intelligence | "AI research semantic scholar" |
| 7 | Research/AIIndex | AI Index (Stanford) | https://aiindex.stanford.edu | "Stanford AI Index report" |
| 8 | Research/ConnectedPapers | Connected Papers | https://www.connectedpapers.com | "AI paper graph connected latest" |

### B3-B: YouTube ช่อง International

| # | registry_key | channel | channel_url | search_keywords |
|---|---|---|---|---|
| 9 | YT-Intl/TwoMinutePapers | Two Minute Papers | https://www.youtube.com/@TwoMinutePapers | "Two Minute Papers latest AI" |
| 10 | YT-Intl/Karpathy | Andrej Karpathy | https://www.youtube.com/@AndrejKarpathy | "Karpathy AI deep learning latest" |
| 11 | YT-Intl/Kilcher | Yannic Kilcher | https://www.youtube.com/@YannicKilcher | "Yannic AI paper review latest" |
| 12 | YT-Intl/AIExplained | AI Explained | https://www.youtube.com/@aiexplained-official | "AI Explained latest news" |
| 13 | YT-Intl/MattWolfe | Matt Wolfe | https://www.youtube.com/@mreflow | "Matt Wolfe AI tools latest" |
| 14 | YT-Intl/WesRoth | Wes Roth | https://www.youtube.com/@WesRoth | "Wes Roth AI latest" |
| 15 | YT-Intl/MLStreetTalk | ML Street Talk | https://www.youtube.com/@MachineLearningStreetTalk | "ML Street Talk AI latest podcast" |
| 16 | YT-Intl/DavidShapiro | David Shapiro | https://www.youtube.com/@DavidShapiroAutomator | "David Shapiro AI futures latest" |
| 17 | YT-Intl/AIBreakdown | The AI Breakdown | https://www.youtube.com/@theaibreakdown | "AI Breakdown policy news latest" |
| 18 | YT-Intl/ShipyardAI | The Shipyard AI | https://www.youtube.com/@theshipyardai | "Shipyard AI dev-focused news latest" |
| 19 | YT-Intl/Sertis | Sertis Tech Focus | https://www.youtube.com/@SertisOfficial | "Sertis AI enterprise latest" |
| 20 | YT-Intl/SamWitteveen | Sam Witteveen | https://www.youtube.com/@samwitteveenai | "Sam Witteveen AI coding latest" |
| 21 | YT-Intl/ThursdAI | ThursdAI | https://www.youtube.com/@ThursdAI | "ThursdAI weekly recap AI latest" |
| 22 | YT-Intl/LexFridman | Lex Fridman | https://www.youtube.com/@lexfridman | "Lex Fridman AI interview latest" |
| 23 | YT-Intl/Fireship | Fireship | https://www.youtube.com/@Fireship | "Fireship AI dev news latest" |
| 24 | YT-Intl/NetworkChuck | NetworkChuck | https://www.youtube.com/@NetworkChuck | "NetworkChuck AI hacking latest" |
