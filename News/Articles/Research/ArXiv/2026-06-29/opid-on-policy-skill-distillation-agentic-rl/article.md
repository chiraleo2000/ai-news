# OPID: On-Policy Skill Distillation for Agentic Reinforcement Learning

**แหล่งข่าว:** ArXiv cs.CL (Research)
**วันที่:** 2026-06-29
**ลิ้งค์:** [direct](https://arxiv.org/abs/2606.26790)
**หมวดหมู่:** งานวิจัย AI | Batch: 3

---

## สรุปข่าว

การฝึก agent ด้วย reinforcement learning มักประสบปัญหา sample efficiency ต่ำและ reward signal ที่ sparse ทำให้ agent เรียนรู้ได้ช้า OPID (On-Policy Skill Distillation) เสนอแนวทางแก้ไขโดยการดึง skill knowledge จาก expert หรือ teacher policy มาช่วยนำทาง agent ในระหว่างการฝึก ความโดดเด่นของ OPID คือการทำ distillation แบบ on-policy ซึ่งหมายความว่า skill ที่ดึงมาจะตรงกับ distribution ของ state ที่ agent กำลังพบอยู่จริง แทนที่จะเป็น off-policy skill จาก static dataset การออกแบบนี้ช่วยลดปัญหา distribution shift ที่มักเกิดขึ้นใน imitation learning แบบเดิม ผลการทดลองบน agentic task หลากหลายแสดงให้เห็นว่า OPID เร่งการเรียนรู้และปรับปรุง final performance เมื่อเทียบกับ baseline RL ล้วน

---

## Tech Insights

**ผลกระทบ:** OPID เร่งการพัฒนา agent ที่มีทักษะสูงขึ้นด้วย sample ที่น้อยลง ซึ่งลดทั้งเวลาและ compute ที่ต้องใช้ในการฝึก agentic system
**ระดับความสำคัญ:** medium

### นักพัฒนา/Engineer ควรทำอะไร
- ทดลอง on-policy skill distillation เพื่อ bootstrap การฝึก RL agent สำหรับ domain เฉพาะทาง
- ผสม OPID กับ RLHF หรือ GRPO pipeline เพื่อเร่งการ convergence ของ LLM agent

### ธุรกิจ/องค์กร ควรทำอะไร
- ลงทุนสร้าง expert demonstration data สำหรับ domain สำคัญเพื่อใช้ใน skill distillation
- ประเมิน ROI ของการใช้ skill distillation ในการฝึก agent เทียบกับ pure RL ที่ใช้ compute มากกว่า

**สาขาที่เกี่ยวข้อง:** Reinforcement Learning, Agents, LLM, Skill Learning, RLHF

---

## แหล่งที่มา
- **Source:** [direct](https://arxiv.org/abs/2606.26790)
- **สำนักข่าว:** https://arxiv.org/list/cs.CL/recent
- **Fetch priority:** 1_direct

---
*AI-News Pipeline v2.0 | run: 2026-06-29 | target: 2026-06-29 | batch: 3*
