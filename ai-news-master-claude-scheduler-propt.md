---
description: >
  Single-run skill merging ai-news-master-pipeline (scrape) + ai-news-publisher (publish)
  into one pass. Scrapes Thai/Intl/Research+YouTube AI news, classifies into 4 topics,
  writes batch JSON, then immediately builds the daily publish package.
  ⛔ NO GIT — git add/commit/push are NOT part of this skill (separate task: ai-news-github-deploy).
trigger:
  - "run ai news pipeline"
  - "scrape and publish ai news"
  - "สร้าง ai daily digest"
---

# SKILL: ai-news-pipeline-combined v1.2

Merges **ai-news-master-pipeline v2.0** (scrape) and **ai-news-publisher v2.1** (publish)
into a single run so batch files don't have to be re-read in a second invocation.
Output must stay **GraphRAG / MCP RAG searchable**: stable ids, explicit entities, Thai dense summaries.

## Run params
`RUN_DATE` / `TARGET_DATE` = today, Asia/Bangkok. Window = 24h before RUN_DATE.

## Global rules (apply everywhere)
- ⛔ Never run `git add` / `git commit` / `git push`, and never create push scripts. That is a separate task (`ai-news-github-deploy`).
- **Clear cache first** (every run): PowerShell `ops/Clear-AiNewsCache.ps1` in `C:\Users\AI-PC-DEV\Documents\ai-news`. Removes `_tmp_build`, `_site`, `_to_delete`, ops `__pycache__`, and writes `data/cache-bust.json`. Do **not** delete published `Document/` or cloud history.
- Fetch order: direct URL (`truncated` mode) → retry `rendered` if body <300 chars → Tier-1 aggregator → YouTube search (metadata only, never fetch video). Caps: ≤3 `web_search`, ≤15 `web_fetch` per batch. Never re-fetch a URL already used. A "pass" requires HTTP 200 + title + body ≥300 chars; `source.url` must be the article permalink, never a homepage/listing page.
- Keep only items published inside the 24h window. If no date is visible, keep only if it's in the top 3 of a "latest" listing page; otherwise skip.
- `topic_group` (assign to every article): **ai-trends** (LLM/research/training/safety/benchmarks) · **tech-trends** (tools/products/dev platforms/APIs) · **thailand** (any Thai source, company, or gov AI) · **global** (policy/business/regulation/talent/geopolitics).
- `content.summary_1` / publish `content`: **100–150 Thai words**, one dense paragraph, no bullets/headers, covering what/who/key numbers/why-it-matters. Translate to Thai even if the source is English; keep brand names, technical terms (LLM, API, GPU…), and numeric stats in original form. Verify word count before writing.
- `tech_insights` required per article: `impact_summary` (never "N/A" if urgency ≥ medium), `actions_developer` (2 items), `actions_business` (2 items), `urgency`, `related_domains`, `breakthrough_potential`.
- **GraphRAG entity fields (required for consistency with `ai-news-private`)**: every article / post must also carry searchable entities extracted from the story (do not invent):
  - `entities.organizations` — companies, labs, agencies (e.g. OpenAI, NVIDIA, DEPA)
  - `entities.people` — named people when present
  - `entities.products` — models/chips/products (GPT, Claude, H200, Copilot…)
  - `entities.places` — countries/cities/regions when relevant
  - `meta.tags` / `tags` — 3–6 short English tags for MCP `list_posts` / Pages search
  - Prefer canonical English spellings for brands; keep Thai place names when the source is Thai.
- Same-day rerun: dedupe by `source.url` and by title similarity ≥90%. **Add-only** — never delete or overwrite existing articles, batches, or manifest entries.
- Publish copies must land in **both** `data/{DATE}_news.json` and `github-pages/data/{DATE}_news.json` (Pages root + mirror).

## Pipeline — one run, 10 steps

**Prep**
0. Clear local caches: `ops/Clear-AiNewsCache.ps1`

**Scrape**
1. Batch 1 — Thai sources (see registry) → `News/Batches/{DATE}/batch_1.json`
2. Batch 2 — International sources → `batch_2.json`
3. Batch 3 — Research + international YouTube → `batch_3.json`

   Each batch file: `{ batch, target_date, generated_at, total_articles, articles: [...] }` (schema below). Also write per-article `News/Articles/{Category}/{Source}/{DATE}/{Slug}/article.json` + `.md` for backward compatibility. Target ≥10 articles/batch when material exists — breadth over depth; if a source has nothing, move on immediately.

**Publish (same run, immediately after)**

4. Read all `batch_*.json`, filter `fetch.status == "pass"`.
5. Confirm `topic_group` + entity fields; compute stats (`total`, `by_topic`, `by_source_category`, `urgency_breakdown`, `breakthrough_count`).
6. Write `Document/{DATE}_News/{DATE}_news.json` (main), `{DATE}_news.html` (light-cyberpunk theme), `{DATE}_news.pdf` (reportlab; chrome-headless fallback), `_index.json`.
7. Update `Document/manifest.json` (prepend, add-only) → copy `{DATE}_news.json` to **`data/`** and **`github-pages/data/`** → update both manifests (prepend, add-only).
8. **GraphRAG refresh (private workspace)**: copy `data/*_news.json` into `C:\Users\AI-PC-DEV\Documents\ai-news-private\data\`, run `node ops/build-ai-news-graph.js`, then `.\ops\sync-to-public.ps1` so public `data/graph.json` matches today's digest.
9. Print the Final Completion Report (below). **Stop — no git push.**

## article.json (per-article, from scrape)
```json
{
  "article_id": "", "topic_group": "ai-trends|tech-trends|thailand|global",
  "source_info": {"category": "Thai|International|Research|YouTube", "source_name": "", "registry_key": "", "main_url": ""},
  "source": {"url": "", "type": "direct|aggregator|youtube", "fetch_priority_used": "1_direct|2_aggregator|3_youtube"},
  "fetch": {"status": "pass|fail", "http_status": 200, "fetched_at": "", "fetch_mode": "truncated|rendered|search"},
  "meta": {"published_at": "", "target_date": "", "within_24h": true, "batch": "1|2|3", "category_label": "", "tags": []},
  "content": {"title": "", "title_th": "", "slug": "", "summary_1": "", "language": "th"},
  "tech_insights": {"impact_summary": "", "actions_developer": ["", ""], "actions_business": ["", ""], "urgency": "high|medium|low", "related_domains": [], "breakthrough_potential": false},
  "entities": {"organizations": [], "people": [], "products": [], "places": []},
  "media_links": {"youtube_channel": "", "youtube_video": ""}
}
```

## {DATE}_news.json (final publish artifact)
```json
{
  "date": "", "generated_at": "", "schema_version": "combined-1.2",
  "stats": {"total": 0, "by_topic": {"ai_trends": 0, "tech_trends": 0, "thailand": 0, "global": 0}, "by_source_category": {"thai": 0, "international": 0, "research": 0, "youtube": 0}, "urgency_breakdown": {"high": 0, "medium": 0, "low": 0}, "breakthrough_count": 0},
  "top_insights": [{"title": "", "impact_summary": "", "urgency": "", "article_id": ""}],
  "posts": [{
    "id": "", "slug": "", "title": "", "title_th": "", "topic_group": "", "source_name": "", "category": "",
    "urgency": "", "content": "", "source_url": "", "tech_impact": "", "tags": [], "published_at": "",
    "breakthrough_potential": false, "related_domains": [], "actions_developer": [], "actions_business": [],
    "entities": {"organizations": [], "people": [], "products": [], "places": []},
    "youtube_channel": "", "youtube_video": ""
  }]
}
```
Field mapping `post ← article`: `id←article_id`, `slug←content.slug`, `title/title_th←content.title/title_th`, `topic_group←topic_group`, `source_name/category←source_info.*`, `urgency←tech_insights.urgency`, `content←content.summary_1`, `source_url←source.url`, `tech_impact←tech_insights.impact_summary`, `tags←meta.tags`, `published_at←meta.published_at`, `breakthrough_potential/related_domains/actions_*←tech_insights.*`, `entities←entities`, `youtube_*←media_links.*`.

**Search / MCP contract:** `id`, `title`/`title_th`, `content`, `tags`, `related_domains`, and `entities.*` must be enough for Pages search + MCP tools `list_posts` / `search_rag` / `get_post` without re-fetching the source.

## HTML theme (light cyberpunk)
```css
:root{--bg-primary:#f0f2f8;--bg-card:#fff;--bg-header:#1a1a2e;--neon-cyan:#00d4ff;--neon-purple:#a855f7;--neon-orange:#ff6b35;--neon-green:#00ff88;--text-primary:#1a1a2e;--text-secondary:#4a4a6a}
.topic-ai-trends{border-left:4px solid #00d4ff}.topic-tech-trends{border-left:4px solid #a855f7}.topic-thailand{border-left:4px solid #ff6b35}.topic-global{border-left:4px solid #00ff88}
```
Sections: Header → Stats bar → Top Insights → AI Trends → Tech Trends → Thailand → Global → Footer.
Fonts: Google Fonts CDN — Orbitron / Rajdhani / Share Tech Mono.

## Output tree
```
News/Batches/{DATE}/batch_{1,2,3}.json
News/Articles/{Category}/{Source}/{DATE}/{Slug}/article.json + .md   (backward-compat)
Document/{DATE}_News/{DATE}_news.{json,html,pdf}, _index.json
Document/manifest.json
data/{DATE}_news.json, manifest.json, cache-bust.json, graph.json   (Pages root)
github-pages/data/{DATE}_news.json, manifest.json, graph.json       (mirror)
ai-news-private/vault/ + github-pages/data/graph.json               (private GraphRAG)
```

## Final Completion Report
```json
{
  "run_date": "", "target_date": "", "pipeline": "ai-news-combined-1.2",
  "cache_cleared": true,
  "batches": {"1": {"attempted": 0, "created": 0}, "2": {"attempted": 0, "created": 0}, "3": {"attempted": 0, "created": 0}},
  "articles_total": 0, "topic_breakdown": {"ai_trends": 0, "tech_trends": 0, "thailand": 0, "global": 0},
  "entities_filled": 0, "skipped_duplicate": 0, "skipped_older_than_24h": 0,
  "graphrag": {"nodes": 0, "edges": 0, "synced_to_public": true},
  "publish_files": ["Document/{DATE}_News/{DATE}_news.json", "...html", "...pdf", "_index.json", "Document/manifest.json", "data/{DATE}_news.json", "github-pages/data/{DATE}_news.json", "data/graph.json"],
  "git_push": "NOT PERFORMED — separate task ai-news-github-deploy",
  "status": "complete"
}
```

---

## Source registry (92) — `Name | url | search keyword`

### Batch 1 — Thai sites (18)
1. Blognone | https://www.blognone.com | AI technology Thailand blognone
2. Beartai | https://www.beartai.com/news | AI tech beartai ไทย
3. Techsauce | https://techsauce.co | AI startup Thailand techsauce
4. Thumbsup | https://www.thumbsup.in.th | AI Thailand thumbsup
5. TechTalkThai | https://www.techtalkthai.com | enterprise AI TechTalkThai
6. Bangkok Biz AI | https://www.bangkokbiznews.com/category/tech/ai | AI Bangkok business news
7. Prachachat AI | https://www.prachachat.net/tag/ปัญญาประดิษฐ์ | AI ปัญญาประดิษฐ์ ประชาชาติ
8. Thairath AI | https://www.thairath.co.th/tags/AI | AI ไทยรัฐ เทคโนโลยี
9. Thaiware News | https://news.thaiware.com | AI IT ข่าว thaiware
10. EnTechReview | https://entechreview.com | AI review tech Thai
11. Thai PBS Tech | https://www.thaipbs.or.th/news/technology | AI technology Thai PBS
12. Spring News Tech | https://www.springnews.co.th/digital-tech | AI tech spring news ไทย
13. INN News Tech | https://www.innnews.co.th/category/news/tech | AI tech INN News ไทย
14. ThaiPR IT | https://www.thaipr.net/it | AI IT press release ThaiPR
15. The Standard Tech | https://thestandard.co/technology | AI tech The Standard ไทย
16. Positioning Mag | https://positioningmag.com/topics/technology | AI tech Positioning Thailand
17. Manager Online Cyber | https://mgronline.com/cyberbiz | AI tech manager online ไทย
18. Nation TV Tech | https://www.nationtv.tv/category/technology | AI technology nation ไทย

### Batch 1 — Thai YouTube (10)
1. BorntoDev | https://www.youtube.com/@borntodev | BorntoDev AI latest
2. Sertis Corp | https://www.youtube.com/@SertisOfficial | Sertis AI tech latest
3. Techsauce TV | https://www.youtube.com/@techsaucetv | Techsauce AI latest
4. TechTalkThai TV | https://www.youtube.com/@TechTalkThaiTV | TechTalkThai latest AI
5. Beartai | https://www.youtube.com/@beartai | Beartai AI tech latest
6. Blognone | https://www.youtube.com/@blognone | Blognone AI latest
7. Spring News Online | https://www.youtube.com/@springnewsonline | Spring News tech AI latest
8. NBT2HD | https://www.youtube.com/@NBT2HDchannel | NBT2HD เศรษฐกิจ เทคโนโลยี AI
9. AI Weekly TH | https://www.youtube.com/@aiweeklyth | AI news weekly Thai
10. DataScience TH | https://www.youtube.com/@datascienceth | data science AI Thailand latest

### Batch 2 — International media (23)
1. TechCrunch AI | https://techcrunch.com/category/artificial-intelligence | AI startup TechCrunch latest
2. The Verge AI | https://www.theverge.com/ai-artificial-intelligence | AI news The Verge latest
3. VentureBeat AI | https://venturebeat.com/category/ai | AI enterprise VentureBeat
4. Wired AI | https://www.wired.com/tag/artificial-intelligence | AI policy Wired latest
5. Ars Technica AI | https://arstechnica.com/ai | AI research Ars Technica latest
6. MIT Tech Review AI | https://www.technologyreview.com/topic/artificial-intelligence | MIT AI research latest
7. MarkTechPost | https://www.marktechpost.com | AI ML paper marktech latest
8. Reuters AI | https://www.reuters.com/technology/artificial-intelligence | AI Reuters news latest
9. Bloomberg Tech | https://www.bloomberg.com/technology | AI Bloomberg tech latest
10. CNBC Tech | https://www.cnbc.com/technology | AI CNBC tech latest
11. Forbes AI | https://www.forbes.com/ai | AI Forbes latest
12. Fortune Tech | https://fortune.com/section/tech | AI Fortune tech latest
13. The Atlantic Tech | https://www.theatlantic.com/technology | AI Atlantic latest
14. Axios AI | https://www.axios.com/technology/ai | AI Axios latest
15. The Information AI | https://www.theinformation.com | AI The Information latest
16. Pandaily | https://pandaily.com | China AI Pandaily latest
17. KrASIA | https://kr.asia | Southeast Asia AI KrASIA
18. China Economic Review | https://chinaeconomicreview.com | China AI business economic review
19. SCMP Tech | https://www.scmp.com/technology | China AI policy SCMP latest
20. Nikkei Asia Tech | https://asia.nikkei.com/Business/Technology | Asia AI Nikkei latest
21. Tech in Asia | https://www.techinasia.com | Southeast Asia AI startup latest
22. Rest of World Tech | https://restofworld.org/section/technology | global south AI tech latest
23. Semafor Tech | https://www.semafor.com/vertical/tech | AI policy Semafor latest

### Batch 2 — Newsletters / lab blogs (21)
1. The Batch (DeepLearning.AI) | https://www.deeplearning.ai/the-batch | AI weekly batch DeepLearning
2. Import AI | https://importai.substack.com | AI research import weekly Jack Clark
3. BuildFastWithAI | https://www.buildfastwithai.com/blogs | AI tools daily build fast
4. Hacker News AI | https://news.ycombinator.com/?q=AI | AI HackerNews latest discussion
5. OpenAI Blog | https://openai.com/news | OpenAI announcement latest
6. Anthropic News | https://www.anthropic.com/news | Anthropic Claude announcement latest
7. Google DeepMind | https://deepmind.google/discover/blog | Google DeepMind AI research latest
8. Meta AI Blog | https://ai.meta.com/blog | Meta AI LLaMA announcement latest
9. HuggingFace Blog | https://huggingface.co/blog | HuggingFace model release latest
10. AI News (Alan D Thompson) | https://lifearchitect.ai/news | AI global tracker Alan Thompson
11. Recsys Frontier | https://www.recsys-frontier.com | AI weekly deep analysis recsys
12. DigitalApplied | https://www.digitalapplied.com/blog | AI strategy policy digital applied
13. Mistral AI Blog | https://mistral.ai/news | Mistral AI model release latest
14. xAI Blog | https://x.ai/blog | xAI Grok announcement latest
15. Cohere Blog | https://cohere.com/blog | Cohere enterprise AI latest
16. Perplexity Blog | https://www.perplexity.ai/hub/blog | Perplexity AI search latest
17. AI Snake Oil | https://www.aisnakeoil.com | AI hype criticism latest
18. Benedict Evans | https://www.ben-evans.com | AI industry analysis Benedict Evans
19. Simon Willison Blog | https://simonwillison.net | LLM tools Simon Willison latest
20. Lil'Log (Lilian Weng) | https://lilianweng.github.io | AI research Lilian Weng latest
21. The Sequence AI | https://thesequence.substack.com | AI research weekly sequence

### Batch 3 — Research (8)
1. ArXiv AI (cs.AI) | https://arxiv.org/list/cs.AI/recent | AI paper arxiv latest cs.AI
2. ArXiv ML (cs.LG) | https://arxiv.org/list/cs.LG/recent | ML paper arxiv latest cs.LG
3. ArXiv NLP (cs.CL) | https://arxiv.org/list/cs.CL/recent | NLP paper arxiv latest cs.CL
4. ArXiv Vision (cs.CV) | https://arxiv.org/list/cs.CV/recent | computer vision paper arxiv cs.CV
5. Papers with Code | https://paperswithcode.com | AI SOTA paper benchmark latest
6. Semantic Scholar AI | https://www.semanticscholar.org/topic/Artificial-Intelligence | AI research semantic scholar
7. AI Index (Stanford) | https://aiindex.stanford.edu | Stanford AI Index report
8. Connected Papers | https://www.connectedpapers.com | AI paper graph connected latest

### Batch 3 — International YouTube (16)
1. Two Minute Papers | https://www.youtube.com/@TwoMinutePapers | Two Minute Papers latest AI
2. Andrej Karpathy | https://www.youtube.com/@AndrejKarpathy | Karpathy AI deep learning latest
3. Yannic Kilcher | https://www.youtube.com/@YannicKilcher | Yannic AI paper review latest
4. AI Explained | https://www.youtube.com/@aiexplained-official | AI Explained latest news
5. Matt Wolfe | https://www.youtube.com/@mreflow | Matt Wolfe AI tools latest
6. Wes Roth | https://www.youtube.com/@WesRoth | Wes Roth AI latest
7. ML Street Talk | https://www.youtube.com/@MachineLearningStreetTalk | ML Street Talk AI latest podcast
8. David Shapiro | https://www.youtube.com/@DavidShapiroAutomator | David Shapiro AI futures latest
9. The AI Breakdown | https://www.youtube.com/@theaibreakdown | AI Breakdown policy news latest
10. The Shipyard AI | https://www.youtube.com/@theshipyardai | Shipyard AI dev-focused news latest
11. Sertis Tech Focus | https://www.youtube.com/@SertisOfficial | Sertis AI enterprise latest
12. Sam Witteveen | https://www.youtube.com/@samwitteveenai | Sam Witteveen AI coding latest
13. ThursdAI | https://www.youtube.com/@ThursdAI | ThursdAI weekly recap AI latest
14. Lex Fridman | https://www.youtube.com/@lexfridman | Lex Fridman AI interview latest
15. Fireship | https://www.youtube.com/@Fireship | Fireship AI dev news latest
16. NetworkChuck | https://www.youtube.com/@NetworkChuck | NetworkChuck AI hacking latest