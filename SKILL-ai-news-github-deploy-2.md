---
name: ai-news-github-deploy
description: >
  Deploy daily AI news JSON to ai-news.github.io
  ดึง JSON จาก Document/{date}_News/ → copy ไป github-pages/data/
  Update manifest.json → git add + commit + push — ทำให้จบครบในรอบเดียว
  ⛔ ห้าม suggest manual — ต้องรันจนสำเร็จเอง
  ⛔ ห้าม control computer / computer-use เด็ดขาด
  ⛔ ต้อง git push สำเร็จ ไม่งั้นถือว่า FAILED → ต้องทำใหม่
agents: [main_agent, general_purpose]
trigger:
  - "deploy github pages ai"
  - "สร้าง github.io ai news"
  - "update github ai news"
  - "push ai news pages"
  - "ai-news deploy"
  - "สร้างเว็บข่าว AI"
requires:
  - ai-news-publisher
---

# SKILL: ai-news-github-deploy v1.0

> **Auto-deploy** — ดึง JSON จาก publisher → push GitHub Pages
> ใช้ `execute_pwsh` เท่านั้น — ห้าม computer-use / desktop control เด็ดขาด
> **ถ้า push ไม่สำเร็จ = FAILED → ต้อง retry จนกว่าจะสำเร็จ**

---

## ⛔⛔⛔ ABSOLUTE MANDATORY RULES ⛔⛔⛔

### 🚫 FORBIDDEN TOOLS & ACTIONS

| ❌ FORBIDDEN | ทำไม | ใช้แทน |
|---|---|---|
| computer-use / desktop control | ⛔ ห้ามเด็ดขาดทุกกรณี | execute_pwsh |
| control_pwsh_process (background) | git push จบใน 30 วิ | execute_pwsh |
| suggest ให้ user ทำเอง | AI ต้องรันเอง | execute_pwsh |
| ถาม "ต้องการให้ push ไหม" | push เสมอ ไม่ถาม | ทำเลย |
| หยุดก่อน push สำเร็จ | ถ้าไม่ push = ไม่สมบูรณ์ | retry |
| สร้าง branch ใหม่ | push master เท่านั้น | git push origin master |
| บอก "ทำไม่ได้" แล้วหยุด | ต้องหาทางจน push ได้ | retry + workaround |

### ✅ MANDATORY SUCCESS CRITERIA

```
✅ git push origin master สำเร็จ (exit code 0)
   → ถ้าไม่สำเร็จ = SKILL FAILED → ต้อง retry จนกว่าจะได้
   → retry สูงสุด 5 ครั้ง
   → แต่ละ retry: git pull --rebase → resolve → push ใหม่
   → ถ้า 5 ครั้งยังไม่ได้ → force push: git push -f origin master

✅ ใช้ execute_pwsh เท่านั้น
✅ ทำต่อเนื่องไม่หยุดกลางคัน ไม่ถามยืนยัน
✅ manifest.json อัปเดตแล้ว
✅ daily JSON อยู่ใน data/ แล้ว
```

---

## 🎯 Skill Prompt

```
<skill>ai-news-github-deploy v1.0</skill>

วันที่: {TARGET_DATE} | mode: {MODE: init|update}

⛔ TOOL RESTRICTION:
  - ใช้ execute_pwsh เท่านั้นสำหรับ shell commands
  - ใช้ fs_write / read_file สำหรับ file operations
  - ⛔⛔⛔ ห้าม computer-use / control computer เด็ดขาด ⛔⛔⛔

⛔ PUSH MANDATE:
  - git push MUST succeed — ไม่มีข้อยกเว้น
  - ถ้า push fail → ถือว่า skill ยังไม่สมบูรณ์ → retry
  - ถ้า retry 5 ครั้งไม่ได้ → git push -f origin master
  - ⛔ ห้ามรายงาน "completed" จนกว่า push จะสำเร็จจริง

⛔ NO QUESTIONS ASKED:
  - ห้ามถามยืนยันใดๆ
  - ห้ามแนะนำให้ user ทำเอง
  - ห้ามหยุดรอ input
  - ทำให้จบ → push → รายงานผล

⛔ PATH CONFIGURATION:
  PROJECT_ROOT    = d:\ai-news
  GITHUB_PAGES    = d:\ai-news\github-pages
  PUBLISHER_OUT   = d:\ai-news\Document\{TARGET_DATE}_News
  SOURCE_JSON     = d:\ai-news\Document\{TARGET_DATE}_News\{TARGET_DATE}_news.json
  DEST_DATA       = d:\ai-news\github-pages\data
  GIT_REMOTE      = https://github.com/{YOUR_USERNAME}/ai-news.git
  SITE_URL        = https://{YOUR_USERNAME}.github.io/ai-news/
  BRANCH          = master
```

---

## ⚡ EXECUTION SEQUENCE

```
Step 0: CLEAR GIT LOCK
  execute_pwsh:
    if (Test-Path "d:\ai-news\github-pages\.git\index.lock") {
      Remove-Item "d:\ai-news\github-pages\.git\index.lock" -Force
    }

Step 1: CHECK/CREATE SOURCE JSON
  - ตรวจว่า Document/{DATE}_News/{DATE}_news.json มีอยู่
  - ถ้าไม่มี → สร้างจาก Articles (ดู Fallback section)
  - ถ้ามี → ใช้เลย

Step 2: COPY JSON → github-pages/data/
  execute_pwsh:
    Copy-Item "SOURCE_PATH" "d:\ai-news\github-pages\data\{DATE}_news.json" -Force

Step 3: UPDATE manifest.json
  - อ่าน manifest.json
  - เพิ่ม "{DATE}_news.json" ที่ index 0 (ถ้ายังไม่มี)
  - เขียนกลับ

Step 3.5: ✅ VALIDATE manifest.json (⛔ CRITICAL)
  🚨 BEFORE COMMIT — ต้องตรวจ JSON validity:
  - parse manifest.json ว่า valid JSON หรือไม่
  - ตรวจว่ามี closing bracket `]`
  - ตรวจว่า {DATE}_news.json อยู่ใน array ที่ index 0
  - ถ้า invalid → STOP ❌ → fix → ทำใหม่ ไม่ commit
  ✅ ถ้า valid → ไปขั้นต่อ

  🔍 Validation checklist:
    [ ] JSON parses without error
    [ ] Array has closing bracket
    [ ] Minimum 1 entry exists
    [ ] Latest date entry is at index 0
    [ ] No truncated/incomplete lines
    [ ] File size > 50 bytes

Step 3.6: ✅ VERIFY GitHub Pages Configuration (⛔ CRITICAL)
  🌐 BEFORE PUSH — ต้องตรวจ GitHub Pages setup:
  - Verify `.nojekyll` file exists in repository root
    - If missing → create it: `touch .nojekyll`
  - Verify `.github/workflows/static.yml` exists
  - Verify files are NOT in .gitignore

Step 4: GIT ADD + COMMIT + PUSH (⛔ MANDATORY)
  execute_pwsh (cwd: d:\ai-news\github-pages):
    git add .
    git commit -m "Add AI news {DATE}"
    git push origin master

  ถ้า push fail:
    execute_pwsh:
      git pull --rebase origin master
      git push origin master

  ยังไม่ได้อีก:
    execute_pwsh:
      git push -f origin master

Step 5: VERIFY PUSH SUCCESS
  - ตรวจ exit code = 0
  - ถ้าสำเร็จ → report SUCCESS
  - ถ้าไม่ → retry ตั้งแต่ Step 4

Step 6: REPORT (เฉพาะเมื่อ push สำเร็จแล้วเท่านั้น)
```

---

## 🔄 Fallback: สร้าง Daily JSON จาก Articles

> ถ้า `Document/{DATE}_News/{DATE}_news.json` ไม่มี
> AI ต้องสร้างเองจาก article.json ที่ scrape ไว้:

```
1. หา articles: News\Articles\**\{TARGET_DATE}\**\article.json
2. อ่านทุก article.json ที่ fetch.status = "pass"
3. Map แต่ละ article → posts item:
   {
     "id": article_id,
     "slug": content.slug,
     "title": content.title,
     "topic": meta.category_label,
     "source_name": source_info.source_name,
     "category": source_info.category,
     "urgency": tech_insights.urgency,
     "content": content.summary_1,
     "summary": content.summary,
     "source_url": source.url,
     "tech_impact": tech_insights.impact_summary,
     "tags": meta.tags,
     "category_label": meta.category_label,
     "published_at": meta.published_at,
     "date": meta.target_date,
     "youtube_channel": media_links.youtube_channel,
     "youtube_video": media_links.youtube_video
   }
4. Wrap เป็น daily JSON:
   {
     "date": "{TARGET_DATE}",
     "generated_at": "ISO-8601 now",
     "stats": { total, thai, international, research, youtube },
     "posts": [...]
   }
5. ใช้ fs_write เขียนตรงไป github-pages\data\{DATE}_news.json
6. ดำเนินการ git push ต่อ (Step 4)
```

---

## 📋 GitHub Pages Structure

```
github-pages/                     ← d:\ai-news\github-pages\
├── index.html                    ← AI News Dashboard UI
├── article.html                  ← Detail page
├── assets/
│   └── style.css                 ← AI News CSS
├── js/
│   ├── app.js                    ← Main logic
│   └── article.js                ← Article page logic
├── data/
│   ├── manifest.json             ← ["2026-06-22_news.json", ...]
│   ├── 2026-06-22_news.json      ← Daily AI news (latest)
│   ├── 2026-06-21_news.json
│   └── ...
└── .github/
    └── workflows/
        └── static.yml            ← GitHub Pages deployment
```

---

## ⚙️ Configuration

| Item | Value |
|------|-------|
| Project root | `d:\ai-news` |
| GitHub Pages dir | `d:\ai-news\github-pages` |
| Publisher output | `d:\ai-news\Document\{date}_News\{date}_news.json` |
| Branch | `master` |

---

## ✅ Error Recovery (ทำอัตโนมัติ ไม่ถาม user)

| Error | วิธีแก้ |
|-------|---------|
| manifest.json invalid JSON | Fix closing bracket → validate → commit |
| `.git/index.lock` exists | `Remove-Item .git\index.lock -Force` |
| Push rejected | `git pull --rebase origin master` → push ใหม่ |
| Source JSON not found | สร้างจาก Articles folder (Fallback) |
| Network timeout | retry 3 ครั้ง (รอ 5 วิ) |

### ⛔ RETRY ESCALATION:
```
Attempt 1: git push origin master
  → fail? ↓
Attempt 2: git pull --rebase origin master → git push origin master
  → fail? ↓
Attempt 3: git fetch origin ; git reset --soft origin/master ; git add . ; git commit ; git push
  → fail? ↓
Attempt 4: git pull origin master --allow-unrelated-histories → resolve → push
  → fail? ↓
Attempt 5 (FORCE): git push -f origin master
```

---

## 📊 Completion Report

```json
{
  "mode": "update",
  "date": "{TARGET_DATE}",
  "source": "Document/{DATE}_News/{DATE}_news.json | fallback:Articles",
  "json_in_data_folder": true,
  "manifest_updated": true,
  "manifest_validated": true,
  "manifest_validation": {
    "is_valid_json": true,
    "has_closing_bracket": true,
    "entry_count": 5,
    "latest_entry_at_index_0": true,
    "no_truncation": true
  },
  "git_committed": true,
  "git_pushed": true,
  "push_attempts": 1,
  "site_url": "https://{YOUR_USERNAME}.github.io/ai-news/",
  "status": "SUCCESS ✅"
}
```

---

## 🔗 Full Pipeline Flow

```
┌─────────────────────────────────────────────────────┐
│ Step 1: SKILL-MASTER (scrape → Articles/)            │
│   web_search → web_fetch → article.json + article.md │
├─────────────────────────────────────────────────────┤
│ Step 2: SKILL-publisher (Articles/ → Document/)      │
│   รวม articles → daily JSON + HTML + PDF             │
├─────────────────────────────────────────────────────┤
│ Step 3: SKILL-github-deploy (THIS SKILL)             │
│   ⛔ ใช้ execute_pwsh เท่านั้น                        │
│   1. copy JSON → 2. update manifest                  │
│   3. ✅ VALIDATE manifest.json (CRITICAL)            │
│   4. ✅ VERIFY GitHub Pages config                   │
│   5. git push → 6. verify success                    │
└─────────────────────────────────────────────────────┘
```
