# MAGE-RAG: Multigranular Adaptive Graph Evidence for Agentic Multimodal RAG in Long-Document QA

**Source:** ArXiv cs.AI | **Published:** 2026-06-14 | **ArXiv ID:** 2606.15906
**Authors:** Yilong Zuo, Xunkai Li, Jing Yuan, Qiangqiang Dai, Hongchao Qin, Ronghua Li
**URL:** https://arxiv.org/abs/2606.15906
**Category:** AI-RESEARCH | **Batch:** 3 | **Run Date:** 2026-06-23

---

## Summary

MAGE-RAG introduces a graph-based agentic RAG framework that adaptively constructs evidence subgraphs across multiple granularities for long multimodal documents, achieving 52.75% accuracy on LongDocURL and 53.26% on MMLongBench-Doc.

## Key Findings

Long-document multimodal question answering requires integrating evidence from text, tables, images, charts, and complex layouts scattered across lengthy PDFs. MAGE-RAG solves this with an offline evidence graph (page + element nodes encoding containment, reading order, layout adjacency, section hierarchy, and semantic-neighbor relations) and an online evidence controller that iteratively activates, searches, and prunes evidence under explicit budgets. Benchmarks show MAGE-RAG outperforms Direct MLLM, Text RAG, and Page-level Visual RAG approaches on both LongDocURL and MMLongBench-Doc.

## Abstract

Long-document multimodal QA requires locating sparse evidence in long PDFs and integrating clues from text, tables, images, charts, and complex layouts. Existing RAG methods rely on fixed Top-k retrieval. MAGE-RAG builds an offline evidence graph and online evidence controller for adaptive subgraph construction. Results: 52.75 accuracy on LongDocURL, 53.26 accuracy / 51.19 F1 on MMLongBench-Doc.

**Code:** https://github.com/laonuo2004/MAGE-RAG

## Tech Insights

**Impact:** Graph-based agentic RAG that dynamically constructs evidence subgraphs sets new benchmarks for long multimodal document understanding.

**Urgency:** MEDIUM | **Breakthrough Potential:** Yes

**Developer Actions:**
- Replace static Top-k RAG with graph-based evidence subgraph construction for document QA
- Use offline graph pre-build + online query-time pruning for cost-effective multimodal retrieval
- Test on enterprise document workflows (legal, financial, medical PDF corpora)

**Business Actions:**
- Evaluate for document intelligence workflows requiring multimodal understanding across long reports
- Consider for insurance, legal, and research document Q&A systems needing high accuracy
- Benchmark against current PDF-RAG solutions to measure accuracy improvement potential

**Related Domains:** RAG, Multimodal AI, LLM, Document Intelligence, Knowledge Graphs
