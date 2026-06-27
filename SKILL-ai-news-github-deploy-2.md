---
name: ai-news-github-deploy
description: >
  Deploy daily AI news JSON to https://chiraleo2000.github.io/ai-news/
  ดึง JSON จาก Document/{date}_News/ → copy ไป repo root data/
  Update manifest.json → git add + commit + push — ทำให้จบครบในรอบเดียว
  ⛔ ห้าม suggest manual — ต้องรันจนสำเร็จเอง
  ⛔ ห้าม control computer / computer-use เด็ดขาด
  ⛔ SANDBOX-AWARE: ถ้า push ผ่านไม่ได้ (network blocked) → commit locally + ให้ Task Scheduler push
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

# SKILL: ai-news-github-deploy v4.0

> **Auto-deploy** — ดึง JSON จาก publisher → push to GitHub repo → GitHub Actions deploys Pages
> ใช้ `execute_pwsh` หรือ bash (Linux sandbox) เท่านั้น — ห้าม computer-use / desktop control
> **v4.0 KEY CHANGE: SANDBOX-AWARE DUAL-PATH PUSH STRATEGY**
> - PATH A (Windows/direct): push ตรงจาก execute_pwsh → ถ้าสำเร็จ = DONE
> - PATH B (Linux sandbox/blocked network): commit locally → Task Scheduler จะ push ให้อัตโนมัติ

---

## ⛔⛔⛔ CRITICAL: REPO STRUCTURE ⛔⛔⛔

**GitHub Pages deploys from the REPO ROOT of `chiraleo2000/ai-news`.**
The website files are at the **root level** of the repo — NOT inside `github-pages/` subfolder.

```
d:\ai-news\                              ← THIS IS THE GIT REPO ROOT (Windows)
/home/user/ai-news/                      ← OR THIS (Claude Linux sandbox, if cloned)

├── .github/workflows/static.yml         ← Pages deployment workflow
├── .nojekyll                            ← disable Jekyll
├── index.html                           ← ✦ SITE ENTRY POINT (served by Pages)
├── assets/
│   └── style.css                        ← Light Cyberpunk CSS
├── js/
│   └── app.js                           ← 4-column topic + filters logic
├── data/                                ← ✦ NEWS DATA (served by Pages)
│   ├── manifest.json                    ← ["2026-06-27_news.json", ...]
│   ├── 2026-06-22_news.json             ← daily news JSON
│   └── ...
├── push-to-github.ps1                   ← ✦ CANONICAL PUSH SCRIPT (PowerShell)
├── setup-auto-push.ps1                  ← One-time Task Scheduler setup
├── SKILL-ai-news-github-deploy-2.md     ← THIS FILE (deploy skill)
├── Document/                            ← publisher output (not served)
│   └── {date}_News/{date}_news.json
└── News/                                ← scraper output (not served)
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

## 🧠 SANDBOX-AWARE PUSH STRATEGY (v4.0 — KEY SECTION)

### Problem
Claude's scheduled tasks run inside a **Linux sandbox** that has a network proxy (localhost:3128) blocking all outbound HTTPS to github.com. This means `git push` will ALWAYS fail from the sandbox.

### Solution: Dual-Path Strategy

```
┌─────────────────────────────────────────────────────┐
│ DETECT ENVIRONMENT                                   │
│                                                      │
│ IF running on Windows (d:\ai-news exists):           │
│   → PATH A: Direct push (full control)              │
│                                                      │
│ IF running on Linux sandbox:                         │
│   → PATH B: Commit locally + rely on auto-push      │
└─────────────────────────────────────────────────────┘
```

### PATH A — Windows / Direct Push (Kiro IDE, manual run)
```
1. Copy JSON → data/
2. Update manifest.json
3. git add + commit
4. git push origin master (with retry logic)
5. ✅ Report SUCCESS only after push succeeds
```

### PATH B — Claude Linux Sandbox (scheduled task, no network)
```
1. Copy JSON → data/
2. Update manifest.json
3. git add + commit (THIS ALWAYS WORKS)
4. TRY git push origin master
   → IF push succeeds (rare but possible) → ✅ DONE
   → IF push fails (network blocked — expected) → proceed to step 5
5. Report: "COMMIT COMPLETE — push pending"
   → Windows Task Scheduler runs push-to-github.ps1 daily at 11:30 AM
   → OR user can manually run: pwsh -File push-to-github.ps1
6. ✅ Status = COMMITTED (push will happen automatically)
```

### ⛔ IMPORTANT RULES FOR PATH B:
```
- ห้ามรายงานว่า "FAILED" ถ้า commit สำเร็จแล้ว
- ถ้า push ไม่ผ่านเพราะ network blocked → ถือว่า "COMMITTED_PENDING_PUSH"
- ห้ามสร้าง script files อะไรเพิ่ม (push-to-github.ps1 มีอยู่แล้ว)
- ห้ามสร้าง _DEPLOY_STATUS*.md หรือ auto-push-*.ps1 (เลิกใช้แล้ว)
- Task Scheduler จะ push ให้เองตอน 11:30 AM ทุกวัน
- ถ้า push fail เพราะ "Connection refused" / "proxy" / "403" → PATH B
- ถ้า push fail เพราะ "non-fast-forward" / "rejected" → retry with rebase (PATH A logic)
```

### How to Detect Environment:
```bash
# Linux sandbox indicators:
- Running as bash (not PowerShell)
- /home/user/ path exists
- curl to github.com returns 403 or connection refused
- Environment has HTTP_PROXY or network restrictions

# Windows indicators:
- Running as PowerShell
- d:\ai-news path exists
- git push works (PAT embedded in remote URL)
```

---

## ⛔⛔⛔ ABSOLUTE MANDATORY RULES ⛔⛔⛔

### 🚫 FORBIDDEN TOOLS & ACTIONS

| ❌ FORBIDDEN | ทำไม | ใช้แทน |
|---|---|---|
| computer-use / desktop control | ⛔ ห้ามเด็ดขาดทุกกรณี | execute_pwsh / bash |
| control_pwsh_process (background) | git push จบใน 30 วิ | execute_pwsh |
| สร้าง date-specific scripts | มี push-to-github.ps1 แล้ว | ใช้ script ที่มีอยู่ |
| สร้าง _DEPLOY_STATUS*.md | เลิกใช้แล้ว v4.0 | report ใน completion JSON |
| สร้าง auto-push-{date}.ps1 | เลิกใช้แล้ว v4.0 | push-to-github.ps1 |
| ถาม "ต้องการให้ push ไหม" | push เสมอ ไม่ถาม | ทำเลย |
| สร้าง branch ใหม่ | push master เท่านั้น | git push origin master |
| บอก "ทำไม่ได้" แล้วหยุด | commit เสมอ push ถ้าได้ | commit + auto-push |

### ✅ MANDATORY SUCCESS CRITERIA

```
PATH A (Windows — direct push):
  ✅ git push origin master สำเร็จ (exit code 0)
  ✅ manifest.json อัปเดตแล้ว
  ✅ daily JSON อยู่ใน data/ แล้ว
  → Status: "SUCCESS ✅"

PATH B (Linux sandbox — network blocked):
  ✅ git commit สำเร็จ (changes committed locally)
  ✅ manifest.json อัปเดตแล้ว
  ✅ daily JSON อยู่ใน data/ แล้ว
  ✅ push-to-github.ps1 exists (Task Scheduler will handle push)
  → Status: "COMMITTED_PENDING_PUSH ✅ (auto-push at 11:30 AM)"
```

---

## 🎯 Skill Prompt

```
<skill>ai-news-github-deploy v4.0</skill>

วันที่: {TARGET_DATE} | mode: {MODE: init|update}

⛔ TOOL RESTRICTION:
  - Windows: ใช้ execute_pwsh สำหรับ shell commands
  - Linux sandbox: ใช้ bash commands
  - ใช้ fs_write / read_file สำหรับ file operations
  - ⛔⛔⛔ ห้าม computer-use / control computer เด็ดขาด ⛔⛔⛔

⛔ PUSH STRATEGY (v4.0 SANDBOX-AWARE):
  - TRY git push ก่อนเสมอ
  - ถ้า push สำเร็จ → DONE
  - ถ้า push fail เพราะ network/proxy → ถือว่า COMMITTED_PENDING_PUSH (OK)
  - ถ้า push fail เพราะ rejected/conflict → retry with rebase (5x) → force push
  - ⛔ ห้ามรายงาน "FAILED" ถ้า commit สำเร็จแล้ว + push fail เพราะ network

⛔ NO QUESTIONS ASKED:
  - ห้ามถามยืนยันใดๆ
  - ห้ามแนะนำให้ user ทำเอง
  - ห้ามหยุดรอ input
  - ทำให้จบ → commit → push (ถ้าได้) → รายงานผล

⛔ PATH CONFIGURATION:
  PROJECT_ROOT    = d:\ai-news  (Windows) | /home/user/ai-news (Linux sandbox)
  SOURCE_JSON     = {PROJECT_ROOT}/Document/{TARGET_DATE}_News/{TARGET_DATE}_news.json
  DEST_DATA       = {PROJECT_ROOT}/data
  DEST_MANIFEST   = {PROJECT_ROOT}/data/manifest.json
  GIT_REMOTE      = https://github.com/chiraleo2000/ai-news.git
  SITE_URL        = https://chiraleo2000.github.io/ai-news/
  BRANCH          = master
  PUSH_SCRIPT     = {PROJECT_ROOT}/push-to-github.ps1

⛔ PRE-FLIGHT CHECK:
  - Verify index.html exists at repo root
  - Verify assets/style.css and js/app.js exist
  - Verify data/manifest.json exists and is valid JSON
  - Verify .nojekyll exists
```

---

## ⚡ EXECUTION SEQUENCE

### Step 0: ENVIRONMENT DETECTION + GIT SETUP

```
# Detect: Windows or Linux sandbox?
IF PowerShell available AND d:\ai-news exists:
  → WINDOWS MODE (PATH A likely)
  → execute_pwsh for all commands

IF bash AND /home/user/ path:
  → LINUX SANDBOX MODE (PATH B likely)
  → bash for all commands

# Clear locks + set git config (both environments):
  Remove all .git/*.lock files recursively
  git config user.email "ai-news-bot@chiraleo2000.github.io"
  git config user.name "AI News Bot"
```

### Step 1: CHECK/CREATE SOURCE JSON
- ตรวจว่า Document/{DATE}_News/{DATE}_news.json มีอยู่
- ถ้าไม่มี → สร้างจาก Articles/Batches (ดู Fallback section)
- ถ้ามี → ใช้เลย

### Step 2: COPY JSON → data/
```
# Windows:
Copy-Item "{PROJECT_ROOT}\Document\{DATE}_News\{DATE}_news.json" "{PROJECT_ROOT}\data\{DATE}_news.json" -Force

# Linux:
cp "{PROJECT_ROOT}/Document/{DATE}_News/{DATE}_news.json" "{PROJECT_ROOT}/data/{DATE}_news.json"
```

### Step 3: UPDATE manifest.json
- อ่าน data/manifest.json
- เพิ่ม "{DATE}_news.json" ที่ index 0 (ถ้ายังไม่มี)
- เขียนกลับ

### Step 3.5: ✅ VALIDATE manifest.json (⛔ CRITICAL)
```
🚨 BEFORE COMMIT — ต้องตรวจ JSON validity:
  [ ] JSON parses without error
  [ ] Array has closing bracket ]
  [ ] Minimum 1 entry exists
  [ ] Latest date entry is at index 0
  [ ] No truncated/incomplete lines
  [ ] File size > 50 bytes
  → ถ้า invalid → STOP ❌ → fix → ทำใหม่ ไม่ commit
  → ถ้า valid → ไปขั้นต่อ
```

### Step 3.6: ✅ VERIFY Site Files Exist (⛔ CRITICAL)
```
BEFORE PUSH — ตรวจที่ repo root:
  - index.html exists
  - assets/style.css exists
  - js/app.js exists
  - .nojekyll exists
  - .github/workflows/static.yml exists
  → If any missing → SITE WILL BREAK → must fix before push
```

### Step 3.7: ✅ VERIFY 4-TOPIC JSON STRUCTURE
```
Ensure daily JSON posts include:
  - Each post: category, topic, tags, source_name
  - Category values: "Thai" | "International" | "Research" | "YouTube"
  - topic_group: "ai-trends" | "tech-trends" | "thailand" | "global"
```

### Step 4: GIT ADD + COMMIT + PUSH (⛔ SANDBOX-AWARE)

```
# ── 4A: Stage + Commit (ALWAYS works, both environments) ──

  git add "data/{DATE}_news.json" "data/manifest.json"
  
  # Check if there are changes
  IF no changes staged → "Nothing to commit" → exit SUCCESS
  
  git commit -m "Add AI news {DATE}"

# ── 4B: Push (may fail in sandbox — that's OK) ──

  TRY: git push origin master
  
  IF exit code 0 → PUSH SUCCESS → go to Step 5
  
  IF error contains "proxy" OR "Connection refused" OR "403 Forbidden" OR "network":
    → SANDBOX DETECTED — push cannot work here
    → Status = COMMITTED_PENDING_PUSH
    → Task Scheduler (push-to-github.ps1) will push at 11:30 AM
    → go to Step 6

  IF error contains "rejected" OR "non-fast-forward":
    → CONFLICT — use retry escalation (below)
    → After retry succeeds → PUSH SUCCESS
    → After 5 retries → force push
```

#### RETRY ESCALATION (only for rejected/conflict, NOT for network blocks):
```
Attempt 1: git push origin master
  → rejected? ↓
Attempt 2: git pull --rebase origin master → git push
  → rebase conflict? → git rebase --abort → git pull --strategy-option=theirs → push
  → fail? ↓
Attempt 3: git fetch origin → git reset --soft origin/master → git add data/ → commit → push
  → fail? ↓
Attempt 4: git pull origin master --allow-unrelated-histories → resolve → push
  → fail? ↓
Attempt 5 (FORCE): git push -f origin master
```

### Step 5: VERIFY PUSH SUCCESS
- ตรวจ exit code = 0
- ถ้าสำเร็จ → report SUCCESS

### Step 6: REPORT

---

## 🔄 Fallback: สร้าง Daily JSON จาก Articles/Batches

> ถ้า `Document/{DATE}_News/{DATE}_news.json` ไม่มี
> AI ต้องสร้างเองจาก batch files หรือ article.json:

```
PREFERRED PATH (batch files):
1. หา batches: News/Batches/{TARGET_DATE}/batch_*.json
2. อ่านทุก batch JSON → extract articles array
3. Combine all articles → classify topic_group
4. Ensure each post content = 100-150 words
5. Produce daily JSON

FALLBACK PATH (individual articles):
1. หา articles: News/Articles/**/{TARGET_DATE}/**/article.json
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
```

---

## ⚙️ Configuration

| Item | Value |
|------|-------|
| Project root (Windows) | `d:\ai-news` |
| Project root (Linux sandbox) | `/home/user/ai-news` (if cloned) |
| Site files location | repo root — index.html, assets/, js/, data/ |
| Data folder | `data/` |
| Publisher output | `Document/{date}_News/{date}_news.json` |
| Git remote | `https://github.com/chiraleo2000/ai-news.git` |
| Remote with PAT | `https://{PAT}@github.com/chiraleo2000/ai-news.git` |
| PAT file | `.github-pat` (40 chars, ghp_ prefix) |
| Site URL | `https://chiraleo2000.github.io/ai-news/` |
| Actions URL | `https://github.com/chiraleo2000/ai-news/actions` |
| Branch | `master` |
| Push script | `push-to-github.ps1` (PowerShell, Windows only) |
| Task Scheduler | `AI-News-GitHub-AutoPush` — daily 11:30 AM |

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

---

## ✅ Error Recovery (ทำอัตโนมัติ ไม่ถาม user)

| Error | วิธีแก้ |
|-------|---------|
| manifest.json invalid JSON | Fix closing bracket → validate → commit |
| `.git/index.lock` exists | Remove ALL *.lock recursively |
| Push rejected (non-fast-forward) | `git pull --rebase origin master` → push ใหม่ |
| Push rejected (diverged) | `git pull --strategy-option=theirs origin master` → push |
| Source JSON not found | สร้างจาก Articles/Batches folder (Fallback) |
| Network timeout / proxy blocked | **PATH B** — commit locally, Task Scheduler pushes |
| 403 Connection blocked | **PATH B** — sandbox detected, commit only |
| 404 after deploy | Check index.html exists at repo root |
| Data not showing | Check data/manifest.json has the new entry |
| "another git process running" | Remove ALL .git/*.lock files recursively |
| Authentication failure | Re-set remote URL with PAT from .github-pat |

---

## 🔧 PUSH SCRIPT REFERENCE

### push-to-github.ps1 (Windows — the ONLY push script needed)
```
PURPOSE: Push local commits to origin/master
LOCATION: d:\ai-news\push-to-github.ps1
RUN: pwsh -File "d:\ai-news\push-to-github.ps1"

BEHAVIOR:
  1. Clears stale .git/*.lock files
  2. Ensures git user config
  3. Checks if there are unpushed commits (rev-list count)
  4. If 0 ahead → exits with "Nothing to push"
  5. Push with 5x retry + rebase logic
  6. Force-push as last resort
  7. Logs to push-log.txt

CALLED BY:
  - Windows Task Scheduler (daily 11:30 AM)
  - Manual: user double-clicks or runs from terminal
  - Claude (Kiro IDE) via execute_pwsh after committing
```

### setup-auto-push.ps1 (one-time setup — run as Admin)
```
PURPOSE: Register Task Scheduler job for daily auto-push
RUN ONCE: pwsh -ExecutionPolicy Bypass -File "d:\ai-news\setup-auto-push.ps1"
CREATES: Task "AI-News-GitHub-AutoPush" → runs push-to-github.ps1 daily 11:30 AM
```

---

## 📊 Completion Report

```json
{
  "mode": "update",
  "date": "{TARGET_DATE}",
  "environment": "windows|linux-sandbox",
  "source": "Document/{DATE}_News/{DATE}_news.json | fallback:Batches|Articles",
  "json_in_data_folder": true,
  "json_path": "data/{DATE}_news.json",
  "manifest_updated": true,
  "manifest_validated": true,
  "manifest_validation": {
    "is_valid_json": true,
    "has_closing_bracket": true,
    "entry_count": 6,
    "latest_entry_at_index_0": true,
    "no_truncation": true
  },
  "git_committed": true,
  "git_pushed": true|false,
  "push_method": "direct|task-scheduler-pending",
  "push_attempts": 1,
  "push_blocked_reason": null|"network_proxy"|"sandbox_restricted",
  "auto_push_configured": true,
  "auto_push_script": "push-to-github.ps1",
  "auto_push_schedule": "daily 11:30 AM (Task Scheduler)",
  "site_url": "https://chiraleo2000.github.io/ai-news/",
  "actions_url": "https://github.com/chiraleo2000/ai-news/actions",
  "data_url": "https://chiraleo2000.github.io/ai-news/data/{DATE}_news.json",
  "status": "SUCCESS ✅ | COMMITTED_PENDING_PUSH ✅"
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
│ Step 3: SKILL-github-deploy v4.0 (THIS SKILL)               │
│   1. Copy JSON → data/{DATE}_news.json                       │
│   2. Update data/manifest.json                               │
│   3. ✅ VALIDATE manifest.json                               │
│   4. ✅ VERIFY index.html + assets at repo root              │
│   5. git add + commit                                        │
│   6. TRY push:                                               │
│      → Windows: push directly (retry + force)                │
│      → Sandbox: commit done, push-to-github.ps1 handles it   │
├─────────────────────────────────────────────────────────────┤
│ Step 4: PUSH DELIVERY                                        │
│   PATH A: Push succeeded immediately → GitHub Actions fires  │
│   PATH B: Task Scheduler (11:30 AM) → push-to-github.ps1    │
│           → push succeeds → GitHub Actions fires             │
├─────────────────────────────────────────────────────────────┤
│ Step 5: GitHub Actions auto-deploys to Pages                 │
│   Workflow: .github/workflows/static.yml                     │
│   Deploys entire repo root as static site                    │
│   Site: https://chiraleo2000.github.io/ai-news/              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Daily Update Process

```
1. Publisher creates: Document/{NEW_DATE}_News/{NEW_DATE}_news.json
2. Deploy skill copies to: data/{NEW_DATE}_news.json
3. Updates: data/manifest.json — add new filename at index 0
4. Git: git add data/ → git commit -m "Add AI news {DATE}"
5. Push:
   - Direct (Windows): git push origin master → site updates in ~2 min
   - Sandbox: commit saved → push-to-github.ps1 at 11:30 AM → site updates
6. GitHub Actions auto-deploys → site shows new date
7. js/app.js auto-loads latest date → classifies posts into 4 columns
```

---

## ⛔ AUTOMATED/SCHEDULED RUN SAFEGUARDS (v4.0):

```
เมื่อรันจาก Claude Scheduled Task (Linux sandbox):

1. ALWAYS clear all locks first (index.lock, HEAD.lock, refs/*.lock)
2. ALWAYS set git user.email + user.name (required for commit)
3. NEVER use interactive commands (no -i flags, no editor opens)
4. TRY push — if network blocked, that's EXPECTED and OK
5. DO NOT create any extra scripts (push-to-github.ps1 already exists)
6. DO NOT create _DEPLOY_STATUS*.md files (deprecated in v4.0)
7. DO NOT create auto-push-{date}.ps1 files (deprecated in v4.0)
8. Report COMMITTED_PENDING_PUSH if push was blocked by network
9. ถ้า git status = "nothing to commit" → SUCCESS (already up to date)
10. Trust that Windows Task Scheduler will push within hours
```

---

## 🔐 Authentication

```
PAT is embedded in the git remote URL:
  https://ghp_XXXXX@github.com/chiraleo2000/ai-news.git

To re-configure (if needed):
  git remote set-url origin "https://$(cat .github-pat)@github.com/chiraleo2000/ai-news.git"

PAT file location: .github-pat (NOT committed to repo — in .gitignore)
PAT format: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars)
```
