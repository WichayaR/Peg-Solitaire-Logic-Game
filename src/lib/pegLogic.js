// =========================================================
// Peg Solitaire — Core game logic.
// Move rule (classic 4-direction):
//   - เลือก peg ที่ A
//   - หลุมติดกัน (ทิงเดียว) B มี peg
//   - หลุมถัดไป C ว่าง
//   → ย้าย peg จาก A ไป C และลบ peg ที่ B
// =========================================================

import { getBoardByShape } from './boards.js';

export const DIRECTIONS = [
  { dr: -2, dc: 0, name: 'up' },
  { dr: 2, dc: 0, name: 'down' },
  { dr: 0, dc: -2, name: 'left' },
  { dr: 0, dc: 2, name: 'right' },
];

// A move = { from: {r, c}, to: {r, c}, over: {r, c}, direction: 'up'|'down'|... }
export function createBoard(shape) {
  const original = getBoardByShape(shape);
  // Deep clone
  return original.map((row) => row.map((cell) => (cell === null ? null : cell)));
}

export function isValidCell(board, r, c) {
  if (r < 0 || c < 0 || r >= board.length || c >= board.length) return false;
  return board[r][c] !== null;
}

export function isEmpty(board, r, c) {
  return isValidCell(board, r, c) && board[r][c] === 0;
}

export function isPeg(board, r, c) {
  return isValidCell(board, r, c) && board[r][c] === 1;
}

export function countPegs(board) {
  let n = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) n += 1;
    }
  }
  return n;
}

// คืน list ของ move ทั้งหมดที่ทำได้
export function getValidMoves(board) {
  const moves = [];
  const n = board.length;
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (!isPeg(board, r, c)) continue;
      for (const dir of DIRECTIONS) {
        const mr = r + dir.dr / 2;
        const mc = c + dir.dc / 2;
        const tr = r + dir.dr;
        const tc = c + dir.dc;
        if (isPeg(board, mr, mc) && isEmpty(board, tr, tc)) {
          moves.push({
            from: { r, c },
            to: { r: tr, c: tc },
            over: { r: mr, c: mc },
            direction: dir.name,
          });
        }
      }
    }
  }
  return moves;
}

export function getMovesForPeg(board, r, c) {
  return getValidMoves(board).filter((m) => m.from.r === r && m.from.c === c);
}

export function applyMove(board, move) {
  const next = board.map((row) => row.slice());
  next[move.from.r][move.from.c] = 0;
  next[move.over.r][move.over.c] = 0;
  next[move.to.r][move.to.c] = 1;
  return next;
}

export function isGameOver(board) {
  return getValidMoves(board).length === 0;
}

export function isWin(board) {
  return countPegs(board) === 1;
}

// Heuristic hint: เลือก move ที่ทำให้เหลือ peg น้อยที่สุด ถ้าเสมอกันเลือก move ที่เปิดทางได้มากสุด
export function findBestMove(board) {
  const moves = getValidMoves(board);
  if (moves.length === 0) return null;

  let best = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const next = applyMove(board, move);
    const remainingPegs = countPegs(next);
    const futureMoves = getValidMoves(next).length;
    // น้อยกว่า = ดีกว่า (เหลือน้อยกว่า) → ใช้ค่าลบ
    // futureMoves เยอะ = เปิดทางเล่นต่อได้นานกว่า
    const score = -remainingPegs * 100 + futureMoves;
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

export function cellToId(r, c) {
  return `${r}-${c}`;
}