---
name: ai-news-github-deploy
description: >
  Deploy daily AI news JSON to https://chiraleo2000.github.io/ai-news/
  ดึง JSON จาก Document/{date}_News/ → copy ไป repo root data/
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

# SKILL: ai-news-github-deploy v3.0

> **Auto-deploy** — ดึง JSON จาก publisher → push to GitHub repo → GitHub Actions deploys Pages
> ใช้ `execute_pwsh` เท่านั้น — ห้าม computer-use / desktop control เด็ดขาด
> **ถ้า push ไม่สำเร็จ = FAILED → ต้อง retry จนกว่าจะสำเร็จ**

---

## ⛔⛔⛔ CRITICAL: REPO STRUCTURE ⛔⛔⛔

**GitHub Pages deploys from the REPO ROOT of `chiraleo2000/ai-news`.**
The website files are at the **root level** of the repo — NOT inside `github-pages/` subfolder.

```
d:\ai-news\                              ← THIS IS THE GIT REPO ROOT
├── .github/workflows/static.yml         ← Pages deployment workflow (in repo)
├── .nojekyll                            ← disable Jekyll
├── index.html                           ← ✦ SITE ENTRY POINT (served by Pages)
├── assets/
│   └── style.css                        ← Light Cyberpunk CSS
├── js/
│   └── app.js                           ← 4-column topic + filters logic
├── data/                                ← ✦ NEWS DATA (served by Pages)
│   ├── manifest.json                    ← ["2026-06-23_news.json", "2026-06-22_news.json", ...]
│   ├── 2026-06-22_news.json             ← daily news JSON
│   └── ...
├── SKILL-MASTER-ai-news.md              ← pipeline skill
├── SKILL-ai-news-publisher-3.md         ← publisher skill
├── SKILL-ai-news-github-deploy-2.md     ← THIS FILE (deploy skill)
├── Document/                            ← publisher output (not served)
│   └── {date}_News/{date}_news.json
├── News/                                ← scraper output (not served)
└── github-pages/                        ← LEGACY subfolder (can ignore)
```

### 🌐 Live URLs
| URL | Purpose |
|-----|---------|
| https://chiraleo2000.github.io/ai-news/ | Live site (index.html) |
| https://chiraleo2000.github.io/ai-news/data/manifest.json | Data manifest |
| https://chiraleo2000.github.io/ai-news/data/{DATE}_news.json | Daily news JSON |
| https://github.com/chiraleo2000/ai-news/actions | GitHub Actions status |
| https://github.com/chiraleo2000/ai-news | Repository |

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
<skill>ai-news-github-deploy v3.0</skill>

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
  SOURCE_JSON     = d:\ai-news\Document\{TARGET_DATE}_News\{TARGET_DATE}_news.json
  DEST_DATA       = d:\ai-news\data
  DEST_MANIFEST   = d:\ai-news\data\manifest.json
  GIT_REMOTE      = https://github.com/chiraleo2000/ai-news.git
  SITE_URL        = https://chiraleo2000.github.io/ai-news/
  BRANCH          = master

⛔ PRE-FLIGHT CHECK:
  - Verify d:\ai-news\index.html exists (site won't display without it)
  - Verify d:\ai-news\assets\style.css and d:\ai-news\js\app.js exist
  - Verify d:\ai-news\data\manifest.json exists and is valid JSON
  - Verify d:\ai-news\.nojekyll exists
```

---

## ⚡ EXECUTION SEQUENCE

```
Step 0: CLEAR ALL GIT LOCKS + FIX SANDBOX ISSUES
  execute_pwsh:
    # Remove ALL lock files (critical for scheduled/automated runs)
    Get-ChildItem "d:\ai-news\.git" -Recurse -Filter "*.lock" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Reset any half-finished operations
    git -C "d:\ai-news" reset HEAD --quiet 2>$null
    
    # Ensure git user config exists (required for automated commits)
    git -C "d:\ai-news" config user.email "ai-news-bot@chiraleo2000.github.io"
    git -C "d:\ai-news" config user.name "AI News Bot"

Step 1: CHECK/CREATE SOURCE JSON
  - ตรวจว่า Document/{DATE}_News/{DATE}_news.json มีอยู่
  - ถ้าไม่มี → สร้างจาก Articles/Batches (ดู Fallback section)
  - ถ้ามี → ใช้เลย

Step 2: COPY JSON → data/ (at repo root!)
  execute_pwsh:
    Copy-Item "d:\ai-news\Document\{DATE}_News\{DATE}_news.json" "d:\ai-news\data\{DATE}_news.json" -Force

Step 3: UPDATE manifest.json
  - อ่าน d:\ai-news\data\manifest.json
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

Step 3.6: ✅ VERIFY Site Files Exist (⛔ CRITICAL)
  🌐 BEFORE PUSH — ตรวจที่ repo root:
  - d:\ai-news\index.html exists
  - d:\ai-news\assets\style.css exists
  - d:\ai-news\js\app.js exists
  - d:\ai-news\.nojekyll exists
  - d:\ai-news\.github\workflows\static.yml exists
  - If any missing → SITE WILL BREAK → must fix before push

Step 3.7: ✅ VERIFY 4-TOPIC JSON STRUCTURE
  🗂️ Ensure daily JSON posts include fields needed for topic classification:
  - Each post must have: category, topic, tags, source_name
  - Category values: "Thai" | "International" | "Research" | "YouTube"
  - Topic classification (client-side): ai-trends | tech-trends | thailand | global
  - The JS app auto-classifies posts into 4 columns using keywords + category

Step 4: GIT ADD + COMMIT + PUSH (⛔ MANDATORY — AUTOMATED-SAFE)
  ⛔ AUTOMATED/SCHEDULED RUN STRATEGY:
  - ใช้ single PowerShell block ที่จัดการ error เอง
  - ห้ามแยกเป็นหลาย execute_pwsh calls (ป้องกัน state issues)
  - รวม add + commit + push + retry ในก้อนเดียว

  execute_pwsh (cwd: d:\ai-news):
    # Clear locks AGAIN before git operations
    Get-ChildItem ".git" -Recurse -Filter "*.lock" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Stage files
    git add "data/{DATE}_news.json" "data/manifest.json"
    
    # Check if there are changes to commit
    $status = git status --porcelain "data/"
    if (-not $status) { Write-Output "Nothing to commit"; exit 0 }
    
    # Commit
    git commit -m "Add AI news {DATE}" --allow-empty-message
    
    # Push with retry logic (ALL IN ONE BLOCK)
    $maxRetries = 5
    $pushed = $false
    for ($i = 1; $i -le $maxRetries; $i++) {
      Write-Output "Push attempt $i..."
      git push origin master 2>&1
      if ($LASTEXITCODE -eq 0) { $pushed = $true; break }
      
      Write-Output "Push failed, trying rebase..."
      git pull --rebase origin master 2>&1
      if ($LASTEXITCODE -ne 0) {
        git rebase --abort 2>$null
        git pull origin master --strategy-option=theirs 2>&1
      }
      Start-Sleep -Seconds 2
    }
    
    # Force push as last resort
    if (-not $pushed) {
      Write-Output "Force pushing..."
      git push -f origin master 2>&1
    }
    
    # Final verification
    if ($LASTEXITCODE -eq 0) { Write-Output "PUSH SUCCESS" }
    else { Write-Output "PUSH FAILED after all retries"; exit 1 }

Step 5: VERIFY PUSH SUCCESS
  - ตรวจ exit code = 0
  - ถ้าสำเร็จ → report SUCCESS
  - ถ้าไม่ → retry ตั้งแต่ Step 4

Step 6: REPORT (เฉพาะเมื่อ push สำเร็จแล้วเท่านั้น)
```

---

## 🔄 Fallback: สร้าง Daily JSON จาก Articles/Batches

> ถ้า `Document/{DATE}_News/{DATE}_news.json` ไม่มี
> AI ต้องสร้างเองจาก batch files หรือ article.json:

```
PREFERRED PATH (v3.0 — batch files):
1. หา batches: News\Batches\{TARGET_DATE}\batch_*.json
2. อ่านทุก batch JSON → extract articles array
3. Combine all articles → classify topic_group
4. Ensure each post content = 100-150 words
5. Produce daily JSON

FALLBACK PATH (individual articles):
1. หา articles: News\Articles\**\{TARGET_DATE}\**\article.json
2. อ่านทุก article.json ที่ fetch.status = "pass"
3. Map แต่ละ article → posts item

BOTH PATHS produce:
{
  "date": "{TARGET_DATE}",
  "generated_at": "ISO-8601 now",
  "schema_version": "3.0",
  "stats": {
    "total": N,
    "by_topic": { "ai_trends": X, "tech_trends": X, "thailand": X, "global": X },
    "by_source_category": { "thai": X, "international": X, "research": X, "youtube": X }
  },
  "posts": [{
    "id": "hash", "slug": "...", "title": "...",
    "topic": "AI Research", "topic_group": "ai-trends",
    "source_name": "...", "category": "International",
    "urgency": "high|medium|low",
    "content": "100-150 words STRICT — single paragraph",
    "source_url": "https://permalink",
    "tech_impact": "1 sentence",
    "tags": [], "published_at": "ISO-8601",
    "breakthrough_potential": false,
    "related_domains": [],
    "actions_developer": ["action 1", "action 2"],
    "actions_business": ["action 1", "action 2"],
    "youtube_channel": "", "youtube_video": ""
  }]
}

5. ใช้ fs_write เขียนตรงไป d:\ai-news\data\{DATE}_news.json
6. ดำเนินการ git push ต่อ (Step 4)
```

---

## ⚙️ Configuration

| Item | Value |
|------|-------|
| Project root / Git repo | `d:\ai-news` |
| Site files location | `d:\ai-news\` (root) — index.html, assets/, js/, data/ |
| Data folder | `d:\ai-news\data\` |
| Publisher output | `d:\ai-news\Document\{date}_News\{date}_news.json` |
| Git remote | `https://github.com/chiraleo2000/ai-news.git` |
| Site URL | `https://chiraleo2000.github.io/ai-news/` |
| Actions URL | `https://github.com/chiraleo2000/ai-news/actions` |
| Branch | `master` |

---

## 🎨 UI/UX: Light Cyberpunk Theme — 4 Topic Columns

The site uses a **light background cyberpunk** aesthetic with **4-column layout**:
- Light off-white background (#f0f2f8) with neon cyan/magenta accents
- Orbitron display font + Rajdhani body + Share Tech Mono
- Subtle scanline overlay for texture
- Blog cards with left-border urgency color coding
- Filter bar: date archive, urgency, source dropdown, text search

### 4 Main Topic Categories (columns)

| Column | Topic ID | Color | Description |
|---|---|---|---|
| 🧠 AI TRENDS | ai-trends | Cyan #00d4ff | LLMs, research papers, AI safety, model training, benchmarks |
| ⚙️ TECH TRENDS | tech-trends | Purple #a855f7 | AI tools, products, developer platforms, coding assistants |
| 🇹🇭 THAILAND AI & TECH | thailand | Orange #ff6b35 | Thai sources, Thai AI ecosystem, DEPA, Thai startups |
| 🌐 GLOBAL AI & TECH | global | Green #00cc6a | AI policy, business, export controls, talent, geopolitics |

Articles are auto-classified into topics by `js/app.js` based on keywords, tags, source category, and topic field.

---

## ✅ Error Recovery (ทำอัตโนมัติ ไม่ถาม user)

| Error | วิธีแก้ |
|-------|---------|
| manifest.json invalid JSON | Fix closing bracket → validate → commit |
| `.git/index.lock` exists | `Get-ChildItem .git -Recurse -Filter *.lock \| Remove-Item -Force` |
| `.git/HEAD.lock` exists | Same — remove ALL *.lock recursively |
| Push rejected (non-fast-forward) | `git pull --rebase origin master` → push ใหม่ |
| Push rejected (diverged) | `git pull --strategy-option=theirs origin master` → push |
| Source JSON not found | สร้างจาก Articles/Batches folder (Fallback) |
| Network timeout | retry 3 ครั้ง (รอ 2 วิ) |
| 404 after deploy | Check index.html exists at repo root |
| Data not showing | Check data/manifest.json has the new entry |
| "another git process running" | Remove ALL .git/*.lock files recursively |
| Authentication failure | Use stored credentials / git credential manager |
| Sandbox/container state issues | Clear locks + reset HEAD + fresh add/commit |

### ⛔ RETRY ESCALATION (v3.0 — Automated-Safe):
```
Attempt 1: git push origin master
  → fail? ↓
Attempt 2: git pull --rebase origin master → git push origin master
  → rebase conflict? → git rebase --abort → git pull --strategy-option=theirs
  → fail? ↓
Attempt 3: git fetch origin → git reset --soft origin/master → git add data/ → git commit → git push
  → fail? ↓
Attempt 4: git pull origin master --allow-unrelated-histories → resolve → push
  → fail? ↓
Attempt 5 (FORCE): git push -f origin master
```

### ⛔ AUTOMATED/SCHEDULED RUN SAFEGUARDS:
```
เมื่อรันจาก Claude Scheduled Task หรือ automated script:

1. ALWAYS clear all locks first (index.lock, HEAD.lock, refs/*.lock)
2. ALWAYS set git user.email + user.name (อาจหายในแต่ละ session)
3. NEVER use interactive commands (no -i flags, no editor opens)
4. COMBINE git operations in single PowerShell block (prevent state loss)
5. ALWAYS have force-push as final fallback
6. Set timeout: ถ้า push ไม่สำเร็จใน 60 วินาที → force push ทันที
7. ห้ามสร้าง background process สำหรับ git (ใช้ execute_pwsh เท่านั้น)
8. ถ้า git status แสดงว่า "nothing to commit" → ถือว่า SUCCESS (ไม่ต้อง push)
```

---

## 📊 Completion Report

```json
{
  "mode": "update",
  "date": "{TARGET_DATE}",
  "source": "Document/{DATE}_News/{DATE}_news.json | fallback:Batches|Articles",
  "json_in_data_folder": true,
  "json_path": "d:\\ai-news\\data\\{DATE}_news.json",
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
  "site_url": "https://chiraleo2000.github.io/ai-news/",
  "actions_url": "https://github.com/chiraleo2000/ai-news/actions",
  "data_url": "https://chiraleo2000.github.io/ai-news/data/{DATE}_news.json",
  "status": "SUCCESS ✅"
}
```

---

## 🔗 Full Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: SKILL-MASTER (scrape → News/Batches/ + Articles/)    │
│   web_search → web_fetch → batch_N.json + article.json/md    │
│   92 sources | 3 batches | 100-150 words per summary         │
├─────────────────────────────────────────────────────────────┤
│ Step 2: SKILL-publisher (Batches/Articles → Document/)       │
│   รวม articles → daily JSON + HTML + PDF                     │
│   Each post: 100-150 words content, topic_group assigned     │
├─────────────────────────────────────────────────────────────┤
│ Step 3: SKILL-github-deploy (THIS SKILL)                     │
│   ⛔ ใช้ execute_pwsh เท่านั้น                                │
│   1. Copy JSON → d:\ai-news\data\{DATE}_news.json            │
│   2. Update d:\ai-news\data\manifest.json                    │
│   3. ✅ VALIDATE manifest.json                               │
│   4. ✅ VERIFY index.html + assets at repo root              │
│   5. git add + commit + push (cwd: d:\ai-news)              │
│   6. Verify push success                                     │
├─────────────────────────────────────────────────────────────┤
│ Step 4: GitHub Actions auto-deploys to Pages                 │
│   Workflow: .github/workflows/static.yml                     │
│   Deploys entire repo root as static site                    │
│   Site: https://chiraleo2000.github.io/ai-news/              │
│   Actions: https://github.com/chiraleo2000/ai-news/actions   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Daily Update Process (for daily news addition)

When new news JSON is ready for a new day:

```
1. Publisher creates: Document/{NEW_DATE}_News/{NEW_DATE}_news.json
2. Deploy skill copies to: d:\ai-news\data\{NEW_DATE}_news.json
3. Updates: d:\ai-news\data\manifest.json — add new filename at index 0
4. Git: git add data/ → git commit → git push origin master
5. GitHub Actions auto-deploys → site shows new date in archive dropdown
6. js/app.js auto-loads latest date → classifies posts into 4 columns
7. Verify: curl https://chiraleo2000.github.io/ai-news/data/manifest.json
```
