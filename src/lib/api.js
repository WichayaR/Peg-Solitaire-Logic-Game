// =========================================================
// API helpers — รองรับทั้ง Supabase และ Local mode
// =========================================================
import { supabase, isSupabaseConfigured } from './supabase.js';
import { localStore } from './localStore.js';
import { generateRoomCode } from './roomCode.js';

function isLocal() {
  return !isSupabaseConfigured;
}

export async function createRoom({
  hostId,
  boardShape,
  level,
  timerSeconds,
  maxRounds,
  minPlayers,
  maxPlayers,
  hintsAllowed,
  hintPenalty,
}) {
  const code = generateRoomCode(6);

  if (isLocal()) {
    return localStore.insertRoom({
      code,
      host_id: hostId,
      board_shape: boardShape,
      level,
      timer_seconds: timerSeconds,
      max_rounds: maxRounds,
      min_players: minPlayers,
      max_players: maxPlayers,
      hints_allowed: hintsAllowed,
      hint_penalty: hintPenalty,
      status: 'waiting',
      current_round: 0,
    });
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      code,
      host_id: hostId,
      board_shape: boardShape,
      level,
      timer_seconds: timerSeconds,
      max_rounds: maxRounds,
      min_players: minPlayers,
      max_players: maxPlayers,
      hints_allowed: hintsAllowed,
      hint_penalty: hintPenalty,
      status: 'waiting',
      current_round: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setPlayerReady(playerId, isReady) {
  if (isLocal()) {
    return localStore.updatePlayer(playerId, { is_ready: isReady });
  }
  const { data, error } = await supabase
    .from('players')
    .update({ is_ready: isReady, last_seen: new Date().toISOString() })
    .eq('id', playerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRoomByCode(code) {
  if (isLocal()) {
    return localStore.getRoomByCode(code.toUpperCase());
  }
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function countPlayers(roomId) {
  if (isLocal()) {
    const players = await localStore.getPlayersByRoom(roomId);
    return players.length;
  }
  const { count, error } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId);
  if (error) throw error;
  return count || 0;
}

export async function joinRoom({ roomId, persistentId, nickname, isHost = false }) {
  // เช็คจำนวนผู้เล่นก่อน (ยกเว้น host กลับเข้ามา)
  if (!isHost) {
    const current = await countPlayers(roomId);
    const room = isLocal()
      ? await localStore.getRooms().then((rs) => rs.find((r) => r.id === roomId))
      : await supabase.from('rooms').select('max_players').eq('id', roomId).single().then((d) => d.data);
    if (room && current >= room.max_players) {
      // เช็คว่าเคย join แล้วหรือไม่ (reconnect)
      const existing = isLocal()
        ? await localStore.findPlayer(roomId, persistentId)
        : await supabase
            .from('players')
            .select('*')
            .eq('room_id', roomId)
            .eq('persistent_id', persistentId)
            .maybeSingle()
            .then((d) => d.data);
      if (!existing) {
        throw new Error('ห้องเต็มแล้ว');
      }
    }
  }

  if (isLocal()) {
    return localStore.upsertPlayer({
      room_id: roomId,
      persistent_id: persistentId,
      nickname,
      is_host: isHost,
    });
  }

  const { data: existing } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', roomId)
    .eq('persistent_id', persistentId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('players')
      .update({ nickname, last_seen: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('players')
    .insert({
      room_id: roomId,
      persistent_id: persistentId,
      nickname,
      is_host: isHost,
      last_seen: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function startRoom(roomId, roundNumber = 1) {
  if (isLocal()) {
    return localStore.updateRoom(roomId, {
      status: 'playing',
      current_round: roundNumber,
    });
  }
  const { data, error } = await supabase
    .from('rooms')
    .update({ status: 'playing', current_round: roundNumber })
    .eq('id', roomId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function nextRound(roomId, roundNumber) {
  if (isLocal()) {
    return localStore.updateRoom(roomId, {
      status: 'playing',
      current_round: roundNumber,
    });
  }
  const { data, error } = await supabase
    .from('rooms')
    .update({ status: 'playing', current_round: roundNumber })
    .eq('id', roomId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function finishRoom(roomId) {
  if (isLocal()) {
    return localStore.updateRoom(roomId, { status: 'finished' });
  }
  const { data, error } = await supabase
    .from('rooms')
    .update({ status: 'finished' })
    .eq('id', roomId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function submitRoundResult({
  roomId,
  playerId,
  roundNumber,
  scoreDelta,
  pegsRemaining,
  hintsUsed,
  timeUsedSeconds,
}) {
  if (isLocal()) {
    return localStore.upsertResult({
      room_id: roomId,
      player_id: playerId,
      round_number: roundNumber,
      score_delta: scoreDelta,
      pegs_remaining: pegsRemaining,
      hints_used: hintsUsed,
      time_used_seconds: timeUsedSeconds,
    });
  }

  const { data, error } = await supabase
    .from('round_results')
    .upsert(
      {
        room_id: roomId,
        player_id: playerId,
        round_number: roundNumber,
        score_delta: scoreDelta,
        pegs_remaining: pegsRemaining,
        hints_used: hintsUsed,
        time_used_seconds: timeUsedSeconds,
        finished_at: new Date().toISOString(),
      },
      { onConflict: 'player_id,round_number' },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

// อัปเดต score/pegs_remaining ของผู้เล่น โดยบวก delta
export async function applyPlayerScore(playerId, { scoreDelta, pegsRemaining }) {
  if (isLocal()) {
    // อ่านค่าปัจจุบันก่อน
    const players = JSON.parse(localStorage.getItem('peg:players') || '[]');
    const cur = players.find((p) => p.id === playerId);
    if (!cur) throw new Error('Player not found');
    return localStore.updatePlayer(playerId, {
      score: (cur.score || 0) + (scoreDelta || 0),
      pegs_remaining: pegsRemaining !== undefined ? pegsRemaining : cur.pegs_remaining,
      finished_rounds: (cur.finished_rounds || 0) + 1,
    });
  }

  const { data: cur, error: readErr } = await supabase
    .from('players')
    .select('score, finished_rounds')
    .eq('id', playerId)
    .single();
  if (readErr) throw readErr;

  const updates = {};
  if (scoreDelta !== undefined) updates.score = cur.score + scoreDelta;
  if (pegsRemaining !== undefined) updates.pegs_remaining = pegsRemaining;
  updates.finished_rounds = cur.finished_rounds + 1;
  updates.last_seen = new Date().toISOString();

  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', playerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}