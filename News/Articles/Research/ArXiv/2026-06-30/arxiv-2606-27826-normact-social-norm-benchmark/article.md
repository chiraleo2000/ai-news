# NormAct: A Benchmark for Hidden Social Norm Compliance in Embodied Planning

**แหล่งที่มา:** ArXiv cs.AI · [arXiv:2606.27826](https://arxiv.org/abs/2606.27826)
**วันที่เผยแพร่:** 29 มิถุนายน 2569
**หมวดหมู่:** ai-trends
**ผู้วิจัย:** Shiyun Zhao, Xinwei Song, Tianyu Guo, Xiaomeng Gao, Mingyuan Liu, Xu Han, Yuanyuan Zhang, Zhenliang Zhang, Xue Feng, Bo Dai

---

## สรุปภาษาไทย

งานวิจัยนี้เปิดเผยจุดอ่อนสำคัญของ LLM ชั้นนำ: การไม่สามารถปฏิบัติตามบรรทัดฐานทางสังคมที่ซ่อนอยู่ได้ NormAct เป็น benchmark ที่ทดสอบ Embodied AI Agent ว่าสามารถทำงานได้ตามเป้าหมายพร้อมกับปฏิบัติตามกฎสังคมที่ไม่ได้บอกไว้อย่างตรงๆ ผลการทดสอบกับ GPT-5.4, Claude Opus 4.7 และ Gemini 3 Pro พบว่าโมเดลสามารถทำเป้าหมายหลักสำเร็จได้ 67.3% แต่ปฏิบัติตามบรรทัดฐานสังคมที่ซ่อนอยู่ได้เพียง 26.4% เท่านั้น ปัญหาหลักไม่ได้อยู่ที่ความรู้เรื่องสังคม แต่เป็นเรื่องของการ activate ความรู้นั้นในบริบทที่เหมาะสม ทีมวิจัยเสนอ NormPerceptor ซึ่งสร้าง cue เกี่ยวกับบรรทัดฐานก่อนวางแผน ช่วยเพิ่ม Task Success จาก 24.2% เป็น 46.7% ผลลัพธ์นี้มีนัยสำคัญต่อการ deploy AI Agent ในสภาพแวดล้อมจริง

---

## ประเด็นสำคัญ

- GPT-5.4, Claude Opus 4.7, Gemini 3 Pro ทำเป้าหมายสำเร็จ 67.3% แต่ปฏิบัติตาม hidden norms เพียง 26.4%
- ปัญหาไม่ใช่การขาดความรู้สังคม แต่เป็นการ activate ความรู้ในบริบทที่ถูกต้อง
- NormPerceptor ช่วยเพิ่ม Task Success จาก 24.2% → 46.7%
- มีนัยสำคัญต่อการ deploy AI agents ในสภาพแวดล้อมที่มีปฏิสัมพันธ์กับมนุษย์

## Tech Insights

**ความสำคัญ:** ชี้จุดบอดสำคัญของ frontier models ทั้งหมด — ความสามารถด้าน social intelligence ยังห่างไกลจากมนุษย์มาก

**ระดับผลกระทบ:** สูง

---

*Fetched: 2026-06-30 | Pipeline: ai-news-master-v2.0*
