# 🚀 Supabase Setup Guide

> ใช้เวลา ~5 นาที ทำตามทีละขั้น

## Checklist

- [ ] ขั้นตอนที่ 1 — สร้าง Supabase project
- [ ] ขั้นตอนที่ 2 — รัน SQL schema
- [ ] ขั้นตอนที่ 3 — เอา URL + Key
- [ ] ขั้นตอนที่ 4 — ใส่ใน `.env`
- [ ] ขั้นตอนที่ 5 — ทดสอบ
- [ ] ขั้นตอนที่ 6 — Deploy บน Vercel

---

## ขั้นตอนที่ 1 — สร้าง project

1. ไป https://supabase.com/dashboard
2. กด **"New Project"**
3. กรอก:
   - **Name**: `peg-solitaire` (หรืออะไรก็ได้)
   - **Database Password**: ตั้งรหัสผ่าน 12+ ตัวอักษร → **เก็บไว้ใน password manager**
   - **Region**: `Southeast Asia (Singapore)` ← ใกล้ไทยสุด
4. กด **Create new project**
5. รอ 1-2 นาที จน status เป็น "Active"

## ขั้นตอนที่ 2 — รัน SQL

1. เมนูซ้าย → **SQL Editor** (รูปไอคอนฐานข้อมูล)
2. กด **"New query"**
3. เปิดไฟล์ `supabase/schema.sql` ในโปรเจกต์ → Copy ทั้งหมด → Paste
4. กด **"Run"** (หรือ Ctrl+Enter)
5. ต้องเห็น **"Success. No rows returned"**

ถ้า error:
- "extension already exists" → รันอีกครั้งได้ (ใช้ `IF NOT EXISTS`)
- "relation already exists" → เคยรันแล้ว ข้ามไปขั้นตอน 3 ได้

## ขั้นตอนที่ 3 — เอา URL + Key

1. เมนูซ้าย → **Settings** (รูปเฟือง) → **API**
2. Copy 2 ค่า:

| ค่า | ที่อยู่ |
|---|---|
| `Project URL` | กล่อง "Project URL" |
| `anon public` key | กล่อง "Project API keys" → กดปุ่ม copy ที่ row "anon" |

⚠️ **ใช้แค่ `anon` key** — ห้ามใช้ `service_role` (มัน bypass RLS ทั้งหมด เป็น admin key)

## ขั้นตอนที่ 4 — ใส่ใน `.env`

แก้ไฟล์ `.env` ใน root โปรเจกต์:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

**แทนค่า `xxxxx` ด้วยค่าจริงที่ copy มา**

## ขั้นตอนที่ 5 — ทดสอบ

1. Restart dev server:
   ```bash
   # กด Ctrl+C แล้วรันใหม่
   npm run dev
   ```
2. เปิด http://localhost:5173
3. ดูที่ banner ด้านบน:
   - ถ้าเห็น **🧪 Local Mode** = ยังไม่ได้ตั้ง (เช็คค่าใน .env)
   - ถ้า**ไม่มี banner** = Supabase ทำงาน ✅
4. ทดสอบสร้างห้อง → เปิด incognito → join ห้อง → เล่น 2 tabs ดู

## ขั้นตอนที่ 6 — Deploy Vercel

1. Push โปรเจกต์ขึ้น GitHub
2. ไป https://vercel.com → **"Add New Project"** → import repo
3. **ก่อนกด Deploy** → **Environment Variables** → เพิ่ม 2 ตัว:
   - `VITE_SUPABASE_URL` = ค่าเดียวกับ .env
   - `VITE_SUPABASE_ANON_KEY` = ค่าเดียวกับ .env
4. กด Deploy
5. เปิด URL ที่ได้ → ทดสอบ multiplayer ข้ามเครื่องจริง 🎉

---

## ⚠️ Security Notes

### RLS Policies

ใน schema ใช้ **permissive policies** (anon ทำได้ทุกอย่าง) เพราะ:
- เกมนี้ใช้ anonymous identity ผ่าน `localStorage` (ไม่มี login)
- ต้องให้ทุกคน create/join room ได้
- ต้อง sync ผ่าน realtime

**ข้อจำกัดที่ยอมรับได้:**
- ผู้เล่นอาจ "ปลอม" room code เพื่อ join (ไม่เป็นไร — เป็นเกม ไม่มีอะไรเสียหาย)
- ผู้เล่นอาจ submit score ปลอม (ตอนนี้ยังป้องกันไม่ได้ — เพราะไม่มี auth)
- ถ้าต้องการ anti-cheat จริงจัง ต้องเพิ่ม Supabase Auth

### ใช้ anon key ปลอดภัยไหม?

✅ **ปลอดภัย** — anon key ตั้งใจให้ public ใช้ได้ RLS จะกรองให้

❌ ห้าม commit `service_role` key ลง git เด็ดขาด

---

## Troubleshooting

**Q: Banner ยังโชว์ Local Mode ทั้งที่ใส่ .env แล้ว**
- รีสตาร์ท dev server (`Ctrl+C` แล้ว `npm run dev`)
- เช็คว่าไม่มีคำว่า `placeholder` ในค่า
- เช็คว่าขึ้นต้นด้วย `VITE_` (Vite อ่านได้เฉพาะ prefix นี้)

**Q: สร้างห้องไม่ได้ / Error 401**
- เช็คว่าใช้ `anon` key (ไม่ใช่ `service_role`)
- ตรวจสอบว่ารัน SQL schema แล้ว

**Q: Realtime ไม่ทำงาน**
- ใน Supabase Dashboard → Database → Replication → ตรวจว่า tables อยู่ใน `supabase_realtime`
- ถ้าไม่มี ให้รัน SQL นี้เพิ่ม:
  ```sql
  alter publication supabase_realtime add table public.rooms;
  alter publication supabase_realtime add table public.players;
  alter publication supabase_realtime add table public.round_results;
  ```

**Q: Vercel deploy แล้วเข้าไม่ได้ / หน้าขาว**
- เช็ค Environment Variables ใน Vercel ว่าใส่ครบ
- ลอง `vercel.json` → มี SPA rewrite อยู่แล้ว