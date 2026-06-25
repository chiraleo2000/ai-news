---
name: ai-news-weekly-summary
description: >
  AI News Weekly Summary — รวมข่าว AI ทั้งสัปดาห์เป็นไฟล์เดียว
  อ่าน JSON จาก data/ (ล่าสุด 7 ไฟล์หรือ 7 วัน) → สรุปรวมเป็น
  1) Weekly Summary TXT (สำหรับใช้กับ ChatGPT Image สร้าง Poster)
  2) Weekly Summary PDF (printable version)
  
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

# SKILL: ai-news-weekly-summary v1.0

> **รวมข่าว AI ทั้งสัปดาห์** จาก daily JSON → ไฟล์เดียว (TXT + PDF)
> ออกแบบมาเพื่อใช้เป็น **input สำหรับ ChatGPT Image Generation** สร้าง poster
> อ่าน **ล่าสุด 7 ไฟล์** จาก `data/manifest.json` หรือ **7 วันย้อนหลัง**
> Output: สรุปครบ จัดหมวดหมู่ พร้อมใช้ copy-paste ไปสร้างภาพ

---

## 🎯 Skill Prompt

```
<skill>ai-news-weekly-summary v1.0</skill>

วันที่: {RUN_DATE} | week_ending: {TARGET_DATE}

⛔ INPUT:
  - อ่าน data/manifest.json → เอาล่าสุด 7 ไฟล์ (หรือน้อยกว่าถ้ามีไม่ถึง 7)
  - อ่าน data/{date}_news.json ทุกไฟล์ที่เลือก
  - รวม posts ทั้งหมดจากทุกวัน

⛔ OUTPUT (2 ไฟล์):
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt   ← ✦ MAIN: plain text สำหรับ ChatGPT
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf   ← PDF version (printable)

⛔ TXT FORMAT (ออกแบบสำหรับ ChatGPT Image Poster):
  - Section 1: HEADLINE — ข่าวที่สำคัญที่สุด 1-3 เรื่อง (urgency=high + breakthrough)
  - Section 2: AI TRENDS — สรุปแนวโน้ม AI ของสัปดาห์ (3-5 bullet points)
  - Section 3: TECH TRENDS — เครื่องมือ/ผลิตภัณฑ์ AI ใหม่ (3-5 bullet points)
  - Section 4: THAILAND — ข่าว AI ในไทย (ถ้ามี)
  - Section 5: GLOBAL — นโยบาย/ธุรกิจ AI ระดับโลก (3-5 bullet points)
  - Section 6: KEY NUMBERS — ตัวเลขสำคัญของสัปดาห์
  - Section 7: POSTER PROMPT — prompt สำเร็จรูปสำหรับสร้าง poster ใน ChatGPT Image

⛔ CONTENT RULES:
  - ภาษา: ผสม Thai + English (หัวข้อ English, เนื้อหาสรุป Thai-friendly)
  - แต่ละ bullet = 1-2 ประโยคกระชับ
  - เน้น WHAT + WHO + WHY MATTERS
  - ตัวเลขสำคัญ (funding, users, %, ราคา) ต้องใส่ทุกที่ที่มี
  - Total word count: 800-1500 คำ (พอดีสำหรับ poster content)
  - ห้ามยาวเกิน — ต้องอ่านจบได้ใน 3-5 นาที

⛔ POSTER PROMPT SECTION:
  - สร้าง ready-to-use prompt สำหรับ ChatGPT Image Generation
  - Style: Light cyberpunk / neon infographic / modern tech poster
  - ระบุ: headlines, key stats, color scheme, layout suggestion
  - ผู้ใช้ copy-paste prompt นี้ไปใช้ได้เลย

⛔ PDF GENERATION:
  - สร้าง HTML temp → convert ด้วย msedge/chrome headless
  - หรือ ใช้ text-based PDF generation
  - Font: system fonts (Segoe UI / Arial / Tahoma สำหรับ Thai)
```

---

## 📂 Output Structure

```
[Project_Path]/
├── Document/
│   └── Weekly/
│       ├── 2026-W26_weekly_summary.txt    ← Plain text (ChatGPT input)
│       ├── 2026-W26_weekly_summary.pdf    ← PDF version
│       ├── 2026-W25_weekly_summary.txt
│       └── ...
```

---

## 📋 TXT Template

```
══════════════════════════════════════════════════════════════
  ⚡ AI NEWS WEEKLY SUMMARY
  Week {YYYY}-W{WW} | {START_DATE} → {END_DATE}
  Total: {N} articles from {M} sources
══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 TOP HEADLINES (สำคัญที่สุดของสัปดาห์)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. {HEADLINE_1_TITLE}
   {1-2 sentence summary — what happened + why it matters}
   Source: {source_name} | {date}

2. {HEADLINE_2_TITLE}
   {1-2 sentence summary}
   Source: {source_name} | {date}

3. {HEADLINE_3_TITLE}
   {1-2 sentence summary}
   Source: {source_name} | {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 AI TRENDS (แนวโน้ม AI ของสัปดาห์)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {trend_1 — 1-2 sentences}
• {trend_2}
• {trend_3}
• {trend_4}
• {trend_5}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECH TRENDS (เครื่องมือ & ผลิตภัณฑ์ AI ใหม่)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {tech_1}
• {tech_2}
• {tech_3}
• {tech_4}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇹🇭 THAILAND AI & TECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {thai_1}
• {thai_2}
• {thai_3}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 GLOBAL AI & TECH (นโยบาย / ธุรกิจ / Regulation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• {global_1}
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 POSTER GENERATION PROMPT (copy-paste ไปใช้ใน ChatGPT Image)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a modern tech infographic poster with these specifications:

STYLE: Light cyberpunk aesthetic, dark navy (#1a1a2e) background with neon 
cyan (#00d4ff) and magenta (#ff00ff) accents. Clean minimalist layout.

TITLE: "AI WEEK IN REVIEW — {START_DATE} to {END_DATE}"
SUBTITLE: "{N} stories that shaped AI this week"

HEADLINE SECTION (top 1/3):
{headline_1_short}
{headline_2_short}
{headline_3_short}

KEY STATS (middle band):
{stat_1} | {stat_2} | {stat_3} | {stat_4}

CATEGORY ICONS (bottom 1/3):
🧠 AI Trends: {count} stories
⚙️ Tech: {count} stories
🇹🇭 Thailand: {count} stories
🌐 Global: {count} stories

FOOTER: "AI News Daily — Week {WW}, {YEAR}"

Layout: vertical poster (3:4 ratio), bold headlines, glowing accents,
tech-grid background texture, Share Tech Mono font for stats.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 ALL ARTICLES THIS WEEK (Full List)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{date_1}:
  [{urgency}] {title} — {source_name}
  [{urgency}] {title} — {source_name}
  ...

{date_2}:
  [{urgency}] {title} — {source_name}
  ...

══════════════════════════════════════════════════════════════
Generated by AI News Weekly Summary Pipeline v1.0
Run: {RUN_DATE} | Source: data/manifest.json (last 7 files)
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

Step 3: CLASSIFY & ANALYZE
  - แบ่ง posts ตาม topic_group (ai-trends/tech-trends/thailand/global)
  - หา top headlines (urgency=high + breakthrough_potential=true)
  - หา key numbers (funding amounts, %, user counts, etc.)
  - นับ stats: total articles, unique sources, topic breakdown

Step 4: GENERATE TXT
  - ใช้ template ด้านบน
  - เขียนลง Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt
  - ตรวจ word count อยู่ใน 800-1500 คำ

Step 5: GENERATE PDF
  - สร้าง temp HTML จาก TXT content
  - ใช้ msedge --headless --print-to-pdf
  - หรือ chrome headless
  - Output: Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf

Step 6: REPORT
  - แจ้งผล: จำนวน articles, dates covered, file paths
  - แนะนำ: copy TXT ไปใช้ใน ChatGPT Image
```

---

## 🔄 How to Use Output for Poster Generation

```
วิธีใช้:

1. รัน skill นี้ → ได้ไฟล์ .txt
2. เปิดไฟล์ .txt
3. Copy section "🎨 POSTER GENERATION PROMPT" ทั้งหมด
4. Paste ใน ChatGPT (พร้อม Image Generation)
5. ChatGPT จะสร้าง poster ให้ทันที

หรือ:
1. Copy ทั้ง TXT file
2. Paste ใน ChatGPT แล้วบอก "สร้าง poster จากข้อมูลนี้"
3. ChatGPT อ่านสรุปทั้งหมดแล้วสร้าง poster ที่เหมาะสม
```

---

## 📊 Completion Report

```json
{
  "run_date": "{RUN_DATE}",
  "week": "{YYYY}-W{WW}",
  "date_range": "{START_DATE} → {END_DATE}",
  "files_read": 7,
  "total_articles": 35,
  "topic_breakdown": {
    "ai_trends": 12,
    "tech_trends": 8,
    "thailand": 10,
    "global": 5
  },
  "top_headlines_count": 3,
  "key_numbers_extracted": 5,
  "output_files": [
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt",
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf"
  ],
  "word_count": 1200,
  "status": "SUCCESS ✅",
  "next_step": "Copy POSTER PROMPT section → paste in ChatGPT Image"
}
```

---

## ⛔ MANDATORY RULES

| Rule | Description |
|------|-------------|
| ⛔ ห้ามสร้างไฟล์เกิน 2 ไฟล์ | แค่ .txt + .pdf เท่านั้น |
| ⛔ Word count 800-1500 | ห้ามสั้นเกินไป ห้ามยาวเกินไป |
| ⛔ Poster prompt ต้องมีเสมอ | Section สุดท้ายก่อน full list |
| ⛔ ตัวเลขต้องครบ | funding, %, users, headcount — ห้ามข้าม |
| ⛔ Thai-friendly | หัวข้อ English, bullet points ผสม Thai ได้ |
| ⛔ ทำให้จบ ไม่ถาม | อ่าน manifest → สร้าง output → รายงาน |
