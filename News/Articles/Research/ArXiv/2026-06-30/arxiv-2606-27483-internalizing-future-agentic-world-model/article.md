# Internalizing the Future: A Unified Agentic Training Paradigm for World Model Planning

**แหล่งที่มา:** ArXiv cs.AI · [arXiv:2606.27483](https://arxiv.org/abs/2606.27483)
**วันที่เผยแพร่:** 29 มิถุนายน 2569
**หมวดหมู่:** ai-trends
**ผู้วิจัย:** Xuan Zhang, Zhijian Zhou, Lingfeng Qiao, Yulei Qin, Ke Li, Xing Sun, Xiaoyu Tan, Chao Qu, Yuan Qi

---

## สรุปภาษาไทย

งานวิจัยนี้นำเสนอแนวทางใหม่สำหรับการฝึก AI Agent ที่สามารถวางแผนระยะยาวได้ดีขึ้น โดยการสร้าง World Model ภายในให้กับ LLM แทนที่จะให้โมเดลตอบสนองแบบ reactive เท่านั้น ทีมวิจัยพัฒนาไปป์ไลน์ฝึก 3 ขั้นตอน ได้แก่ (1) WM-AMT: ฝึกความสามารถในการทำนายสถานะอนาคตในระดับ latent (2) FE-SFT: จัดโครงสร้างความสามารถนั้นให้ใช้งานได้จริง และ (3) FC-RL: เสริมความแม่นยำของการจำลองด้วย Reinforcement Learning ผลลัพธ์แสดงให้เห็นว่า Agent ที่ผ่านการฝึกด้วยวิธีนี้สามารถ "คิดล่วงหน้า" ก่อนตัดสินใจได้เหมือนมนุษย์ และทำคะแนนสูงกว่า baseline ในงาน search และ mathematical reasoning สิ่งสำคัญที่ค้นพบคือต้องฝึกความสามารถก่อน format เพื่อให้ได้ foresight ที่แท้จริง ไม่ใช่แค่การ mimic รูปแบบภายนอก

---

## ประเด็นสำคัญ

- LLM agents ยังคงเป็น reactive และขาด world model ภายในสำหรับการวางแผน
- เสนอไปป์ไลน์ฝึก 3 ขั้น: WM-AMT → FE-SFT → FC-RL
- ค้นพบ format-capability gap: ฝึก format ก่อนโดยไม่มี capability จะได้แค่ mimicry
- ผลดีกว่า baseline ในงาน search และ mathematical reasoning

## Tech Insights

**ความสำคัญ:** แก้ปัญหาพื้นฐานของ LLM agents ที่ขาด internal planning — critical สำหรับ agentic AI รุ่นต่อไป

**ระดับผลกระทบ:** สูง

---

*Fetched: 2026-06-30 | Pipeline: ai-news-master-v2.0*
