# NeonWave Music Streaming Platform (Full-Stack)

เว็บแอปพลิเคชันฟังเพลงออนไลน์ครบวงจร พร้อมระบบ Server ออนไลน์, ระบบสมาชิก, สร้าง Playlist, กดถูกใจเพลง, ค้นหา Real-time, และหน้า Admin สำหรับอัปโหลดเพลง

## ฟีเจอร์หลักในโปรเจกต์
- **Glassmorphism & Modern Dark UI**: ตกแต่งสไตล์ Spotify + Apple Music ไล่เฉดสีสวยงาม รองรับทุกหน้าจอ
- **Global Persistent Player**: เล่นเพลงต่อเนื่องแม้สลับหน้า พร้อมปุ่ม Next/Prev, Shuffle, Repeat, ปรับระดับเสียง และแถบเลื่อนเวลา
- **Online Database & Storage (Supabase)**: เชื่อมต่อฐานข้อมูล PostgreSQL และ Storage จริง พร้อมโหมด Demo อัตโนมัติหากยังไม่ได้ใส่ API Key
- **User Auth & Library**: สมัครสมาชิก/เข้าสู่ระบบ, กดหัวใจ (Liked Songs), และสร้าง Playlist ส่วนตัว
- **Admin Upload Studio**: หน้าอัปโหลดไฟล์ `.mp3` และรูปหน้าปกขึ้น Cloud Storage

## วิธีติดตั้งและเปิดใช้งาน

1. ติดตั้งแพ็กเกจ:
```bash
npm install
```

2. ตั้งค่า Supabase (Server Online):
- สร้างโปรเจกต์ใหม่ที่ [supabase.com](https://supabase.com)
- นำโค้ดในไฟล์ `supabase_schema.sql` ไปรันในเมนู **SQL Editor**
- ไปที่เมนู **Storage** สร้าง Bucket 2 อันชื่อ `songs` และ `covers` (ตั้งค่าเป็น Public)
- เปลี่ยนชื่อไฟล์ `.env.local.example` เป็น `.env.local` แล้วใส่ URL และ Anon Key ของคุณ

3. รันเซิร์ฟเวอร์ทดสอบบนเครื่อง:
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

4. นำขึ้นออนไลน์จริง (Deploy):
- อัปโหลดโฟลเดอร์นี้ขึ้น GitHub
- นำเข้าโปรเจกต์ใน [vercel.com](https://vercel.com) และใส่ Environment Variables เดียวกับ `.env.local`
