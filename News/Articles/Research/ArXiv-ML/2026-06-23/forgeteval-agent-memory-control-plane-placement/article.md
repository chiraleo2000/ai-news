# Control-Plane Placement Shapes Forgetting: An Architectural Study of Agent Memory Across Thirteen System Configurations

**Source:** ArXiv cs.LG | **Published:** 2026-06-16 (revised) | **ArXiv ID:** 2606.15903
**Authors:** Dongxu Yang
**URL:** https://arxiv.org/abs/2606.15903
**Category:** AI-RESEARCH | **Batch:** 3 | **Run Date:** 2026-06-23

---

## Summary

ForgetEval reveals that where the LLM sits in an agent memory pipeline determines which forgetting failure modes can be recovered, with mutation-time hooks achieving 91.7-93.2% overall accuracy versus near-zero for deterministic-only approaches.

## Key Findings

Agent memory systems are extensively benchmarked for recall but almost never for the control plane that mutates stored facts (supersede, release, purge). Comparing 13 system configurations across 385 adversarial test cases reveals three distinct placement regimes: deterministic primitives handle lexical/temporal categories but fail canonicalization (0-5%); inscribe-time LLM achieves 100% on canonicalization but cannot handle intent-aware deletion; a mutation-time hook recovers intent-aware deletion (78-85%) and achieves 91.7-93.2% overall at $0.17 per 385 cases. Key insight: production agent failures are predominantly forgetting failures, yet all existing benchmarks measure only recall.

## Abstract

Where an LLM sits in an agent memory pipeline shapes which forgetting failure modes the system recovers. Comparing 13 system configurations on a 385-case adversarial surface: deterministic primitives suffice for lexical/temporal but fail canonicalization; inscribe-time LLM recovers canonicalization (100%) but cannot help intent-aware deletion (0%); mutation-time hook achieves 91.7-93.2% overall at $0.17 per 385-case run. ForgetEval (1000-case templated + 385 adversarial) released under MIT.

**Code:** https://github.com/deeplethe/lethe

## Tech Insights

**Impact:** First systematic study separating recall vs. control-plane benchmarking for agent memory, showing mutation-time LLM hooks are essential for production-grade memory management.

**Urgency:** HIGH | **Breakthrough Potential:** Yes

**Developer Actions:**
- Add mutation-time LLM hook to agent memory pipelines to handle intent-aware deletion edge cases
- Use ForgetEval benchmark suite to audit existing memory implementations before production deployment
- Adopt the Adapter Protocol (130 lines) to plug heterogeneous memory stores into ForgetEval

**Business Actions:**
- Prioritize agent memory control-plane design in product roadmaps
- Budget for mutation-time LLM calls ($0.17/385 cases is low cost relative to production failures)
- Evaluate if current agentic products have adequate memory supersede/purge policies

**Related Domains:** LLM Agents, Agent Memory, AI Infrastructure, Benchmarks
