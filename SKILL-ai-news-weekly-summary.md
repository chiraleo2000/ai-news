---
name: ai-news-weekly-summary
description: >
  AI News Weekly Summary v3.0 — รวมข่าว AI ทั้งสัปดาห์เป็นไฟล์เดียว
  อ่าน JSON จาก data/ (ล่าสุด 7 ไฟล์) → สร้าง 2 ส่วนใน output:
  
  PART A: FULL ORIGINAL CONTENT — dump ข้อมูลดิบครบทุก field จาก JSON ทุก article
           ห้ามย่อ ห้ามตัด ห้ามเปลี่ยน — copy content/tech_impact/actions ตรงๆ
           จัดกลุ่มตาม topic_group → sort by date (newest first)
  
  PART B: DEEP ANALYTICAL SUMMARY — สรุปเชิงวิเคราะห์เจาะลึก 2500-3500 คำ
           ไม่ใช่แค่ bullet สั้นๆ — ต้องมี context, ตัวเลข, ความเชื่อมโยง, นัยยะ
           Headlines 5-7 ข่าวเด่น, Trends Analysis, Cross-cutting themes,
           Key Numbers 12+, Developer Actions, Business Actions, Poster Prompt
  
  Output: Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt + .html + .pdf
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

# SKILL: ai-news-weekly-summary v3.0

> **v3.0 KEY CHANGES from v2.0:**
> - Part A: เข้มงวดมากขึ้น — ต้อง dump ทุก field จาก JSON ตรงๆ ห้ามย่อ
> - Part B: เพิ่มจาก 1500-2000 → **2500-3500 คำ** พร้อมวิเคราะห์เชิงลึก
> - Part B ต้องมี cross-cutting themes, developer/business action plans
> - Key Numbers เพิ่มจาก 8 → **12+ ตัว**
> - Headlines เพิ่มจาก 3-5 → **5-7 ข่าว** พร้อม context 4-5 ประโยค
> - เพิ่ม HTML output สำหรับอ่านง่าย (นอกจาก TXT + PDF)

---

## ⛔⛔⛔ ABSOLUTE MANDATORY RULES ⛔⛔⛔

| Rule | Description |
|------|-------------|
| ⛔ Part A = VERBATIM DUMP | ดึง content, tech_impact, actions, tags, domains จาก JSON ตรงๆ **ห้ามย่อ ห้ามตัด ห้ามเรียบเรียงใหม่** |
| ⛔ Part A ต้องครบทุก article | ถ้า 7 วันมี 80 articles → Part A ต้องมีครบ 80 articles ห้ามข้าม |
| ⛔ Part A ต้องมี source_url ทุก article | เพื่อ reference และ attribution |
| ⛔ Part A fields per article | title, date, source_name, urgency, source_url, content (FULL), tech_impact (FULL), tags (ALL), actions_developer (ALL), actions_business (ALL), related_domains (ALL), breakthrough_potential |
| ⛔ Part B = 2500-3500 คำ STRICT | นับคำก่อนเขียน — ห้ามสั้นกว่า 2500 |
| ⛔ Part B = DEEP ANALYSIS | ไม่ใช่แค่ list bullets สั้นๆ — ต้องมี context เชื่อมโยง เหตุผล ตัวเลข |
| ⛔ Part B Headlines 5-7 ข่าว | แต่ละข่าว 4-5 ประโยคอธิบาย (ไม่ใช่แค่ 1-2 ประโยค) |
| ⛔ Part B Key Numbers ≥ 12 ตัว | funding, %, users, context windows, token costs — ครบๆ |
| ⛔ Part B Cross-cutting themes | ต้องมี section วิเคราะห์ themes ที่เชื่อมข้ามหมวด |
| ⛔ Part B Action Plans | ต้องมี developer action plan + business action plan แยกชัด |
| ⛔ Poster prompt ต้องมีเสมอ | อยู่ท้ายสุดของ Part B — ready-to-use |
| ⛔ ทำให้จบ ไม่ถาม | อ่าน manifest → อ่าน JSON ทุกไฟล์ → สร้าง output → รายงาน |
| ⛔ Output 3 ไฟล์ | .txt + .html + .pdf |
| ⛔ ภาษา | Part A: คง language ต้นฉบับจาก JSON / Part B: Thai-dominant ผสม English terms |

---

## 🎯 Skill Prompt

```
<skill>ai-news-weekly-summary v3.0</skill>

วันที่: {RUN_DATE} | week_ending: {TARGET_DATE}

⛔ INPUT:
  - อ่าน data/manifest.json → เอาล่าสุด 7 ไฟล์ (หรือน้อยกว่าถ้ามีไม่ถึง 7)
  - อ่าน data/{date}_news.json **ทุกไฟล์** ที่เลือก — ห้ามข้าม ห้ามอ่านแค่บางไฟล์
  - รวม posts ทั้งหมดจากทุกวันเป็น array เดียว
  - ⛔ ถ้ามี 7 ไฟล์ แต่ละไฟล์มี ~15-20 articles = รวม ~100-140 articles
  - ⛔ ต้องประมวลผลทุก article ไม่มีข้อยกเว้น

⛔ OUTPUT (3 ไฟล์):
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt   ← MAIN: 2-part text
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.html  ← Formatted HTML (อ่านง่าย)
  Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf   ← PDF version (printable)

⛔ READING ALL JSON FILES — MANDATORY PROCEDURE:
  1. อ่าน manifest.json → ได้ list ของ filenames
  2. สำหรับทุกไฟล์ใน manifest (สูงสุด 7):
     - อ่าน data/{filename} ด้วย read_file
     - Parse JSON → extract .posts array
     - เก็บทุก post object ใน combined array
  3. ห้ามอ่านแค่ 1-2 ไฟล์แล้วสรุป
  4. ห้ามอ่านแค่ stats/top_insights แล้วข้ามไป — ต้องอ่าน posts ทุกตัว
  5. ถ้าไฟล์ใหญ่ (>2000 lines) อ่านเป็น chunks ก็ได้ แต่ต้องอ่านจนจบ

⛔ PART A STRUCTURE (Full Original Content):
  - Group by topic_group: ai-trends → tech-trends → thailand → global
  - Within each group: sort by published_at (newest first)
  - For EACH article, output ALL of these fields:
    • title (verbatim from JSON)
    • published_at date
    • source_name + category
    • urgency level
    • source_url (full URL)
    • content (FULL paragraph — ห้ามตัด ห้ามย่อ)
    • tech_impact (FULL — ห้ามตัด)
    • tags (ALL tags, comma-separated)
    • actions_developer (ALL items)
    • actions_business (ALL items)
    • related_domains (ALL)
    • breakthrough_potential (true/false)
  - ⛔ NO WORD LIMIT on Part A — ใส่ทุกอย่างที่มี
  - ⛔ ถ้ามี 100 articles × ~200 words each = ~20,000 words → ยอมรับ

⛔ PART B STRUCTURE (Deep Analytical Summary — 2500-3500 คำ):
  ส่วนนี้ต้อง ANALYTICAL ไม่ใช่แค่ copy-paste bullets
  ต้องมี context, ความเชื่อมโยงระหว่างข่าว, implications, numbers

  Sections (ทุก section ต้องมี):
  1. TOP HEADLINES (5-7 ข่าว) — 4-5 ประโยคต่อข่าว ไม่ใช่ 1-2 ประโยค
  2. AI TRENDS DEEP ANALYSIS — paragraph form, 200-300 คำ
  3. TECH TRENDS DEEP ANALYSIS — paragraph form, 200-300 คำ
  4. THAILAND AI ANALYSIS — paragraph form, 150-250 คำ
  5. GLOBAL AI ANALYSIS — paragraph form, 150-250 คำ
  6. CROSS-CUTTING THEMES — 3-5 themes ที่เชื่อมข้ามหมวด
  7. KEY NUMBERS — ≥12 ตัวเลขพร้อม context
  8. DEVELOPER ACTION PLAN — 5-8 concrete actions
  9. BUSINESS ACTION PLAN — 5-8 concrete actions
  10. WEEK AHEAD OUTLOOK — what to watch next week
  11. POSTER GENERATION PROMPT — ready-to-use
```

---

## 📋 TXT Template (2-Part Structure)

```
══════════════════════════════════════════════════════════════
  ⚡ AI NEWS WEEKLY — FULL CONTENT + DEEP ANALYSIS
  Week {YYYY}-W{WW} | {START_DATE} → {END_DATE}
  Total: {N} articles from {M} sources across {D} days
  Generated: {RUN_DATE}
══════════════════════════════════════════════════════════════


╔══════════════════════════════════════════════════════════════╗
║  PART A: FULL ORIGINAL CONTENT                              ║
║  ข้อมูลต้นฉบับครบทุก article จากทุกวัน — verbatim from JSON  ║
║  ใช้เป็น full context สำหรับ AI / ChatGPT                    ║
║  Articles: {N} total | Sources: {M} | Days: {D}             ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 AI TRENDS ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸▸▸ Article 1 of {count} ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸

📰 {title}
📅 {published_at} | 🏷️ {source_name} ({category}) | ⚡ {urgency}
🔗 {source_url}
🚀 Breakthrough: {breakthrough_potential}

CONTENT:
{content — FULL paragraph from JSON, verbatim, 100-150+ words, ห้ามตัด}

TECH IMPACT:
{tech_impact — FULL sentence/paragraph from JSON, verbatim}

TAGS: {tag1}, {tag2}, {tag3}, {tag4}, ...

DEVELOPER ACTIONS:
• {actions_developer[0]}
• {actions_developer[1]}

BUSINESS ACTIONS:
• {actions_business[0]}
• {actions_business[1]}

RELATED DOMAINS: {domain1}, {domain2}, {domain3}, ...

▸▸▸ Article 2 of {count} ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸

[repeat for EVERY article in ai-trends — NO EXCEPTIONS]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECH TRENDS ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[same format — every article, every field]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇹🇭 THAILAND AI & TECH ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[same format — every article, every field]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 GLOBAL AI & TECH ({count} articles)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[same format — every article, every field]


╔══════════════════════════════════════════════════════════════╗
║  PART B: DEEP ANALYTICAL SUMMARY (2500-3500 words)          ║
║  สรุปเชิงวิเคราะห์เจาะลึก — ไม่ใช่แค่ list ข่าวสั้นๆ         ║
║  มี context, ตัวเลข, ความเชื่อมโยง, action plans             ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 TOP HEADLINES — สำคัญที่สุดของสัปดาห์ (5-7 ข่าว)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🔴 {HEADLINE_1_TITLE}
   {4-5 ประโยค: WHAT happened in detail, WHO is involved and their role,
    KEY NUMBERS (funding/users/performance), WHY it matters for the industry,
    WHAT are the immediate implications}
   📊 Key stat: {most impactful number from this story}
   🔗 Source: {source_name} | {date} | {source_url}

2. 🔴 {HEADLINE_2_TITLE}
   {4-5 ประโยค — same depth}
   📊 Key stat: {number}
   🔗 Source: {source_name} | {date} | {source_url}

3. 🟠 {HEADLINE_3_TITLE}
   {4-5 ประโยค}
   📊 Key stat: {number}
   🔗 Source: {source_name} | {date} | {source_url}

4. 🟠 {HEADLINE_4_TITLE}
   {4-5 ประโยค}
   📊 Key stat: {number}
   🔗 Source: {source_name} | {date} | {source_url}

5. 🟡 {HEADLINE_5_TITLE}
   {4-5 ประโยค}
   📊 Key stat: {number}
   🔗 Source: {source_name} | {date} | {source_url}

6. 🟡 {HEADLINE_6_TITLE} (optional)
   {4-5 ประโยค}
   ...

7. 🟡 {HEADLINE_7_TITLE} (optional)
   ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 AI TRENDS — DEEP ANALYSIS (200-300 คำ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Write a cohesive analytical PARAGRAPH (not bullets) covering:
 - What is the dominant narrative in AI research/models this week?
 - Which companies made major moves and how do they connect?
 - What technical advances were announced (with numbers)?
 - How do these developments relate to each other?
 - What does this mean for the trajectory of AI capabilities?
 
 ⛔ ต้องเป็น paragraph ต่อเนื่อง ไม่ใช่ bullets แยก
 ⛔ ต้องมีตัวเลข (context windows, benchmarks, performance %)
 ⛔ ต้องเชื่อมโยงข่าวหลายข่าวเข้าด้วยกัน
 ⛔ 200-300 คำ MINIMUM}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECH TRENDS — DEEP ANALYSIS (200-300 คำ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Same style — analytical paragraph covering:
 - What new tools/products launched this week?
 - How are they changing developer workflows?
 - Key metrics (pricing, speed improvements, adoption numbers)
 - Connection between tool releases and broader AI trends
 - What's the trajectory for AI developer tools?}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇹🇭 THAILAND AI & TECH — DEEP ANALYSIS (150-250 คำ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Analytical paragraph:
 - Major Thai AI developments this week
 - Government policy or regulation moves
 - Thai startup/company AI adoption
 - Connection to global trends
 - Implications for Thai tech ecosystem}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 GLOBAL AI & TECH — DEEP ANALYSIS (150-250 คำ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Analytical paragraph:
 - Geopolitical AI moves (US, China, EU)
 - Regulation and policy changes
 - Major business deals, M&A, investments
 - How global politics affects AI development
 - Trade implications, export controls}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔀 CROSS-CUTTING THEMES (3-5 themes ที่เชื่อมข้ามหมวด)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ Section นี้คือสิ่งที่ทำให้ summary มีคุณค่า — วิเคราะห์ PATTERNS ข้ามหมวด

Theme 1: {theme_title}
  {3-4 ประโยค explaining how this theme appears across multiple categories.
   Cite specific articles from different topic_groups that connect to this theme.
   Explain WHY this pattern matters for the industry.}

Theme 2: {theme_title}
  {3-4 ประโยค}

Theme 3: {theme_title}
  {3-4 ประโยค}

Theme 4: {theme_title} (optional)
  {3-4 ประโยค}

Theme 5: {theme_title} (optional)
  {3-4 ประโยค}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 KEY NUMBERS OF THE WEEK (≥12 ตัวเลข พร้อม context)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ ต้องมีอย่างน้อย 12 ตัวเลข — แต่ละตัวต้องมี context ว่าหมายถึงอะไร

 1. ${AMOUNT} — {what it is + who + context sentence}
 2. {NUMBER}% — {what metric + who + why significant}
 3. {NUMBER}M users — {product/service + growth context}
 4. {NUMBER} context window — {model + comparison to previous}
 5. ${AMOUNT} funding — {company + round + investors}
 6. {NUMBER}x improvement — {what metric + baseline}
 7. {NUMBER} tokens/sec — {model + inference speed context}
 8. {NUMBER}% accuracy — {benchmark + model + significance}
 9. ${AMOUNT} — {deal/valuation/cost}
10. {NUMBER} — {headcount/layoffs/hires + company}
11. {NUMBER} — {any metric}
12. {NUMBER} — {any metric}
[add more if available]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 DEVELOPER ACTION PLAN (5-8 concrete actions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ Actions ต้อง SPECIFIC และ ACTIONABLE — ไม่ใช่ "stay updated" ทั่วไป
⛔ ทุก action ต้องอ้างอิงข่าวหรือ trend เฉพาะจากสัปดาห์นี้

1. [ACTION] {specific, implementable action}
   WHY: {which news/trend drives this + expected benefit}

2. [ACTION] {specific action}
   WHY: {reference to specific article/development}

3. [ACTION] {specific action}
   WHY: {reason}

4. [ACTION] {specific action}
   WHY: {reason}

5. [ACTION] {specific action}
   WHY: {reason}

[6-8 more if relevant]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 BUSINESS ACTION PLAN (5-8 concrete actions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ Same standard — SPECIFIC, ACTIONABLE, references this week's news

1. [ACTION] {specific business decision/action}
   WHY: {which news/trend + business impact}

2. [ACTION] {specific action}
   WHY: {reason}

[continue 5-8 actions]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔮 WEEK AHEAD OUTLOOK (สิ่งที่ต้องจับตาสัปดาห์หน้า)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on this week's developments, watch for:
• {specific thing to watch + why based on this week's news}
• {specific thing}
• {specific thing}
• {specific thing}
• {specific thing}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 POSTER GENERATION PROMPT (copy-paste ไปใช้ใน ChatGPT Image)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a modern tech infographic poster with these specifications:

STYLE: Light cyberpunk aesthetic, dark navy (#1a1a2e) background with neon 
cyan (#00d4ff) and magenta (#ff00ff) accents. Clean minimalist layout.

TITLE: "AI WEEK IN REVIEW — {START_DATE} to {END_DATE}"
SUBTITLE: "{N} stories that shaped AI this week"

HEADLINE SECTION (top 1/3):
🔥 {headline_1_short — max 8 words}
🔥 {headline_2_short}
🔥 {headline_3_short}
🔥 {headline_4_short}
🔥 {headline_5_short}

KEY STATS (middle band, monospace, neon numbers):
{stat_1} | {stat_2} | {stat_3} | {stat_4} | {stat_5}

THEME OF THE WEEK (centered, italic):
"{one_sentence_theme}"

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
Generated by AI News Weekly Summary Pipeline v3.0
Run: {RUN_DATE} | Source: data/manifest.json ({D} files)
Part A: Full original content — {X} articles, {Y} words (no limit, verbatim)
Part B: Deep analytical summary — {Z} words (target 2500-3500)
══════════════════════════════════════════════════════════════
```

---

## ⚡ Execution Steps (DETAILED)

```
Step 1: READ MANIFEST + DETERMINE DATE RANGE
  - อ่าน data/manifest.json
  - เลือก 7 ไฟล์แรก (ล่าสุด → เก่าสุด)
  - ถ้ามีน้อยกว่า 7 ก็ใช้ทั้งหมดที่มี
  - กำหนด START_DATE = oldest file date, END_DATE = newest file date
  - คำนวณ ISO week number (W{WW})

Step 2: LOAD ALL JSON — ⛔ ต้องอ่านทุกไฟล์ครบ
  ⛔⛔⛔ CRITICAL: อ่าน data/{date}_news.json ทุกไฟล์ที่เลือก
  ⛔ ห้ามอ่านแค่ 1-2 ไฟล์แล้ว "estimate" ส่วนที่เหลือ
  ⛔ ห้ามอ่านแค่ stats หรือ top_insights — ต้องอ่าน posts array ทั้งหมด
  
  PROCEDURE:
  a) For each file in selected manifest entries:
     - read_file data/{filename}
     - ถ้าไฟล์ > 2000 lines: อ่าน chunk 1 (lines 1-500), chunk 2 (500-1000), etc.
     - Parse JSON
     - Extract .posts array (ทุก post object)
     - Append to combined_posts[]
  
  b) Verify: combined_posts.length should = sum of all files' stats.total
  
  c) Sort combined_posts by published_at (newest first)
  
  d) Group by topic_group:
     - ai_trends_posts = filter(topic_group == "ai-trends")
     - tech_trends_posts = filter(topic_group == "tech-trends")
     - thailand_posts = filter(topic_group == "thailand")
     - global_posts = filter(topic_group == "global")

Step 3: GENERATE PART A (Full Original Content)
  ⛔ For EVERY article in combined_posts:
  - Output ตาม template: title, date, source, urgency, URL, content, 
    tech_impact, tags, actions, domains, breakthrough
  - ⛔ content field: COPY VERBATIM จาก JSON — ห้ามย่อ ห้ามเรียบเรียง
  - ⛔ tech_impact: COPY VERBATIM
  - ⛔ actions: COPY ALL items from array
  - จัดกลุ่มตาม topic_group (ai-trends → tech-trends → thailand → global)
  - ภายในกลุ่ม: sort by published_at newest first
  - ผลลัพธ์ estimate: 80-140 articles × ~200 words = ~16,000-28,000 words
  - ⛔ THIS IS EXPECTED AND CORRECT — ไม่ต้องกังวลเรื่อง length

Step 4: GENERATE PART B (Deep Analytical Summary — 2500-3500 คำ)
  ⛔ This requires ACTUAL ANALYSIS, not just reformatting
  
  4a) TOP HEADLINES:
    - Select 5-7 stories with urgency=high OR breakthrough_potential=true
    - Prioritize by: uniqueness + impact + numbers
    - Write 4-5 sentences per headline (NOT 1-2 like v2.0)
    - Include key stat for each

  4b) CATEGORY ANALYSES (4 sections):
    - AI Trends: 200-300 words analytical paragraph
    - Tech Trends: 200-300 words
    - Thailand: 150-250 words
    - Global: 150-250 words
    - ⛔ Must be PARAGRAPHS not bullets
    - ⛔ Must connect multiple stories into coherent narrative
    - ⛔ Must include specific numbers/metrics

  4c) CROSS-CUTTING THEMES:
    - Identify 3-5 patterns that appear across multiple categories
    - Example: "Government AI regulation" appears in both Thai + Global
    - Example: "Agentic AI" appears in AI Trends + Tech Trends
    - Each theme: 3-4 sentences with specific article references

  4d) KEY NUMBERS:
    - Scan ALL articles for numbers: $amounts, %percentages, Musers, etc.
    - Select ≥12 most impactful numbers
    - Add context sentence for each

  4e) ACTION PLANS:
    - Developer: 5-8 SPECIFIC actions tied to this week's news
    - Business: 5-8 SPECIFIC actions
    - ⛔ Each action must reference a specific article/development
    - ⛔ "Stay updated on AI" is NOT a valid action

  4f) WEEK AHEAD:
    - Based on announcements/roadmaps mentioned this week
    - 5 specific things to watch

  4g) POSTER PROMPT:
    - Fill template with actual data from this week

Step 5: COMBINE → WRITE TXT
  - Combine Part A + Part B into single text file
  - เขียนลง Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt
  - ⛔ ไฟล์อาจมี 20,000-30,000+ words — นั่นคือ CORRECT behavior

Step 6: GENERATE HTML
  - สร้าง formatted HTML version (collapsible sections, styled)
  - Output: Document/Weekly/{YYYY}-W{WW}_weekly_summary.html
  - Use inline CSS (system fonts: Segoe UI, Arial, Tahoma for Thai)

Step 7: GENERATE PDF
  - Convert HTML → PDF ด้วย msedge --headless --print-to-pdf
  - หรือ chrome --headless --print-to-pdf
  - Output: Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf
  - ⛔ ถ้า browser ไม่พร้อม → ข้ามได้ แต่ต้องมี TXT + HTML เสมอ

Step 8: REPORT
  - จำนวน articles ที่ประมวลผล (ต้อง = total จากทุก JSON)
  - Part A word count
  - Part B word count (ต้อง 2500-3500)
  - Files created
  - แนะนำวิธีใช้
```

---

## ⛔ COMMON FAILURES TO AVOID (v3.0 — จากปัญหา v2.0)

```
FAILURE 1: อ่านแค่บาง JSON ไม่ครบ
  ❌ อ่านแค่ 2-3 ไฟล์แล้ว "มีข้อมูลพอแล้ว"
  ✅ ต้องอ่านทุกไฟล์ใน manifest (สูงสุด 7) ครบถ้วน

FAILURE 2: Part A ย่อ content
  ❌ เขียน content เอง หรือ summarize จากต้นฉบับ
  ✅ COPY content field ตรงๆ จาก JSON — verbatim, ทุกคำ

FAILURE 3: Part A ข้ามบาง articles
  ❌ "เลือกมาเฉพาะที่สำคัญ 30 articles"
  ✅ ต้องใส่ EVERY article จากทุก JSON — ไม่มีข้อยกเว้น

FAILURE 4: Part B สั้นเกินไป
  ❌ สรุป 800-1200 คำ ด้วย bullets สั้นๆ ข่าวละ 1 ประโยค
  ✅ 2500-3500 คำ ด้วย paragraphs วิเคราะห์ + ตัวเลข + context

FAILURE 5: Part B headlines ตื้นเกินไป
  ❌ "OpenAI เปิดตัว GPT-5.6" (แค่ 1 ประโยค)
  ✅ 4-5 ประโยค: อะไร, ใคร, ตัวเลข, ทำไมสำคัญ, implications

FAILURE 6: Part B ไม่มี cross-cutting themes
  ❌ สรุปแยกหมวดไม่เชื่อมโยง
  ✅ ต้องมี section วิเคราะห์ patterns ที่เห็นข้ามหลายหมวด

FAILURE 7: Action plans generic เกินไป
  ❌ "ติดตามข่าว AI อย่างต่อเนื่อง"
  ✅ "ทดสอบ GPT-5.6 Luna model สำหรับ real-time applications 
      เพราะ latency ต่ำกว่า 5.5 ถึง 40% ที่ cost ลดลง 60%"

FAILURE 8: Key Numbers น้อยเกินไป
  ❌ 5-6 ตัวเลขแบบ "$XX — funding"
  ✅ ≥12 ตัวเลข แต่ละตัวมี context sentence อธิบาย

FAILURE 9: ไม่สร้าง HTML
  ❌ สร้างแค่ TXT
  ✅ ต้องมี TXT + HTML (PDF ถ้า browser available)

FAILURE 10: หยุดกลางคัน ถามยืนยัน
  ❌ "ไฟล์จะใหญ่มาก ต้องการให้ทำต่อไหม?"
  ✅ ทำจนจบ ไม่ถาม — ไฟล์ใหญ่เป็นปกติ (20-30K words expected)
```

---

## 📂 Output Structure

```
[Project_Path]/
├── Document/
│   └── Weekly/
│       ├── 2026-W26_weekly_summary.txt    ← 2-part text (Full + Deep Analysis)
│       ├── 2026-W26_weekly_summary.html   ← Formatted HTML
│       ├── 2026-W26_weekly_summary.pdf    ← PDF version
│       └── ...
```

---

## 🔄 How to Use Output for Poster Generation

```
วิธีที่ 1 (Full Context — แนะนำ):
  1. Copy ทั้งไฟล์ .txt (Part A + B) หรือเปิด .html
  2. Paste ใน ChatGPT (หรือ upload as file)
  3. บอก: "สร้าง poster จากข้อมูลนี้ ใช้ poster prompt ที่อยู่ใน Part B"
  4. ChatGPT มี full context จาก Part A → สร้าง poster ที่ accurate + ครอบคลุม

วิธีที่ 2 (Quick — เฉพาะ analysis):
  1. Copy เฉพาะ Part B
  2. Paste ใน ChatGPT
  3. สร้าง poster จาก analytical summary

วิธีที่ 3 (Poster Prompt Only):
  1. Copy เฉพาะ section "🎨 POSTER GENERATION PROMPT"
  2. Paste ตรงใน ChatGPT Image
  3. ได้ poster ทันที

วิธีที่ 4 (Newsletter/Report):
  1. ใช้ Part B sections เป็น draft สำหรับ weekly newsletter
  2. Headlines + Analysis + Action Plans = ready-to-publish content
```

---

## 📊 Completion Report

```json
{
  "run_date": "{RUN_DATE}",
  "week": "{YYYY}-W{WW}",
  "date_range": "{START_DATE} → {END_DATE}",
  "files_read": 7,
  "files_read_list": ["2026-06-27_news.json", "2026-06-26_news.json", ...],
  "total_articles_processed": 105,
  "articles_in_part_a": 105,
  "topic_breakdown": {
    "ai_trends": 45,
    "tech_trends": 25,
    "thailand": 18,
    "global": 17
  },
  "part_a": {
    "type": "full_original_content_verbatim",
    "word_count": 22000,
    "articles_included": 105,
    "fields_per_article": ["title", "published_at", "source_name", "category",
      "urgency", "source_url", "content", "tech_impact", "tags",
      "actions_developer", "actions_business", "related_domains",
      "breakthrough_potential"]
  },
  "part_b": {
    "type": "deep_analytical_summary",
    "word_count": 3100,
    "sections": ["headlines", "ai_trends_analysis", "tech_trends_analysis",
      "thailand_analysis", "global_analysis", "cross_cutting_themes",
      "key_numbers", "developer_action_plan", "business_action_plan",
      "week_ahead_outlook", "poster_prompt"],
    "headlines_count": 6,
    "key_numbers_count": 14,
    "cross_cutting_themes_count": 4,
    "developer_actions_count": 7,
    "business_actions_count": 6
  },
  "output_files": [
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.txt",
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.html",
    "Document/Weekly/{YYYY}-W{WW}_weekly_summary.pdf"
  ],
  "status": "SUCCESS ✅",
  "next_step": "Copy TXT/HTML → paste in ChatGPT → generate poster or newsletter"
}
```

---

## ⚙️ Configuration

| Item | Value |
|------|-------|
| Input source | `data/manifest.json` → `data/{date}_news.json` |
| Output folder | `Document/Weekly/` |
| Part A word limit | NONE (verbatim dump of all content) |
| Part B word target | 2500-3500 คำ (STRICT minimum 2500) |
| Headlines count | 5-7 |
| Key numbers minimum | 12 |
| Action plan items | 5-8 per category (developer + business) |
| Cross-cutting themes | 3-5 |
| Language | Part A: original from JSON / Part B: Thai + English terms |
| Week definition | Last 7 available JSON files (not necessarily Mon-Sun) |
| Filename format | `{YYYY}-W{WW}_weekly_summary.{ext}` |
