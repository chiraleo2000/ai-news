# AI News — public kit + private GraphRAG

Mirrors the police news split:

| Role | Folder | GitHub |
| --- | --- | --- |
| Public Pages kit | `C:\Users\AI-PC-DEV\Documents\ai-news` | https://github.com/chiraleo2000/ai-news |
| Private GraphRAG | `C:\Users\AI-PC-DEV\Documents\ai-news-private` | local (vault + build) |

Live: https://chiraleo2000.github.io/ai-news/

## Pages tabs

| Tab | Hash | What |
| --- | --- | --- |
| รายการข่าว | `#/news` | 4-column daily digest |
| ข้อมูลกราฟ | `#/brain` | GraphRAG force graph + ask |
| เชื่อมต่อ / MCP | `#/connect` | LLM / MCP tunnel endpoints |

## Rebuild graph (private)

```powershell
Set-Location C:\Users\AI-PC-DEV\Documents\ai-news-private
Copy-Item ..\ai-news\data\*_news.json .\data\ -Force
node ops/build-ai-news-graph.js
.\ops\sync-to-public.ps1
```

## Local MCP

```powershell
Set-Location C:\Users\AI-PC-DEV\Documents\ai-news
node mcp/server.mjs
# optional: .\ops\wake-tunnel.ps1
```
