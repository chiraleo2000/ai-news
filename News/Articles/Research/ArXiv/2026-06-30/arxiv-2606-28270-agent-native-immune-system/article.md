# Agent-Native Immune System: Architecture, Taxonomy, and Engineering

**แหล่งที่มา:** ArXiv cs.AI · [arXiv:2606.28270](https://arxiv.org/abs/2606.28270)
**วันที่เผยแพร่:** 29 มิถุนายน 2569
**หมวดหมู่:** ai-trends
**ผู้วิจัย:** Bo Shen, Lifeng Chang, Tianyuan Wei, Yunpeng Li, Feng Shi, Yichen Han, Peijie Gao, Shiyi Kuang, Xin Chang, Dehui Li

---

## สรุปภาษาไทย

เมื่อ AI Agent มีความสามารถมากขึ้น ระบบป้องกันภัยแบบเดิมที่ฝึกไว้ก่อน deploy ไม่เพียงพออีกต่อไป งานวิจัยนี้เสนอ ANIS (Agent-Native Immune System) ซึ่งเป็นสถาปัตยกรรมความปลอดภัยที่ฝังอยู่ภายใน reasoning loop ของ Agent โดยตรง ได้รับแรงบันดาลใจจากระบบภูมิคุ้มกันทางชีววิทยา โครงสร้างประกอบด้วย Immune Tower 6 ชั้น (L0-L5) ที่ป้องกันการโจมตีแบบ runtime เช่น memory poisoning, tool-chain manipulation และ multi-agent protocol attacks นอกจากนี้ยังมี Harness Triad ที่ทำหน้าที่ตรวจสอบตัวเองและเรียนรู้ภัยคุกคามใหม่ๆ อย่างต่อเนื่อง งานวิจัยนี้ยังแยกแยะความแตกต่างระหว่าง model alignment ซึ่งเป็นการวางค่านิยมในช่วงฝึก กับ agent immunity ซึ่งเป็นการป้องกันแบบ dynamic ขณะใช้งานจริง ซึ่งเป็นสองสิ่งที่ต่างกันและต้องการทั้งคู่

---

## ประเด็นสำคัญ

- AI agents ที่มี memory/tool-use เผชิญภัยคุกคามใหม่ที่ alignment ในช่วงฝึกป้องกันไม่ได้
- ANIS เป็น endogenous defense ฝังใน cognitive loop — ต่างจาก perimeter security
- Immune Tower 6 ชั้น ป้องกัน memory poisoning, tool manipulation, multi-agent attacks
- แยก alignment (static constitutional values) ออกจาก immunity (dynamic runtime enforcement)

## Tech Insights

**ความสำคัญ:** กำหนดกรอบแนวคิดใหม่สำหรับ AI security ในยุค agentic — สำคัญมากเมื่อ agents deploy จริงในองค์กร

**ระดับผลกระทบ:** สูง

---

*Fetched: 2026-06-30 | Pipeline: ai-news-master-v2.0*
