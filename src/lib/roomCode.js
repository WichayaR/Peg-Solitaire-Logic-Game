// Generate 6-character room codes (uppercase letters + digits, no ambiguous chars)
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(length = 6) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

// Persistent player id stored in localStorage
export function getOrCreatePersistentId() {
  const KEY = 'peg-solitaire:persistent-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      'p_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(KEY, id);
  }
  return id;
}