// =========================================================
// Local Storage Adapter
// ใช้แทน Supabase เพื่อทดสอบแบบ offline
// เก็บข้อมูลใน localStorage และ sync ระหว่าง tabs ผ่าน BroadcastChannel
//
// API พยายามใกล้เคียงกับ @supabase/supabase-js เพื่อให้ useRoom hook
// ใช้งานได้ทั้งสอง mode
// =========================================================

const STORAGE_KEYS = {
  rooms: 'peg:rooms',
  players: 'peg:players',
  results: 'peg:results',
};

const CHANNEL_NAME = 'peg-solitaire-sync';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  broadcast();
}

let bc = null;
if (typeof BroadcastChannel !== 'undefined') {
  bc = new BroadcastChannel(CHANNEL_NAME);
}

function broadcast() {
  bc?.postMessage({ type: 'sync', ts: Date.now() });
}

const listeners = new Set();

bc?.addEventListener('message', (e) => {
  if (e.data?.type === 'sync') {
    listeners.forEach((cb) => cb());
  }
});

// Subscribe ให้ useRoom hook ใช้
export function subscribeToStore(callback) {
  listeners.add(callback);
  // ฟัง storage event สำหรับ tabs ที่ไม่มี BroadcastChannel
  const onStorage = (e) => {
    if (
      e.key === STORAGE_KEYS.rooms ||
      e.key === STORAGE_KEYS.players ||
      e.key === STORAGE_KEYS.results
    ) {
      callback();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

// ====== Tables ======
function getRooms() {
  return readJSON(STORAGE_KEYS.rooms, []);
}
function setRooms(arr) {
  writeJSON(STORAGE_KEYS.rooms, arr);
}
function getPlayers() {
  return readJSON(STORAGE_KEYS.players, []);
}
function setPlayers(arr) {
  writeJSON(STORAGE_KEYS.players, arr);
}
function getResults() {
  return readJSON(STORAGE_KEYS.results, []);
}
function setResults(arr) {
  writeJSON(STORAGE_KEYS.results, arr);
}

// ====== Query helpers (subset ที่ใช้ใน app) ======

export const localStore = {
  // rooms
  async getRoomByCode(code) {
    const rooms = getRooms();
    return rooms.find((r) => r.code === code) || null;
  },
  async insertRoom(room) {
    const rooms = getRooms();
    const id = room.id || crypto.randomUUID();
    const newRoom = { ...room, id, created_at: room.created_at || new Date().toISOString() };
    rooms.push(newRoom);
    setRooms(rooms);
    return newRoom;
  },
  async updateRoom(id, patch) {
    const rooms = getRooms();
    const idx = rooms.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Room not found');
    rooms[idx] = { ...rooms[idx], ...patch };
    setRooms(rooms);
    return rooms[idx];
  },

  // players
  async getPlayersByRoom(roomId) {
    return getPlayers().filter((p) => p.room_id === roomId);
  },
  async findPlayer(roomId, persistentId) {
    return (
      getPlayers().find(
        (p) => p.room_id === roomId && p.persistent_id === persistentId,
      ) || null
    );
  },
  async upsertPlayer(player) {
    const players = getPlayers();
    const existing = await this.findPlayer(player.room_id, player.persistent_id);
    if (existing) {
      const idx = players.findIndex((p) => p.id === existing.id);
      players[idx] = { ...existing, ...player, last_seen: new Date().toISOString() };
      setPlayers(players);
      return players[idx];
    }
    const newPlayer = {
      id: crypto.randomUUID(),
      score: 0,
      pegs_remaining: 0,
      is_host: false,
      finished_rounds: 0,
      last_seen: new Date().toISOString(),
      ...player,
    };
    players.push(newPlayer);
    setPlayers(players);
    return newPlayer;
  },
  async updatePlayer(id, patch) {
    const players = getPlayers();
    const idx = players.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Player not found');
    players[idx] = {
      ...players[idx],
      ...patch,
      last_seen: new Date().toISOString(),
    };
    setPlayers(players);
    return players[idx];
  },

  // round_results
  async getResultsByRoom(roomId) {
    return getResults()
      .filter((r) => r.room_id === roomId)
      .sort((a, b) => a.round_number - b.round_number);
  },
  async upsertResult(result) {
    const results = getResults();
    const idx = results.findIndex(
      (r) =>
        r.player_id === result.player_id &&
        r.round_number === result.round_number,
    );
    const newResult = {
      id: crypto.randomUUID(),
      finished_at: new Date().toISOString(),
      ...result,
    };
    if (idx === -1) {
      results.push(newResult);
    } else {
      results[idx] = { ...results[idx], ...newResult };
    }
    setResults(results);
    return newResult;
  },

  // helpers สำหรับ reset/debug
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.rooms);
    localStorage.removeItem(STORAGE_KEYS.players);
    localStorage.removeItem(STORAGE_KEYS.results);
    broadcast();
  },
};