---
name: ai-news-master-pipeline
description: >
  Master pipeline v3.0 — Source-First, Batch-Oriented, 80+ sources, 4-topic output.
  Summaries: 100-150 words. Output: News/Batches/{DATE}/batch_{N}.json
agents: [main_agent, general_purpose]
trigger:
  - "กวาดข่าว AI"
  - "scrape ai news"
  - "ai-news master"
  - "run ai pipeline"
  - "กวาดข่าวเทคโนโลยี"
---
# SKILL-MASTER: ai-news-pipeline v3.0

---

## 🎯 Master Prompt

```
<skill>ai-news-master-pipeline v3.0</skill>
run: {RUN_DATE} | target: {TARGET_DATE}
mode: sequential (1→2→3) or parallel (Haiku 4.5 ×3)

⛔ CORE RULES:
  - 24H FILTER: keep only articles published within 24h before RUN_DATE
    → has date: must be in window | no date: position ≤3 on page → keep
  - FETCH: truncated first → rendered if body <300 chars → aggregator if fail
  - SUMMARY: EXACTLY 100-150 words per article (content.summary_1) — MANDATORY
  - COVERAGE: ≥10 articles/batch | breadth over depth | skip source if no news
  - DEDUP: skip if source.url or title ≥90% matches existing article
  - OUTPUT: batch JSON (preferred) + individual article.json/md (compat)
  - TOPIC: every article must have topic_group field
    ai-trends: LLM/model/research/training/safety/benchmark/arxiv
    tech-trends: tools/product/API/platform/coding/iOS/release
    thailand: any Thai source, DEPA, Thai company, Thai government AI
    global: policy/regulation/business/talent/investment/geopolitics

⛔ FETCH LIMITS (per batch):
  web_search ≤3 | web_fetch ≤20 | no repeat URLs

⛔ OUTPUT (preferred — batch mode):
  News/Batches/{TARGET_DATE}/batch_{N}.json
  ALSO: News/Articles/{Category}/{Source}/{DATE}/{Slug}/article.json + .md

⛔ SUMMARY RULE (⚡ KEY v3.0):
  content.summary_1 = EXACTLY 100-150 words
  - Must be a single dense paragraph
  - Cover: what happened, who, key numbers/facts, why it matters
  - NO bullet points, NO headers inside summary
  - Count words before writing — enforce strictly
```

---

## 📦 Batch JSON Schema

```json
{
  "batch": 1,
  "target_date": "2026-06-22",
  "total_articles": 12,
  "articles": [{
    "article_id": "hash",
    "schema_version": "3.0",
    "topic_group": "ai-trends|tech-trends|thailand|global",
    "source_info": {
      "category": "Thai|International|Research|YouTube",
      "source_name": "TechCrunch",
      "main_url": "https://techcrunch.com/category/artificial-intelligence"
    },
    "source": {
      "url": "https://permalink",
      "type": "direct|aggregator|youtube"
    },
    "fetch": { "status": "pass", "http_status": 200, "fetch_mode": "truncated|rendered" },
    "meta": {
      "published_at": "ISO-8601",
      "target_date": "yyyy-mm-dd",
      "batch": "1|2|3",
      "tags": [],
      "language": "th|en"
    },
    "content": {
      "title": "Article title",
      "slug": "url-slug",
      "summary_1": "EXACTLY 100-150 word paragraph. Dense, single para, covers what/who/numbers/why-matters. No bullets.",
      "language": "th|en"
    },
    "tech_insights": {
      "impact_summary": "1 sentence — mandatory if urgency ≥ medium",
      "actions_developer": ["action 1", "action 2"],
      "actions_business": ["action 1", "action 2"],
      "urgency": "high|medium|low",
      "related_domains": ["LLM", "Policy"],
      "breakthrough_potential": false
    },
    "media_links": {
      "youtube_channel": "",
      "youtube_video": ""
    }
  }]
}
```

---

## 📊 Completion Report

```json
{
  "batch": "1", "status": "completed",
  "output_file": "News/Batches/{DATE}/batch_1.json",
  "articles_created": 12, "articles_skipped_duplicate": 0,
  "topic_breakdown": { "ai_trends": 4, "tech_trends": 3, "thailand": 4, "global": 1 },
  "direct_fetch_success": 8, "aggregator_fallback_used": 4,
  "summary_word_count_check": "pass — all 100-150 words",
  "next_batch": "2"
}
```

---

# 📚 URL REGISTRY v3.0 — 80+ Sources

## BATCH 1 — Thai Sources (26 sources)

### Web

| # | key | source | url |
|---|---|---|---|
| 1 | Thai/Blognone | Blognone | https://www.blognone.com |
| 2 | Thai/Beartai | Beartai | https://www.beartai.com/news |
| 3 | Thai/Techsauce | Techsauce | https://techsauce.co |
| 4 | Thai/Thumbsup | Thumbsup | https://www.thumbsup.in.th |
| 5 | Thai/TechTalkThai | TechTalkThai | https://www.techtalkthai.com |
| 6 | Thai/BangkokBiz | Bangkok Biz AI | https://www.bangkokbiznews.com/category/tech/ai |
| 7 | Thai/Prachachat | Prachachat AI | https://www.prachachat.net/tag/ปัญญาประดิษฐ์ |
| 8 | Thai/Thairath | Thairath AI | https://www.thairath.co.th/tags/AI |
| 9 | Thai/Thaiware | Thaiware | https://news.thaiware.com |
| 10 | Thai/EnTechReview | EnTechReview | https://entechreview.com |
| 11 | Thai/ThaiPBS | Thai PBS Tech | https://www.thaipbs.or.th/news/technology |
| 12 | Thai/SpringNews | Spring News | https://www.springnews.co.th/digital-tech |
| 13 | Thai/INNNews | INN News Tech | https://www.innnews.co.th/category/news/tech |
| 14 | Thai/ThaiPR | ThaiPR IT | https://www.thaipr.net/it |
| 15 | Thai/TheStandard | The Standard Tech | https://thestandard.co/technology |
| 16 | Thai/Positioning | Positioning Mag | https://positioningmag.com/topics/technology |

### YouTube Thai

| # | key | channel | url |
|---|---|---|---|
| 17 | YT-Thai/BorntoDev | BorntoDev | https://www.youtube.com/@borntodev |
| 18 | YT-Thai/Sertis | Sertis Corp | https://www.youtube.com/@SertisOfficial |
| 19 | YT-Thai/Techsauce | Techsauce TV | https://www.youtube.com/@techsaucetv |
| 20 | YT-Thai/TechTalkThai | TechTalkThai TV | https://www.youtube.com/@TechTalkThaiTV |
| 21 | YT-Thai/Beartai | Beartai | https://www.youtube.com/@beartai |
| 22 | YT-Thai/Blognone | Blognone | https://www.youtube.com/@blognone |
| 23 | YT-Thai/SpringNews | Spring News Online | https://www.youtube.com/@springnewsonline |
| 24 | YT-Thai/NBT2HD | NBT2HD | https://www.youtube.com/@NBT2HDchannel |
| 25 | YT-Thai/AIWeekly | AI Weekly TH | https://www.youtube.com/@aiweeklyth |
| 26 | YT-Thai/DataScience | DataScience TH | https://www.youtube.com/@datascienceth |

---

## BATCH 2 — International Web (36 sources)

### AI News & Media

| # | key | source | url |
|---|---|---|---|
| 1 | Intl/TechCrunch | TechCrunch AI | https://techcrunch.com/category/artificial-intelligence |
| 2 | Intl/TheVerge | The Verge AI | https://www.theverge.com/ai-artificial-intelligence |
| 3 | Intl/VentureBeat | VentureBeat AI | https://venturebeat.com/category/ai |
| 4 | Intl/Wired | Wired AI | https://www.wired.com/tag/artificial-intelligence |
| 5 | Intl/ArsTechnica | Ars Technica AI | https://arstechnica.com/ai |
| 6 | Intl/MIT | MIT Tech Review | https://www.technologyreview.com/topic/artificial-intelligence |
| 7 | Intl/MarkTechPost | MarkTechPost | https://www.marktechpost.com |
| 8 | Intl/Reuters | Reuters AI | https://www.reuters.com/technology/artificial-intelligence |
| 9 | Intl/Bloomberg | Bloomberg Tech | https://www.bloomberg.com/technology |
| 10 | Intl/CNBC | CNBC Tech | https://www.cnbc.com/technology |
| 11 | Intl/Forbes | Forbes AI | https://www.forbes.com/ai |
| 12 | Intl/Fortune | Fortune Tech | https://fortune.com/section/tech |
| 13 | Intl/Axios | Axios AI | https://www.axios.com/technology/ai |
| 14 | Intl/TheAtlantic | The Atlantic Tech | https://www.theatlantic.com/technology |
| 15 | Intl/TheInformation | The Information | https://www.theinformation.com |
| 16 | Intl/Pandaily | Pandaily | https://pandaily.com |
| 17 | Intl/KrASIA | KrASIA | https://kr.asia |
| 18 | Intl/SCMP | SCMP Tech | https://www.scmp.com/technology |
| 19 | Intl/Nikkei | Nikkei Asia Tech | https://asia.nikkei.com/Business/Technology |
| 20 | Intl/TechInAsia | Tech in Asia | https://www.techinasia.com |

### AI Blogs & Digests

| # | key | source | url |
|---|---|---|---|
| 21 | Digest/OpenAI | OpenAI Blog | https://openai.com/news |
| 22 | Digest/Anthropic | Anthropic News | https://www.anthropic.com/news |
| 23 | Digest/Google | Google DeepMind | https://deepmind.google/discover/blog |
| 24 | Digest/Meta | Meta AI Blog | https://ai.meta.com/blog |
| 25 | Digest/HuggingFace | HuggingFace Blog | https://huggingface.co/blog |
| 26 | Digest/HackerNews | Hacker News AI | https://news.ycombinator.com/?q=AI |
| 27 | Digest/TheBatch | The Batch (DeepLearning.AI) | https://www.deeplearning.ai/the-batch |
| 28 | Digest/ImportAI | Import AI (Substack) | https://importai.substack.com |
| 29 | Digest/BuildFast | BuildFastWithAI | https://www.buildfastwithai.com/blogs |
| 30 | Digest/AINewsThompson | LifeArchitect AI | https://lifearchitect.ai/news |
| 31 | Digest/Mistral | Mistral AI Blog | https://mistral.ai/news |
| 32 | Digest/xAI | xAI Blog | https://x.ai/blog |
| 33 | Digest/Cohere | Cohere Blog | https://cohere.com/blog |
| 34 | Digest/Perplexity | Perplexity Blog | https://www.perplexity.ai/hub/blog |
| 35 | Digest/AISnakeoil | AI Snake Oil (Substack) | https://www.aisnakeoil.com |
| 36 | Digest/BenedictEvans | Benedict Evans | https://www.ben-evans.com |

---

## BATCH 3 — Research + YouTube International (20 sources)

### Research

| # | key | source | url |
|---|---|---|---|
| 1 | Research/ArXiv-AI | ArXiv cs.AI | https://arxiv.org/list/cs.AI/recent |
| 2 | Research/ArXiv-LG | ArXiv cs.LG | https://arxiv.org/list/cs.LG/recent |
| 3 | Research/ArXiv-CL | ArXiv cs.CL | https://arxiv.org/list/cs.CL/recent |
| 4 | Research/ArXiv-CV | ArXiv cs.CV | https://arxiv.org/list/cs.CV/recent |
| 5 | Research/PapersWithCode | Papers with Code | https://paperswithcode.com |
| 6 | Research/Semantic | Semantic Scholar | https://www.semanticscholar.org/topic/Artificial-Intelligence |
| 7 | Research/AIIndex | Stanford AI Index | https://aiindex.stanford.edu |

### YouTube International

| # | key | channel | url |
|---|---|---|---|
| 8 | YT-Intl/TwoMinutePapers | Two Minute Papers | https://www.youtube.com/@TwoMinutePapers |
| 9 | YT-Intl/Karpathy | Andrej Karpathy | https://www.youtube.com/@AndrejKarpathy |
| 10 | YT-Intl/Kilcher | Yannic Kilcher | https://www.youtube.com/@YannicKilcher |
| 11 | YT-Intl/AIExplained | AI Explained | https://www.youtube.com/@aiexplained-official |
| 12 | YT-Intl/MattWolfe | Matt Wolfe | https://www.youtube.com/@mreflow |
| 13 | YT-Intl/WesRoth | Wes Roth | https://www.youtube.com/@WesRoth |
| 14 | YT-Intl/MLStreetTalk | ML Street Talk | https://www.youtube.com/@MachineLearningStreetTalk |
| 15 | YT-Intl/DavidShapiro | David Shapiro | https://www.youtube.com/@DavidShapiroAutomator |
| 16 | YT-Intl/AIBreakdown | The AI Breakdown | https://www.youtube.com/@theaibreakdown |
| 17 | YT-Intl/ShipyardAI | The Shipyard AI | https://www.youtube.com/@theshipyardai |
| 18 | YT-Intl/DrBriefing | Dr. Briefing AI | https://www.youtube.com/@drbriefing |
| 19 | YT-Intl/KyleHill | Kyle Hill Science | https://www.youtube.com/@KyleHillScience |
| 20 | YT-Intl/SamWitteveen | Sam Witteveen AI | https://www.youtube.com/@samwitteveenai |
