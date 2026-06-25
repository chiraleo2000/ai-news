---
name: ai-news-weekly-summary
description: >
  AI News Weekly Summary v2.0 — รวมข่าว AI ทั้งสัปดาห์เป็นไฟล์เดียว
  อ่าน JSON จาก data/ (ล่าสุด 7 ไฟล์หรือ 7 วัน) → สร้าง 2 ส่วนใน output:
  
  PART A: FULL ORIGINAL CONTENT — เนื้อหาต้นฉบับทั้งหมดจาก JSON (ไม่จำกัดความยาว)
           ประกอบด้วย title, content, source_url, tags, tech_impact, actions ครบทุก article
           เพื่อให้ ChatGPT มี context ครบถ้วนสำหรับสร้าง poster
  
  PART B: CURATED SUMMARY — สรุปเชิงวิเคราะห์ 1500-2000 คำ
           Headlines, Trends, Key Numbers, Poster Prompt
  
  Output: Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt + .pdf
  ใช้สำหรับ generate AI poster ผ่าน ChatGPT Image Generation
agents: [main_agent, general_purpose]
trigger:
  - "สรุปข่าว AI รายสัปดาห์"
  - "weekly ai summary"
  - "ai news weekly"
  - "สร้าง poster ข่าว AI"
  - "generate ai news poster"
  - "รวมข่าว AI สัปดาห์"
requires:
  - ai-news-publisher
---

# SKILL: ai-news-weekly-summary v2.0

> **2-Part Output:** Full Original Content + Curated Summary
> ส่วนที่ 1 ให้ข้อมูลดิบครบถ้วน (no word limit) สำหรับ ChatGPT
> ส่วนที่ 2 เป็นสรุปวิเคราะห์ 1500-2000 คำ พร้อม poster prompt
> อ่าน **ล่าสุด 7 ไฟล์** จาก `data/manifest.json`

---

## 🎯 Skill Prompt

```
<skill>ai-news-weekly-summary v2.0</skill>

วันที่: {RUN_DATE} | week_ending: {TARGET_DATE}

⛔ INPUT:
  - อ่าน data/manifest.json → เอาล่าสุด 7 ไฟล์ (หรือน้อยกว่าถ้ามีไม่ถึง 7)
  - อ่าน data/{date}_news.json ทุกไฟล์ที่เลือก
  - รวม posts ทั้งหมดจากทุกวัน

⛔ OUTPUT (2 ไฟล์):
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt   ← ✦ MAIN: 2-part text สำหรับ ChatGPT
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf   ← PDF version (printable)

⛔ TWO-PART STRUCTURE:

  ┌──────────────────────────────────────────────────────────┐
  │  PART A: FULL ORIGINAL CONTENT (ไม่จำกัดความยาว)          │
  │  - ดึง content ต้นฉบับจาก JSON ทุก article               │
  │  - ทุก article มี: title, date, source_url, content,     │
  │    tech_impact, tags, urgency, actions_developer,         │
  │    actions_business, related_domains                      │
  │  - จัดกลุ่มตาม topic_group                               │
  │  - ใส่ source_url ทุก article (เพื่อ reference)          │
  │  - NO WORD LIMIT — ใส่ทุกอย่างที่มี                      │
  │  - เป้าหมาย: ให้ ChatGPT มี full context                 │
  └──────────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────┐
  │  PART B: CURATED SUMMARY (1500-2000 คำ)                   │
  │  - Headlines 3-5 ข่าวเด่น                                │
  │  - AI Trends สรุป                                        │
  │  - Tech Trends สรุป                                      │
  │  - Thailand สรุป                                         │
  │  - Global สรุป                                           │
  │  - Key Numbers (ตัวเลขสำคัญ)                             │
  │  - Poster Prompt (ready-to-use)                          │
  └──────────────────────────────────────────────────────────┘

⛔ PART A RULES (Full Original Content):
  - ดึงจาก JSON fields โดยตรง — ห้ามย่อ ห้ามตัด
  - ทุก article ต้องมี: title + date + source_url + content (full paragraph)
  - เพิ่ม: tech_impact, tags, urgency, actions ถ้ามี
  - จัดกลุ่มตาม topic_group (ai-trends → tech-trends → thailand → global)
  - ภายในกลุ่ม sort ตาม date (newest first)
  - ไม่จำกัดความยาว — content field ต้นฉบับ 100-150 คำต่อ article
  - ถ้า 50 articles × 130 คำ = ~6500 คำ → ยอมรับ

⛔ PART B RULES (Curated Summary):
  - ภาษา: ผสม Thai + English (หัวข้อ English, เนื้อหาสรุป Thai-friendly)
  - Word count: 1500-2000 คำ (STRICT — นับก่อนเขียน)
  - แต่ละ bullet = 1-2 ประโยคกระชับ (WHAT + WHO + WHY MATTERS)
  - ตัวเลขสำคัญ (funding, users, %, ราคา) ต้องใส่ครบ
  - Poster prompt ต้องมีเสมอ — ready-to-use for ChatGPT Image

⛔ PDF GENERATION:
  - สร้าง HTML temp → convert ด้วย msedge/chrome headless
  - Font: system fonts (Segoe UI / Arial / Tahoma สำหรับ Thai)
```

---

## 📂 Output Structure

```
[Project_Path]/
├── Document/
│   └── Weekly/
│       ├── 2026-W26_weekly_summary.txt    ← 2-part text (Full + Summary)
│       ├── 2026-W26_weekly_summary.pdf    ← PDF version
│       └── ...
```

---

## 📋 TXT Template (2-Part Structure)

```
══════════════════════════════════════════════════════════════
  ⚡ AI NEWS WEEKLY — FULL CONTENT + SUMMARY
  Week {YYYY}-W{WW} | {START_DATE} → {END_DATE}
  Total: {N} articles from {M} sources
══════════════════════════════════════════════════════════════


╔══════════════════════════════════════════════════════════════╗
║  PART A: FULL ORIGINAL CONTENT                              ║
║  (เนื้อหาต้นฉบับครบทุก article — ใช้เป็น context สำหรับ AI)   ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 AI TRENDS ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---
📰 {title}
📅 {date} | 🏷️ {source_name} | ⚡ {urgency}
🔗 {source_url}

{content — full paragraph from JSON, 100-150 words}

💡 Impact: {tech_impact}
🏷️ Tags: {tag1}, {tag2}, {tag3}
👨‍💻 Dev Actions: {actions_developer[0]} | {actions_developer[1]}
🏢 Biz Actions: {actions_business[0]} | {actions_business[1]}
🔬 Domains: {related_domains}
---

[repeat for each article in ai-trends]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECH TRENDS ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[same format per article]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇹🇭 THAILAND AI & TECH ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[same format per article]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 GLOBAL AI & TECH ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[same format per article]


╔══════════════════════════════════════════════════════════════╗
║  PART B: CURATED WEEKLY SUMMARY (1500-2000 words)           ║
║  (สรุปเชิงวิเคราะห์ — พร้อม Poster Prompt)                   ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 TOP HEADLINES (สำคัญที่สุดของสัปดาห์)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. {HEADLINE_1_TITLE}
   {2-3 sentence summary — what happened, key numbers, why it matters}
   Source: {source_name} | {date} | {source_url}

2. {HEADLINE_2_TITLE}
   {2-3 sentence summary}
   Source: {source_name} | {date} | {source_url}

3. {HEADLINE_3_TITLE}
   {2-3 sentence summary}
   Source: {source_name} | {date} | {source_url}

4. {HEADLINE_4_TITLE} (optional)
   {2-3 sentence summary}
   Source: {source_name} | {date} | {source_url}

5. {HEADLINE_5_TITLE} (optional)
   {2-3 sentence summary}
   Source: {source_name} | {date} | {source_url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 AI TRENDS SUMMARY (แนวโน้ม AI ของสัปดาห์)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {trend_1 — 2-3 sentences with context and numbers}
• {trend_2}
• {trend_3}
• {trend_4}
• {trend_5}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECH TRENDS SUMMARY (เครื่องมือ & ผลิตภัณฑ์ AI ใหม่)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {tech_1 — 2-3 sentences}
• {tech_2}
• {tech_3}
• {tech_4}
• {tech_5}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇹🇭 THAILAND AI & TECH SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {thai_1 — 2-3 sentences}
• {thai_2}
• {thai_3}
• {thai_4}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 GLOBAL AI & TECH SUMMARY (นโยบาย / ธุรกิจ / Regulation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {global_1 — 2-3 sentences}
• {global_2}
• {global_3}
• {global_4}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 KEY NUMBERS (ตัวเลขสำคัญของสัปดาห์)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}
• ${AMOUNT} — {what it represents}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 POSTER GENERATION PROMPT (copy-paste ไปใช้ใน ChatGPT Image)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a modern tech infographic poster with these specifications:

STYLE: Light cyberpunk aesthetic, dark navy (#1a1a2e) background with neon 
cyan (#00d4ff) and magenta (#ff00ff) accents. Clean minimalist layout.

TITLE: "AI WEEK IN REVIEW — {START_DATE} to {END_DATE}"
SUBTITLE: "{N} stories that shaped AI this week"

HEADLINE SECTION (top 1/3):
🔥 {headline_1_short}
🔥 {headline_2_short}
🔥 {headline_3_short}

KEY STATS (middle band, monospace, neon numbers):
{stat_1} | {stat_2} | {stat_3} | {stat_4}

CATEGORY BREAKDOWN (bottom section, 4 colored blocks):
🧠 AI Trends: {count} stories (cyan #00d4ff)
⚙️ Tech Trends: {count} stories (purple #a855f7)
🇹🇭 Thailand: {count} stories (orange #ff6b35)
🌐 Global: {count} stories (green #00cc6a)

VISUAL ELEMENTS:
- Circuit board / neural network pattern in background
- Neon glow effects on headlines and numbers
- Category color-coded borders/blocks
- Small tech icons (chip, brain, globe, flag)

FOOTER: "AI News Daily — Week {WW}, {YEAR} | chiraleo2000.github.io/ai-news"

Layout: vertical poster (3:4 ratio or 1080x1440px), bold Orbitron headlines, 
Rajdhani body text, glowing accents, dark background with light text.

══════════════════════════════════════════════════════════════
Generated by AI News Weekly Summary Pipeline v2.0
Run: {RUN_DATE} | Source: data/manifest.json (last 7 files)
Part A: Full original content ({X} words — no limit)
Part B: Curated summary ({Y} words — target 1500-2000)
══════════════════════════════════════════════════════════════
```

---

## ⚡ Execution Steps

```
Step 1: READ MANIFEST
  - อ่าน d:\AI-news\data\manifest.json
  - เลือก 7 ไฟล์แรก (ล่าสุด → เก่าสุด)
  - ถ้ามีน้อยกว่า 7 ก็ใช้ทั้งหมดที่มี

Step 2: LOAD ALL JSON
  - อ่าน data/{date}_news.json ทุกไฟล์ที่เลือก
  - รวม posts ทั้งหมดเป็น array เดียว
  - Sort by published_at (newest first)

Step 3: GENERATE PART A (Full Original Content)
  - จัดกลุ่มตาม topic_group
  - ทุก article เขียนแบบ full: title, date, source_url, content, 
    tech_impact, tags, actions_developer, actions_business, related_domains
  - ไม่ย่อ ไม่ตัด — ใส่ทุกอย่างจาก JSON
  - ผลลัพธ์: ~5000-10000 คำ (ขึ้นกับจำนวน articles)

Step 4: GENERATE PART B (Curated Summary)
  - วิเคราะห์ all posts → หา top headlines (urgency=high + breakthrough)
  - สรุปแนวโน้มแต่ละหมวด (2-3 sentences per bullet)
  - หา key numbers (funding, %, users, headcount)
  - สร้าง poster prompt (ready-to-use)
  - Word count: 1500-2000 คำ (STRICT — count before writing)

Step 5: COMBINE → TXT
  - รวม Part A + Part B เป็นไฟล์เดียว
  - เขียนลง Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt

Step 6: GENERATE PDF
  - สร้าง temp HTML → convert ด้วย msedge --headless --print-to-pdf
  - Output: Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf

Step 7: REPORT
  - แจ้งผล: จำนวน articles, Part A word count, Part B word count
  - แนะนำ: copy ทั้งไฟล์หรือเฉพาะ Part B ไปใช้ใน ChatGPT
```

---

## 🔄 How to Use Output for Poster Generation

```
วิธีที่ 1 (Full Context — แนะนำ):
  1. Copy ทั้งไฟล์ .txt (Part A + B)
  2. Paste ใน ChatGPT
  3. บอก: "สร้าง poster จากข้อมูลนี้ ใช้ poster prompt ที่อยู่ใน Part B"
  4. ChatGPT มี full context จาก Part A → สร้าง poster ที่ครอบคลุม

วิธีที่ 2 (Quick — เฉพาะ summary):
  1. Copy เฉพาะ Part B
  2. Paste ใน ChatGPT
  3. สร้าง poster จาก curated summary

วิธีที่ 3 (Poster Prompt Only):
  1. Copy เฉพาะ section "🎨 POSTER GENERATION PROMPT"
  2. Paste ตรงใน ChatGPT Image
  3. ได้ poster ทันที
```

---

## 📊 Completion Report

```json
{
  "run_date": "{RUN_DATE}",
  "week": "{YYYY}-W{WW}",
  "date_range": "{START_DATE} → {END_DATE}",
  "files_read": 7,
  "total_articles": 75,
  "topic_breakdown": {
    "ai_trends": 17,
    "tech_trends": 12,
    "thailand": 6,
    "global": 6
  },
  "part_a": {
    "type": "full_original_content",
    "word_count": 7500,
    "articles_included": 75,
    "fields_per_article": ["title", "date", "source_url", "content", "tech_impact", "tags", "actions", "domains"]
  },
  "part_b": {
    "type": "curated_summary",
    "word_count": 1800,
    "headlines": 5,
    "key_numbers": 10,
    "poster_prompt": true
  },
  "output_files": [
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt",
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf"
  ],
  "status": "SUCCESS ✅",
  "next_step": "Copy full TXT → paste in ChatGPT → generate poster"
}
```

---

## ⛔ MANDATORY RULES

| Rule | Description |
|------|-------------|
| ⛔ Part A = FULL CONTENT | ห้ามย่อ ห้ามตัด ดึง content จาก JSON ตรงๆ |
| ⛔ Part A ต้องมี source_url ทุก article | เพื่อ reference และ attribution |
| ⛔ Part B = 1500-2000 คำ STRICT | นับคำก่อนเขียน ห้ามสั้นกว่า 1500 |
| ⛔ Poster prompt ต้องมีเสมอ | อยู่ท้ายสุดของ Part B |
| ⛔ Key Numbers ≥ 8 ตัว | funding, %, users, headcount — ห้ามน้อยกว่า 8 |
| ⛔ Thai-friendly | หัวข้อ English, content ผสม Thai ได้ |
| ⛔ ทำให้จบ ไม่ถาม | อ่าน manifest → สร้าง output → รายงาน |
| ⛔ Output 2 ไฟล์เท่านั้น | .txt + .pdf (HTML เป็น temp ลบได้) |
