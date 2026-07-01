---
article_id: b3-research-tapered-language-models
schema_version: "2.0"
title: "Tapered Language Models"
title_th: "Tapered Language Models: การจัดสรร Capacity แบบ Depth-aware สำหรับโมเดลภาษา"
topic_group: ai-trends
category: AI-RESEARCH
source_url: https://arxiv.org/abs/2606.23670
published_at: "2026-06-22T17:56:25Z"
run_date: "2026-06-28"
batch: "3"
tags: [arxiv, research, LLM, architecture, efficiency]
language: th
urgency: medium
breakthrough_potential: false
---

# Tapered Language Models: การจัดสรร Capacity แบบ Depth-aware

**แหล่งที่มา:** [arXiv:2606.23670](https://arxiv.org/abs/2606.23670) | Mila/Montreal | 22 มิ.ย. 2026

## สรุปสั้น

งานวิจัยค้นพบว่าการจัดสรร Parameter Capacity มากขึ้นให้ Layer ต้นและน้อยลงให้ Layer ปลายของ LLM ช่วยปรับปรุง Perplexity และประสิทธิภาพ Benchmark โดยไม่เพิ่ม Parameter หรือ Compute

## สรุปงานวิจัย

ทีมวิจัยนำเสนอหลักการสถาปัตยกรรมใหม่สำหรับโมเดลภาษาชื่อว่า Tapered Language Models (TLMs) ที่ตั้งคำถามกับสมมติฐานพื้นฐานของการออกแบบ LLM สมัยใหม่ทุกตระกูล งานวิจัยพบว่า Layer ใน LLM มีส่วนสนับสนุนผลลัพธ์แบบไม่สม่ำเสมอ โดย Layer ปลายมักปรับแต่ง Residual Stream มากกว่าแปลงสภาพ ดังนั้นควรจัดสรร Parameter Capacity ให้สะท้อนความไม่สมมาตรนี้ การทดสอบบนสถาปัตยกรรมสี่แบบ (Transformer, Gated Attention, Hope-attention, Titans) และสามขนาดโมเดล ยืนยันว่าการ Taper MLP Width ด้วย Cosine Schedule ช่วยปรับปรุง Perplexity และ Downstream Benchmark โดยไม่มีค่าใช้จ่ายเพิ่มเติม

## ผลกระทบ

Tapered LM เสนอ "Free Lever" ในการออกแบบ LLM ที่ถูกมองข้ามมานาน ให้ประสิทธิภาพดีขึ้นโดยไม่มีค่าใช้จ่ายเพิ่มเติม
