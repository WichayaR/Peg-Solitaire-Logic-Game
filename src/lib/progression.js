// =========================================================
// Player progression — persistent across sessions
// เก็บใน localStorage ต่อ persistentId
// =========================================================

const KEY_PREFIX = 'peg-solitaire:progress:';

const DEFAULT_STATE = {
  unlockedLevel: 1,
  highestCleared: 0,
  totalWins: 0,
  totalGames: 0,
  bestScores: {}, // { [levelId]: bestScore }
  lastPlayedAt: null,
};

function storageKey(persistentId) {
  return `${KEY_PREFIX}${persistentId}`;
}

export function loadProgression(persistentId) {
  if (!persistentId) return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(storageKey(persistentId));
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    // merge เพื่อรองรับ field ใหม่ในอนาคต
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveProgression(persistentId, state) {
  if (!persistentId) return;
  try {
    localStorage.setItem(storageKey(persistentId), JSON.stringify(state));
  } catch {
    // ignore quota / private mode errors
  }
}

// ปลดล็อก level ถัดไป (ถ้ามี)
export function unlockLevel(persistentId, levelId) {
  const current = loadProgression(persistentId);
  const next = Math.max(current.unlockedLevel, levelId + 1, levelId);
  const updated = {
    ...current,
    unlockedLevel: Math.min(next, 4), // max 4
    lastPlayedAt: new Date().toISOString(),
  };
  saveProgression(persistentId, updated);
  return updated;
}

// บันทึกผลเกม (เรียกตอนจบรอบ/จบเกม)
export function recordGame(persistentId, { levelId, score, win }) {
  const current = loadProgression(persistentId);
  const updates = {
    ...current,
    totalGames: current.totalGames + 1,
    lastPlayedAt: new Date().toISOString(),
  };

  if (win) {
    updates.totalWins = current.totalWins + 1;
    updates.highestCleared = Math.max(current.highestCleared, levelId);
    // unlock level ถัดไป
    if (levelId < 4) {
      updates.unlockedLevel = Math.max(current.unlockedLevel, levelId + 1);
    }
  }

  // best score (เฉพาะ win)
  if (win) {
    const prev = current.bestScores[levelId] || 0;
    if (score > prev) {
      updates.bestScores = {
        ...current.bestScores,
        [levelId]: score,
      };
    }
  }

  saveProgression(persistentId, updates);
  return updates;
}

export function resetProgression(persistentId) {
  if (!persistentId) return;
  localStorage.removeItem(storageKey(persistentId));
}

export const MAX_LEVEL = 4;