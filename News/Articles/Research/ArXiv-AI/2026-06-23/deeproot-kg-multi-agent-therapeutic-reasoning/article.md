# DeepRoot: A KG-Coordinated Multi-Agent System for Therapeutic Reasoning over Historical Medical Texts

**Source:** ArXiv cs.AI | **Published:** 2026-06-14 | **ArXiv ID:** 2606.15931
**Authors:** Zijian Carl Ma, Sean J. Wang, Sijbren Kramer, Li Erran Li
**URL:** https://arxiv.org/abs/2606.15931
**Venue:** ICML 2026 GenBio; ACM CAIS 2026 Workshop
**Category:** AI-RESEARCH | **Batch:** 3 | **Run Date:** 2026-06-23

---

## Summary

DeepRoot is an ICML 2026 paper presenting a multi-agent LLM system that combines knowledge graph grounding with LLM reasoning to mine drug discovery leads from ancient medical texts, reducing hallucination from 87% to 7-10% while achieving 47.6% recall at rank 20.

## Key Findings

Historical medical archives contain untapped drug discovery potential but pre-ontological prose prevents use in modern biomedical pipelines. DeepRoot addresses this with a multi-agent LLM system that jointly builds and queries a verified knowledge graph, showing that grounding and reasoning are separable axes. Applied to the Shen Nong Ben Cao Jing, DeepRoot recovers 10 of 21 compound-disease pairs at R@20 (47.6%) versus 4.8% for a raw corpus LLM and 2.4% random. Tool-using LLMs hallucinate evidence on 87% of claims versus 7-10% for DeepRoot. Graph-only inference hallucinates 0% but ranks lowest on reasoning coherence — only DeepRoot KG+LLM wins on both axes.

## Abstract

Historical medical archives hold immense potential for drug discovery. No existing LLM agent system can convert such text into verifiable drug-discovery leads at scale. DeepRoot jointly builds and utilizes a verified knowledge graph. Applied to Shen Nong Ben Cao Jing: R@20 of 47.6% vs 4.8% (raw corpus LLM) vs ~2.4% (random). Tool-using LLMs hallucinate on 87% of claims vs 7-10% for DeepRoot. Accepted at ICML 2026 GenBio and ACM CAIS 2026 Workshop.

## Tech Insights

**Impact:** KG-grounded multi-agent system separates grounding and reasoning axes to reduce LLM hallucination 10x in drug discovery, accepted at ICML 2026.

**Urgency:** MEDIUM | **Breakthrough Potential:** Yes

**Developer Actions:**
- Apply KG-coordinated multi-agent architecture pattern to other knowledge-intensive domains beyond medical texts
- Use the grounding/reasoning axis separation as a design principle for reducing hallucination in production agents
- Explore DeepRoot approach for mining domain-specific corpora (legal documents, technical standards, patents)

**Business Actions:**
- Evaluate for pharmaceutical R&D pipelines needing to extract leads from historical or legacy documents
- Consider for compliance and legal teams needing high-accuracy extraction from non-structured historical archives
- Track ICML 2026 GenBio track for follow-on work and potential partnerships

**Related Domains:** Multi-agent AI, Knowledge Graphs, Drug Discovery, Medical AI, Hallucination Reduction
