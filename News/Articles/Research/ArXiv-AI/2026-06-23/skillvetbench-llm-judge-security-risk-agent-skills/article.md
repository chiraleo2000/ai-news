# SkillVetBench: LLM-as-Judge for Multi-Dimensional Security Risk Evaluation in Open-Source LLM Agent Skills

**Source:** ArXiv cs.AI | **Published:** 2026-06-14 | **ArXiv ID:** 2606.15899
**Authors:** Ismail Hossain, Sai Puppala, Md Jahangir Alam, Tanzim Ahad, Sajedul Talukder
**URL:** https://arxiv.org/abs/2606.15899
**Category:** AI-RESEARCH | **Batch:** 3 | **Run Date:** 2026-06-23

---

## Summary

SkillVetBench introduces SARS (Skill Agentic Risk Score), a five-dimensional security metric with LLM-as-Judge achieving zero false negatives on 78 confirmed-malicious agent skills, while conventional static scanners miss up to 100% of instruction-layer threats.

## Key Findings

Open-source LLM agent skills remain largely unvetted for security. Existing code-layer scanners are blind to instruction-layer risks like prompt injection and memory poisoning. SkillVetBench presents SARS — a five-dimensional agentic risk score using CVSS v4.0 — with a live Hugging Face leaderboard. Zero false negatives across 78 malicious skills, zero false positives across 22 benign controls; SKILLSIEVE still misses 15%. For memory poisoning attacks, conventional tools detect 0 of 9 cases. Detection rates vary from 35-95% across four LLM evaluators, motivating ensemble scoring.

## Abstract

Open-source LLM agent ecosystems are growing rapidly, yet the security of community-contributed skills remains largely unvetted. Existing scanners operate at the code layer and are structurally blind to instruction-layer and multi-agent risk. SKILLVETBENCH is a live public leaderboard on Hugging Face using LLM-as-Judge. SARS (Skill Agentic Risk Score) is a five-dimensional agentic-risk metric. Zero false negatives across 78 confirmed-malicious skills and zero false positives across 22 benign controls. For Prompt Injection and Memory Poisoning, conventional tools miss 89-100% of threats.

## Tech Insights

**Impact:** LLM-as-Judge for agent skill security vetting eliminates false negatives that plague all static code-layer scanners.

**Urgency:** HIGH | **Breakthrough Potential:** Yes

**Developer Actions:**
- Integrate SkillVetBench evaluation before publishing agent skills to open-source marketplaces
- Use SARS score as mandatory security gate in CI/CD pipelines for agentic AI applications
- Implement ensemble LLM evaluation to maximize detection across prompt injection and memory poisoning attack types

**Business Actions:**
- Audit all currently deployed open-source LLM agent skills against SARS criteria
- Establish mandatory security vetting policy for any third-party agent skills before production use
- Monitor the SkillVetBench Hugging Face leaderboard for emerging threat categories

**Related Domains:** AI Security, LLM Agents, Prompt Injection, AI Safety, Open Source
