# Green SARC: Predictive Cost and Carbon Governance for Agentic AI Systems

**Source:** ArXiv cs.AI | **Published:** 2026-06-14 | **ArXiv ID:** 2606.15954
**Authors:** Gaston Besanson
**URL:** https://arxiv.org/abs/2606.15954
**Category:** AI-RESEARCH | **Batch:** 3 | **Run Date:** 2026-06-23

---

## Summary

Green SARC proposes an architecture-level governance framework that enforces financial and carbon budgets inside the agentic AI loop before execution, achieving 47-55% token/cost/carbon savings with zero budget breaches.

## Key Findings

Agentic AI systems that act through tools and sub-agents create unpredictable financial and environmental costs that current dashboards only catch after the fact. Green SARC applies a governance-by-architecture (SARC) framework with four enforcement sites embedded directly in the agent loop for FinOps and GreenOps. The system demonstrates that the 'State Snowball' cost growth is quadratic (Θ(n²)) in loop depth. An architectural gate achieves 0% budget breach rate versus 91.5% for a soft Lagrangian penalty, while delivering 47-55% end-to-end token/USD/carbon savings. The open-source library is dependency-free and ships with full reproducibility scripts.

## Abstract

Agentic AI systems act through tools and sub-agents, yet the controls meant to bound their financial and environmental cost still sit on dashboards evaluated beside or after execution. Green SARC applies the SARC governance-by-architecture framework with four enforcement sites in the agent loop for FinOps and GreenOps. The unconstrained 'State Snowball' is Θ(n²) in loop depth on 3,000 real multi-step plans. A soft Lagrangian penalty breaches budget on 91.5% of seeds; the architectural gate breaches 0%. End-to-end token/USD/carbon savings of 47-55% are delivered.

**Code:** https://github.com/besanson/Greensarc

## Tech Insights

**Impact:** First architectural governance framework to enforce financial and carbon budgets inside agentic AI loops with provably zero breach rate.

**Urgency:** HIGH | **Breakthrough Potential:** Yes

**Developer Actions:**
- Integrate SARC gate as middleware in agent orchestration frameworks (LangGraph, AutoGen)
- Use split-conformal calibration for token budget prediction instead of naive Normal distribution
- Replace soft Lagrangian penalties with hard architectural gates for cost-critical deployments

**Business Actions:**
- Adopt Green SARC for compliance with emerging AI carbon reporting regulations
- Use for FinOps enforcement in production agentic systems to cap runaway API costs
- Evaluate open-source library before next agentic AI deployment rollout

**Related Domains:** Agentic AI, LLM, FinOps, Sustainability, AI Governance
