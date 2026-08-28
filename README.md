# 🎮 Peg Solitaire Multiplayer

เกม Peg Solitaire แบบ multiplayer real-time head-to-head สร้างด้วย **React + Vite + Tailwind v4 + Supabase**

## ฟีเจอร์

- 🎲 **4 ระดับ** — Triangle (15) → English Cross (33) → Diamond (41) → Deutsch (49)
- 🌐 **Multiplayer** — Host สร้างห้อง ได้รหัส 6 ตัว + share link เพื่อน join ได้ทันที
- 🏆 **Scoreboard real-time** — คะแนนอัปเดตทุกคนในห้องแบบ live
- 💡 **Hint** — กดดู move ที่ดีที่สุด แต่จะหักคะแนน (host ตั้ง penalty ได้)
- ⏱️ **Timer** — จับเวลาต่อรอบ (host ตั้งได้)
- ⚙️ **Host ตั้งค่าห้อง** — level, timer, hint penalty, จำนวนรอบ
- 🎯 **Solo mode** — ฝึกเล่นคนเดียวทุก level
- 🔐 **Anonymous play** — ไม่ต้องสมัคร แค่ตั้งชื่อเล่น

## Tech Stack

- React 19 + Vite 6 + Tailwind CSS v4
- react-router-dom v6
- Supabase (Database + Realtime)
- localStorage สำหรับ persistentId (ไม่ต้อง auth)

## เริ่มต้นใช้งาน

### โหมดการทำงาน

| โหมด | เมื่อไหร่ | ได้อะไร |
|---|---|---|
| 🧪 **Local Mode** | `.env` ว่าง/placeholder | เล่น solo + 2 tabs เครื่องเดียวกัน เหมาะทดสอบ |
| ☁️ **Supabase Mode** | `.env` ใส่ค่าจริง | multiplayer ข้ามเครื่องจริง ผ่าน Realtime |

**สำหรับ deploy จริง ต้องตั้ง Supabase** มิเช่นนั้นผู้เล่นจะอยู่ใน Local Mode และเล่นข้ามเครื่องไม่ได้

> 📖 ดู **SUPABASE_SETUP.md** สำหรับคู่มือตั้ง Supabase แบบทีละขั้นตอน (5 นาที)

### 1) ติดตั้ง dependencies

```bash
npm install
```

### 2) (Optional — สำหรับ multiplayer จริง) ตั้ง Supabase

ทำตาม [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) แล้วใส่ค่าใน `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3) รัน dev server

```bash
npm run dev
```

Banner 🧪 Local Mode จะหายไปอัตโนมัติเมื่อตั้ง Supabase เรียบร้อย

### 4) Deploy บน Vercel

```bash
npm run build
```

ตอน build production จะมี **warning** ถ้ายังไม่ได้ตั้ง Supabase เพื่อกันลืม:

```
⚠️  WARNING: Production build without Supabase config
  → Players cannot play across different devices
```

เปิด `http://localhost:5173` ได้เลย

## Build & Deploy บน Vercel

```bash
npm run build
```

โปรเจกต์ตั้ง `vercel.json` ไว้แล้ว (SPA rewrites) push ขึ้น GitHub แล้ว import ใน Vercel ก็ใช้ได้ทันที อย่าลืมตั้ง env vars ใน Vercel dashboard ด้วย

## โครงสร้างโปรเจกต์

```
src/
├── lib/                  Core utilities
│   ├── supabase.js       Supabase client
│   ├── boards.js         รูปแบบกระดาน + levels
│   ├── pegLogic.js       Game rules: moves, win, hint
│   ├── scoring.js        สูตรคะแนน
│   ├── api.js            CRUD helpers
│   └── roomCode.js       Room code + persistentId
├── contexts/             React Context
│   └── PlayerContext.jsx  Persistent identity
├── hooks/
│   └── useRoom.js        Realtime subscription
├── components/           UI primitives
│   ├── Board.jsx         กระดานหลัก + game state
│   ├── Peg.jsx           หลุมแต่ละช่อง
│   ├── Timer.jsx         ⏱️ นับถอยหลัง
│   ├── Scoreboard.jsx    🏆 leaderboard
│   ├── PlayerCard.jsx    card ผู้เล่น
│   └── ToastHost.jsx     notifications
├── pages/
│   ├── HomePage.jsx      หน้าแรก
│   ├── CreateRoomPage.jsx ตั้งค่าห้อง
│   ├── JoinRoomPage.jsx  กรอกรหัส
│   ├── LobbyPage.jsx     รอผู้เล่น
│   ├── GamePage.jsx      เล่นจริง
│   ├── ResultPage.jsx    สรุปผล
│   └── SoloGamePage.jsx  ฝึกคนเดียว
├── App.jsx               Router
└── main.jsx              Entry
supabase/
└── schema.sql            Database schema (run ใน Supabase SQL Editor)
```

## วิธีเล่น

1. **สร้างห้อง** — ตั้งค่า level / timer / hint / จำนวนรอบ → ได้รหัส 6 ตัว + share link
2. **ส่ง link ให้เพื่อน** — เพื่อนกด link หรือกรอกรหัสในหน้า "เข้าร่วมห้อง"
3. **Host กดเริ่มเกม** — ทุกคนเริ่มรอบ 1 พร้อมกัน
4. **เล่นพร้อมกัน** — แข่งกันใครเหลือ peg น้อยสุด ใช้เวลาน้อยสุด
5. **จบรอบ** — ทุกคนกด "ส่งคะแนน" → Host กด "รอบถัดไป"
6. **จบทุกรอบ** — ดู Leaderboard + ตารางสรุป

## กติกาการให้คะแนน

```
Round Score = pegScore + timeBonus − hintCost

pegScore  = (ชนะ ? pegsRemaining : 0) × 100
timeBonus = (timer - timeUsed) / 5
hintCost  = hintsUsed × hintPenalty
```

- **ชนะ** = เหลือ 1 peg → 100 คะแนน
- **แพ้** = เหลือ > 1 peg → 0 คะแนนจาก peg แต่ยังได้ time bonus − hint cost
- **จบเร็ว** = ได้ time bonus (วินาทีที่เหลือ ÷ 5)
- **Hint** = หัก `hint_penalty` ต่อครั้ง (host ตั้ง 0–500 ได้)

## License

MIT