# Patch the Planet: a Daybreak initiative to support open source maintainers

**Source:** OpenAI  
**URL:** https://openai.com/index/patch-the-planet/  
**Published:** June 22, 2026  
**Category:** AI-SAFETY  
**Topic Group:** ai-trends  
**Batch:** 2  

---

## Summary

OpenAI launches Patch the Planet, a Daybreak initiative with Trail of Bits, HackerOne, and Calif to help open-source maintainers find and fix vulnerabilities using AI-assisted security research paired with expert human review.

---

## Body

OpenAI has introduced Patch the Planet, a Daybreak initiative built with Trail of Bits to help open-source maintainers strengthen critical software the world depends on. Pairing AI-assisted security research (GPT-5.5-Cyber, Codex Security) with expert human review, the program not only identifies vulnerabilities but helps develop and deploy patches.

Initial participants include cURL, NATS Server, pyca/cryptography, Sigstore, aiohttp, Go, freenginx, Python, and python.org. In the initial sprint, Trail of Bits engineers working full-time found:

- **Linux Kernel:** 8 pointer information leak PoCs and 24 local privilege escalation exploits auto-generated
- **OpenBSD:** A 23-year-old use-after-free in kernel System V semaphores
- **FreeBSD:** 34 confirmed vulnerabilities, 7 local privilege escalation PoCs
- **dnsmasq:** 4 of 6 CVEs independently found before disclosure
- **HTTP/2 Bomb:** DoS affecting NGINX, Apache, IIS, Pingora — 880,000+ websites affected
- **Chrome V8:** 5 exploitable vulnerabilities found and reported
- **Safari WebKit:** 10+ exploitable vulnerabilities found in one week
- **Firefox:** WebAssembly CVE-2026-8390 patched 2 days before Pwn2Own Berlin

Key innovation: every finding is manually reviewed by Trail of Bits security engineers before reaching maintainers, preventing false-positive overload. The program also builds reusable fuzzing harnesses, CVE-variant pipelines, and differential testing infrastructure.

GPT-5.5-Cyber reaches 85.6% on CyberGym benchmark (vs 81.8% for GPT-5.5), 39.5% on ExploitGym, and 69.8% on SEC-bench Pro.

---

## Tech Insights

**Impact:** OpenAI deploys frontier AI models to discover and patch critical vulnerabilities in foundational open-source software at unprecedented scale and speed.

**Urgency:** HIGH | **Breakthrough Potential:** YES

**Actions for Developers:**
- Apply to join Patch the Planet at trailofbits.com/patch-the-planet
- Explore Codex Security plugin for automated vulnerability scanning and patching
- Review GPT-5.5-Cyber benchmark results when evaluating AI security tools

**Actions for Business:**
- Security teams: evaluate Daybreak Cyber Partner Program for enterprise vulnerability management
- Pair model-assisted discovery with human expert review to reduce false-positive burden
- Monitor coordinated disclosure timelines for affected open-source dependencies

**Related Domains:** AI-safety, cybersecurity, open-source, LLM, agentic-AI
