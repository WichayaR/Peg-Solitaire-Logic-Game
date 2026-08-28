import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { localStore, subscribeToStore } from '../lib/localStore.js';

function isLocal() {
  return !isSupabaseConfigured;
}

// =========================================================
// useRoom — subscribe room + players + round_results
// รองรับทั้ง Supabase และ Local mode
// =========================================================

export function useRoom(roomCode) {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const local = isLocal();

  const fetchAll = useCallback(async () => {
    if (!roomCode) return;
    if (local) {
      try {
        setLoading(true);
        const r = await localStore.getRoomByCode(roomCode.toUpperCase());
        if (!r) {
          setError('ไม่พบห้องนี้');
          setRoom(null);
          setPlayers([]);
          setResults([]);
          setLoading(false);
          return;
        }
        setRoom(r);
        const ps = await localStore.getPlayersByRoom(r.id);
        setPlayers(ps);
        const rs = await localStore.getResultsByRoom(r.id);
        setResults(rs);
        setError(null);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const { data: roomData, error: roomErr } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode.toUpperCase())
        .maybeSingle();
      if (roomErr) throw roomErr;
      if (!roomData) {
        setError('ไม่พบห้องนี้');
        setRoom(null);
        setPlayers([]);
        setResults([]);
        setLoading(false);
        return;
      }
      setRoom(roomData);

      const { data: playerData, error: playerErr } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomData.id)
        .order('last_seen', { ascending: true });
      if (playerErr) throw playerErr;
      setPlayers(playerData || []);

      const { data: resultData, error: resultErr } = await supabase
        .from('round_results')
        .select('*')
        .eq('room_id', roomData.id)
        .order('round_number', { ascending: true });
      if (resultErr) throw resultErr;
      setResults(resultData || []);

      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [roomCode, local]);

  // Initial load + เมื่อ roomCode เปลี่ยน
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Realtime subscription
  useEffect(() => {
    if (!room) return;

    if (local) {
      // subscribe ผ่าน localStorage events + BroadcastChannel
      const refreshAll = async () => {
        const r = await localStore.getRoomByCode(room.code);
        if (!r) {
          setRoom(null);
          return;
        }
        setRoom(r);
        setPlayers(await localStore.getPlayersByRoom(r.id));
        setResults(await localStore.getResultsByRoom(r.id));
      };
      const unsub = subscribeToStore(refreshAll);
      return unsub;
    }

    const channel = supabase.channel(`room:${room.code}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setRoom(null);
            return;
          }
          setRoom(payload.new);
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setPlayers((prev) => {
            if (payload.eventType === 'INSERT') {
              if (prev.some((p) => p.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((p) => (p.id === payload.new.id ? payload.new : p));
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter((p) => p.id !== payload.old.id);
            }
            return prev;
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'round_results',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setResults((prev) => {
            if (payload.eventType === 'INSERT') {
              if (prev.some((r) => r.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((r) => (r.id === payload.new.id ? payload.new : r));
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, room?.code, local]);

  return { room, players, results, loading, error, refresh: fetchAll };
}