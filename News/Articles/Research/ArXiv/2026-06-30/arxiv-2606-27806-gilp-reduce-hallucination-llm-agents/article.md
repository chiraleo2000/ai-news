# Grounded Iterative Language Planning: How Parameterized World Models Reduce Hallucination Propagation in LLM Agents

**แหล่งที่มา:** ArXiv cs.AI · [arXiv:2606.27806](https://arxiv.org/abs/2606.27806)
**วันที่เผยแพร่:** 29 มิถุนายน 2569
**หมวดหมู่:** ai-trends
**ผู้วิจัย:** Xinyuan Song, Zekun Cai

---

## สรุปภาษาไทย

การ hallucinate ของ LLM Agent เป็นปัญหาสำคัญที่ทำให้การวางแผนผิดพลาด งานวิจัยนี้แนะนำ GILP (Grounded Iterative Language Planning) วิธีการที่รวม Parameterized World Model ขนาดเล็กเข้ากับ LLM ขนาดใหญ่ โมเดลขนาดเล็กทำหน้าที่ทำนาย state transitions ที่ถูกต้องตามกฎ ขณะที่ LLM ร่างแผนงาน จากนั้น consistency gate จะตรวจสอบว่าแผนของ LLM สอดคล้องกับการทำนายของโมเดลเล็กหรือไม่ ถ้าไม่สอดคล้องจะส่งกลับให้ LLM แก้ไข ผลการทดสอบบน GPT-4o-mini แสดงให้เห็นว่า GILP ลด hallucinated-state rate จาก 0.176 เหลือเพียง 0.035 ลดลงถึง 80% ขณะที่เพิ่ม success rate จาก 0.668 เป็น 0.838 โดยใช้ API calls เพิ่มขึ้นเพียง 22% แสดงให้เห็นว่าการใช้ symbolic grounding ร่วมกับ LLM แก้ปัญหา hallucination ได้อย่างมีประสิทธิภาพสูง

---

## ประเด็นสำคัญ

- GILP ใช้ parameterized world model เล็กๆ เป็น "ground truth checker" ให้ LLM
- Consistency gate ตรวจจับและบังคับให้ LLM แก้ไข hallucinated actions
- ลด hallucinated-state rate 80%: จาก 0.176 → 0.035 บน GPT-4o-mini
- เพิ่ม success rate จาก 0.668 → 0.838 โดยเพิ่ม API calls เพียง 22%

## Tech Insights

**ความสำคัญ:** แนวทาง hybrid ที่ practical มาก — ใช้โมเดลเล็กเป็น symbolic anchor ให้ LLM ใหญ่ โดยไม่ต้องเปลี่ยนโมเดลหลัก

**ระดับผลกระทบ:** สูง

---

*Fetched: 2026-06-30 | Pipeline: ai-news-master-v2.0*
