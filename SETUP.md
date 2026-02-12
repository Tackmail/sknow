# 🚀 Quick Start Guide - Snow Notes Backend Server

## ทำให้อัปเกรดเสร็จแล้ว! เครื่องกำเนิด Shared Notes

คุณตอนนี้มี backend server ที่ใช้ Node.js + Express + SQLite เพื่อแชร์โน้ตระหว่างอุปกรณ์ได้!

---

## ✅ ขั้นตอนการติดตั้ง

### 1️⃣ ติดตั้ง Dependencies (ทำครั้งเดียว)

เปิด **PowerShell/Terminal** ในโฟลเดอร์ `armnewweb` แล้วรัน:

```powershell
npm install
```

⏳ รอซักครู่ให้มันดาวน์โหลด packages และติดตั้ง (ครั้งแรกอาจใช้เวลาเล็กน้อย)

---

### 2️⃣ เริ่มต้น Server

```powershell
npm start
```

✅ สำเร็จ! คุณจะเห็น:
```
Snow Notes Server running on http://localhost:3001
```

---

### 3️⃣ เปิดแอพพลิเคชัน

เปิด browser ไป: **http://localhost:3001**

---

## 🎯 ที่เปลี่ยนไป (สิ่งสำคัญ)

### ก่อนหน้า (localStorage ใช้ได้แค่บน device เดียวกัน)
- User A สร้างโน้ตบน Laptop → User B บน Phone ไม่เห็น ❌

### ตอนนี้ (Shared Database)
- User A สร้างโน้ตบน Laptop → User B บน Phone **เห็นได้เลย** ✅
- โน้ต **Public** มองเห็นได้สำหรับทุกคน
- โน้ต **Private** ต้องใช้รหัส 10 ตัว

---

## 📝 วิธีใช้งาน

### สร้างโน้ต Public (ทุกคนเห็น)
1. กดปุ่ม **+** (มุมล่างซ้าย)
2. พิมพ์เรื่อง & รายละเอียด
3. เลือก **Public**
4. บันทึก → โน้ตปรากฏเป็น ❄️ snowflakes ให้คนอื่นเห็น

### สร้างโน้ต Private (ต้องใช้รหัส)
1. สร้างโน้ตเหมือนข้างบน
2. เลือก **Private**
3. คัดลอก รหัส 10 ตัว ส่งให้คนอื่น
4. คนอื่นนำรหัสไปที่ช่องกรอกบนสุด เปิดได้

### ดูโน้ตของตัวเอง
- **Sidebar ด้านขวา** "My Notes" 
- เฉพาะโน้ตที่คุณสร้างเท่านั้น

### ค้นหาโน้ตจากรหัส
- ใส่รหัส 10 หลักที่ช่องด้านบน
- กด **เปิด**

---

## 🎨 ความสามารถใหม่

| หน้า | ความต้องการ | ผล |
|------|----------|------|
| **Public Note** | สร้างและแชร์ได้ | ทุกคนเห็น snowflake |
| **Private Note** | ส่งรหัส | เฉพาะคนที่มีรหัสเพียง |
| **Replies** | ตอบโน้ต | ทุกคนมองเห็นการตอบ |
| **Admin Mode** | รหัส `ADMINSNOW` | ดูและลบโน้ตทั้งหมด |

---

## ⚠️ ปัญหาทั่วไป

### ❌ "Cannot GET /api/notes"
✅ **แก้ไข**: แน่ใจว่า server กำลังรันใจ `npm start` ดำเนิน

### ❌ "CORS Error"
✅ **แก้ไข**: ใช้ `http://localhost:3001` ไม่ใช่ `http://127.0.0.1:3001`

### ❌ โน้ตหาย
✅ **แก้ไข**: ลบ `notes.db` และ restart server เพื่อ reset ทั้งหมด

---

## 📂 ไฟล์ที่เพิ่มเข้ามา

```
armnewweb/
├── server.js          ⭐ NEW - Node.js API Server
├── package.json       ⭐ NEW - Dependencies (npm packages)
├── notes.db           ⭐ AUTO (หลังรัน server) - Database
├── .gitignore         ⭐ NEW - Git ignore rules
├── README.md          ⭐ NEW - Full documentation
├── SETUP.md           ⭐ NEW - This file
└── script.js          ✏️ UPDATED - Uses API instead of localStorage
```

---

## 🔧 Advanced Commands

```powershell
# Start server (normal)
npm start

# Start server with auto-reload (development)
npm run dev

# Check installed packages
npm list
```

---

## 🌐 API Endpoints (สำหรับ developers)

| Method | URL | ทำไรได้ |
|--------|-----|--------|
| GET | `/api/notes` | ดึงโน้ต Public ทั้งหมด |
| POST | `/api/notes` | สร้างโน้ตใหม่ |
| DELETE | `/api/notes/:code` | ลบโน้ต |
| POST | `/api/notes/:code/replies` | เพิ่มการตอบ |
| GET | `/api/notes/admin/all` | ดึงโน้ตทั้งหมด (admin) |

---

## ✨ Features ที่ยิ่งใหญ่

✅ **Real-time Shared Notes** - สร้างบน device หนึ่ง เห็นบน device อื่นทันที  
✅ **Public & Private Mix** - โน้ตบางส่วนเผยแพร่ บางส่วนเก็บเป็นส่วนตัว  
✅ **Database Persistence** - โน้ตเก็บถาวรใน SQLite ไม่หายแม้ปิด browser  
✅ **Admin Panel** - ดูและจัดการโน้ตทั้งหมดได้  
✅ **Replies** - เพิ่มการตอบสนองต่อโน้ต  

---

## 📞 ปัญหา?

ลองดูที่ README.md สำหรับคำตอบที่ละเอียดขึ้น 📖

**ทำได้แล้ว? มีความสุข!** 🎉
