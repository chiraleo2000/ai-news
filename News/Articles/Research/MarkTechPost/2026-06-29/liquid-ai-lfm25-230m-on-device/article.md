# Liquid AI Ships LFM2.5-230M with llama.cpp, MLX, vLLM, SGLang, and ONNX Support for On-Device Inference

**แหล่งข่าว:** MarkTechPost (Research)
**วันที่:** 2026-06-29
**ลิ้งค์:** [direct](https://www.marktechpost.com/2026/06/27/liquid-ai-ships-lfm2-5-230m-with-llama-cpp-mlx-vllm-sglang-and-onnx-support-for-on-device-inference/)
**หมวดหมู่:** ผลิตภัณฑ์ AI | Batch: 3

---

## สรุปข่าว

Liquid AI เปิดตัว LFM2.5-230M โมเดลภาษาขนาด 230 ล้านพารามิเตอร์ที่เป็น open-weight โดยถือเป็นโมเดลเล็กที่สุดของบริษัทจนถึงปัจจุบัน โมเดลนี้สร้างบนสถาปัตยกรรม LFM2 ที่ผสม LIV convolution 8 layer กับ Grouped-Query Attention 6 layer เพื่อให้ inference บน CPU มีความเร็วสูง ด้านความเร็วสามารถประมวลผลได้ 213 token ต่อวินาทีบน Samsung Galaxy S25 Ultra และ 42 token/s บน Raspberry Pi 5 โมเดลถูก pre-train ด้วย 19 ล้านล้าน token และผ่าน post-training 3 ขั้นตอนได้แก่ SFT ด้วย distillation จาก LFM2.5-350M, DPO และ multi-domain reinforcement learning รองรับทุก framework หลักได้แก่ llama.cpp, MLX, vLLM, SGLang และ ONNX ด้วย memory footprint เพียง 293-375 MB เปิดโอกาสใหม่สำหรับ agentic AI บน edge device และ mobile

---

## Tech Insights

**ผลกระทบ:** LFM2.5-230M ทำให้ agentic AI บนอุปกรณ์พกพาและ edge device กลายเป็นความจริงในเชิงพาณิชย์ ลดการพึ่งพา cloud API สำหรับ tool use และ data extraction
**ระดับความสำคัญ:** high

### นักพัฒนา/Engineer ควรทำอะไร
- ดาวน์โหลด LFM2.5-230M จาก Hugging Face และทดสอบ function calling สำหรับ use case เฉพาะ
- ใช้ Unsloth/TRL LoRA fine-tuning recipe ที่ Liquid AI จัดเตรียมไว้สำหรับ domain adaptation

### ธุรกิจ/องค์กร ควรทำอะไร
- ประเมินการแทนที่ API calls ด้วย on-device LFM2.5-230M สำหรับงาน data extraction ที่มี volume สูง
- พิจารณา deployment บน edge device หรือ IoT เพื่อลด latency และ protect data privacy

**สาขาที่เกี่ยวข้อง:** Edge AI, On-Device AI, LLM, Agents, Open Source

---

## แหล่งที่มา
- **Source:** [direct](https://www.marktechpost.com/2026/06/27/liquid-ai-ships-lfm2-5-230m-with-llama-cpp-mlx-vllm-sglang-and-onnx-support-for-on-device-inference/)
- **สำนักข่าว:** https://www.marktechpost.com
- **Fetch priority:** 1_direct

---
*AI-News Pipeline v2.0 | run: 2026-06-29 | target: 2026-06-29 | batch: 3*
