// =========================================================
// Board shapes for Peg Solitaire.
// A board is a 2D grid of cells:
//   null  → หลุมที่ไม่มีในกระดาน (เช่นมุมของกากบาท)
//   1     → มี peg (ตอน initial state)
//   0     → หลุมว่าง (จะเกิดขึ้นตอนเริ่มเกม — รอเคลื่อน peg เข้ามา)
//
// ใช้ array 2D ขนาด NxN เพื่อให้ index row, col ตรงกัน
// =========================================================

// Triangle 15 pegs — ง่ายที่สุด
//    X          row 0: col 3
//   X X         row 1: cols 2-4
//  X X X        row 2: cols 1-5
// X X X X       row 3: cols 0-6
//  X X X        row 4: cols 1-5
//   X X         row 5: cols 2-4
//    X          row 6: col 3
//
// ใช้ grid 7x7 หลุมกลาง (row 3, col 3) ว่าง
const triangle = [
  [null, null, null, 1, null, null, null],
  [null, null, 1, 1, 1, null, null],
  [null, 1, 1, 1, 1, 1, null],
  [1, 1, 1, 0, 1, 1, 1],
  [null, 1, 1, 1, 1, 1, null],
  [null, null, 1, 1, 1, null, null],
  [null, null, null, 1, null, null, null],
];

// English cross (33 pegs) — classic
//     X X X
//     X X X
// X X X X X X X
// X X X O X X X
// X X X X X X X
//     X X X
//     X X X
const english = [
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [null, null, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, null, null],
];

// Diamond 41 pegs — ปานกลาง
//    X X X
//   X X X X X
//  X X X X X X X
//   X X X X X
//    X X X
//
// ใช้ grid 9x9 หลุมกลาง (row 4, col 4) ว่าง
const diamond = [
  [null, null, null, 1, 1, 1, null, null, null],
  [null, null, null, 1, 1, 1, null, null, null],
  [null, null, 1, 1, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, 1, 1, null, null],
  [1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [null, null, 1, 1, 1, 1, 1, null, null],
  [null, null, 1, 1, 1, 1, 1, null, null],
  [null, null, null, 1, 1, 1, null, null, null],
];

// Deutsch 49 pegs — German-style 7x7 grid ตัดมุม
// X X X X X X X
// X X X X X X X
// X X X X X X X
// X X X O X X X
// X X X X X X X
// X X X X X X X
// X X X X X X X
const deutsch = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

export const BOARDS = {
  triangle,
  english,
  diamond,
  deutsch,
};

export const LEVELS = [
  {
    id: 1,
    shape: 'triangle',
    label: 'Level 1 — Triangle',
    description: 'กระดานสามเหลี่ยม 24 pegs · ง่าย',
    pegs: 24,
  },
  {
    id: 2,
    shape: 'english',
    label: 'Level 2 — English Cross',
    description: 'กระดานกากบาท 32 pegs · ปานกลาง',
    pegs: 32,
  },
  {
    id: 3,
    shape: 'diamond',
    label: 'Level 3 — Diamond',
    description: 'กระดานเพชร 46 pegs · ยาก',
    pegs: 46,
  },
  {
    id: 4,
    shape: 'deutsch',
    label: 'Level 4 — Deutsch',
    description: 'กระดาน 7×7 48 pegs · ผู้เชี่ยวชาญ',
    pegs: 48,
  },
];

export function getLevelById(levelId) {
  return LEVELS.find((l) => l.id === Number(levelId)) || LEVELS[0];
}

export function getBoardByShape(shape) {
  return BOARDS[shape] || BOARDS.triangle;
}

// คำนวณ level ของรอบที่ N โดย host เลือก level เริ่มต้น (startLevel)
// รอบ 1 = startLevel, รอบ 2 = startLevel+1, ...
// ถ้าเกิน Level 4 ให้วนกลับ Level สุดท้าย
export function getLevelForRound(startLevel, roundNumber) {
  const maxId = Math.max(...LEVELS.map((l) => l.id));
  const id = Math.min(startLevel + (roundNumber - 1), maxId);
  return LEVELS.find((l) => l.id === id) || LEVELS[0];
}

export function getBoardForRound(startLevel, roundNumber) {
  const lv = getLevelForRound(startLevel, roundNumber);
  return lv.shape;
}