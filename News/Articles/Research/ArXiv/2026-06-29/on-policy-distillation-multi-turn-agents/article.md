# On-Policy Distillation with Curriculum Turn-level Guidance for Multi-turn Agents

**แหล่งข่าว:** ArXiv cs.LG (Research)
**วันที่:** 2026-06-29
**ลิ้งค์:** [direct](https://arxiv.org/abs/2606.15912)
**หมวดหมู่:** งานวิจัย AI | Batch: 3

---

## สรุปข่าว

การฝึก LLM agent ในสถานการณ์แบบ multi-turn นั้นเป็นความท้าทายสำคัญ เนื่องจาก agent ต้องตัดสินใจให้ถูกต้องในทุก turn ของการสนทนา งานวิจัยนี้เสนอแนวทาง On-Policy Distillation ที่ใช้ Curriculum Turn-level Guidance เป็นสัญญาณแนะนำในการฝึก โดย agent นักเรียนจะได้รับคำแนะนำจาก teacher model ในระดับ turn แทนที่จะเป็นระดับ trajectory ทั้งหมด Curriculum ถูกออกแบบให้เรียนรู้จาก turn ที่ง่ายไปยากอย่างค่อยเป็นค่อยไป ส่งผลให้ agent สามารถเรียนรู้การตัดสินใจได้เร็วขึ้นและมีประสิทธิภาพมากขึ้น ผลการทดลองแสดงให้เห็นการปรับปรุงที่มีนัยสำคัญบน benchmark มาตรฐานสำหรับ agentic task แนวทางนี้มีความสำคัญสำหรับการพัฒนา AI agent ในงานที่ต้องการการโต้ตอบหลายรอบ เช่น customer service หรือ coding assistant

---

## Tech Insights

**ผลกระทบ:** วิธีการฝึก agent ใหม่นี้ช่วยลดต้นทุนการ training และเพิ่มคุณภาพของ multi-turn agent โดยไม่จำเป็นต้องมี reward model ขนาดใหญ่
**ระดับความสำคัญ:** medium

### นักพัฒนา/Engineer ควรทำอะไร
- นำ curriculum-based distillation มาประยุกต์กับการฝึก coding agent หรือ customer service agent
- ทดลองใช้ turn-level guidance แทน trajectory-level reward ในระบบ RLHF ที่มีอยู่

### ธุรกิจ/องค์กร ควรทำอะไร
- ประเมินต้นทุนการฝึก multi-turn agent ด้วยแนวทางนี้เทียบกับ RLHF แบบเดิม
- วางแผนนำ agent ที่ฝึกด้วย on-policy distillation มาใช้ใน chatbot สำหรับลูกค้า

**สาขาที่เกี่ยวข้อง:** LLM, Agents, Reinforcement Learning, Distillation

---

## แหล่งที่มา
- **Source:** [direct](https://arxiv.org/abs/2606.15912)
- **สำนักข่าว:** https://arxiv.org/list/cs.LG/recent
- **Fetch priority:** 1_direct

---
*AI-News Pipeline v2.0 | run: 2026-06-29 | target: 2026-06-29 | batch: 3*
