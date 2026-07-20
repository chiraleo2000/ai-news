# ระวังซอฟต์แวร์ปลอมบน GitHub กับ SourceForge โหลดแล้วอาจติดมัลแวร์ Deno RAT ได้

**แหล่งข่าว:** Thaiware (Thai)
**วันที่:** 2026-06-22
**ลิ้งค์:** [direct](https://www.antivirus.in.th/news/22409.html)
**หมวดหมู่:** ความปลอดภัย / Cybersecurity | Batch: 1

---

## สรุปข่าว

มีการค้นพบแคมเปญมัลแวร์ใหม่ที่แฝงซอฟต์แวร์ปลอมไว้บนแพลตฟอร์ม GitHub และ SourceForge ซึ่งเป็นแหล่งดาวน์โหลดซอฟต์แวร์ที่นักพัฒนาและผู้ใช้ทั่วไปไว้ใจ กระบวนการโจมตีเริ่มจากการติดตั้ง DinDoor backdoor เพื่อเปิดช่องทางเข้าออกให้แฮกเกอร์ก่อน จากนั้นจึงติดตั้ง Deno RAT (Remote Access Trojan) เพื่อเข้าควบคุมเครื่องเหยื่อได้อย่างสมบูรณ์ แนะนำให้ผู้ใช้ตรวจสอบความถูกต้องของซอฟต์แวร์ก่อนดาวน์โหลดทุกครั้ง และหลีกเลี่ยงซอฟต์แวร์จากแหล่งที่ไม่น่าเชื่อถือ

---

## Tech Insights

**ผลกระทบ:** การใช้แพลตฟอร์มที่น่าเชื่อถืออย่าง GitHub เป็นช่องทางกระจายมัลแวร์เป็นภัยคุกคามระดับสูง เพราะผู้ใช้มักไม่ระวัง
**ระดับความสำคัญ:** high

### นักพัฒนา/Engineer ควรทำอะไร
- ตรวจสอบ digital signature และ hash ของซอฟต์แวร์ทุกครั้งก่อน install โดยเฉพาะจาก third-party repos
- ใช้ software composition analysis (SCA) tools เพื่อตรวจจับ malicious packages ในโปรเจกต์

### ธุรกิจ/องค์กร ควรทำอะไร
- กำหนด policy การดาวน์โหลดซอฟต์แวร์ในองค์กรและใช้ approved software repository เท่านั้น
- อบรม developer ให้ตระหนักถึงภัยมัลแวร์บน open-source platforms

**สาขาที่เกี่ยวข้อง:** Cybersecurity, Supply Chain Security, Developer Security

---

## แหล่งที่มา
- **Source:** [direct](https://www.antivirus.in.th/news/22409.html)
- **สำนักข่าว:** https://news.thaiware.com
- **Fetch priority:** 1_direct

---
*AI-News Pipeline v1.0 | run: 2026-06-22 | target: 2026-06-22 | batch: 1*
