# STARE: Surprisal-Guided Token-Level Advantage Reweighting for Policy Entropy Stability

**Source:** ArXiv cs.LG/cs.AI (Research)
**Date:** 2026-06-22
**Link:** [direct](https://arxiv.org/abs/2606.19236)
**Category:** AI Research | Batch: 3

---

## Summary

Reinforcement Learning with Verifiable Rewards (RLVR) methods like GRPO have become the dominant post-training approach for improving LLM reasoning, but frequently suffer from policy entropy collapse during training—causing degraded output diversity. STARE (Surprisal-guided Token-level Advantage Reweighting for policy Entropy stability) addresses this through a first-order gradient analysis of GRPO's token-level entropy dynamics, identifying a key 'advantage-surprisal four-quadrant structure' where per-token entropy variation decomposes into trajectory-level advantage times an entropy sensitivity function. The method identifies entropy-critical token subsets via batch-internal surprisal quantiles, selectively reweights their effective advantages, and adds a closed-loop target-entropy gate. Evaluated on 1.5B to 32B models across Short CoT, Long CoT, and Multi-Turn Tool Use tasks, STARE outperforms DAPO by 4-8% on AIME24/AIME25 while sustaining stable training for thousands of steps. Code is open-sourced at github.com/hp-luo/STARE.

---

## Tech Insights

**Impact:** STARE provides a principled solution to LLM RL training instability that has blocked wider adoption of RLVR methods. The 4-8% accuracy gain on math reasoning benchmarks is significant, and the technique generalizes across model sizes and task types including multi-turn tool use—directly relevant to building production agentic AI systems.
**Urgency:** high

### Developer/Engineer Actions
- Integrate STARE's surprisal-based token reweighting into existing GRPO/RLVR training pipelines to prevent entropy collapse
- Test STARE on multi-turn agentic task training; open-source code available at github.com/hp-luo/STARE

### Business/Organization Actions
- Prioritize STARE-enhanced post-training for math reasoning and complex problem-solving product features to gain accuracy edge
- Evaluate STARE for internal LLM fine-tuning to reduce training instability costs and failed training runs

**Related Domains:** LLM post-training, reinforcement learning, AI reasoning, model training stability

---

## Source
- **Source:** [arXiv:2606.19236](https://arxiv.org/abs/2606.19236)
- **Publication:** https://arxiv.org/list/cs.AI/recent
- **Fetch priority:** 1_direct

---
*AI-News Pipeline v1.0 | run: 2026-06-22 | target: 2026-06-22 | batch: 3*
