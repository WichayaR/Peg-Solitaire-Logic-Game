import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getOrCreatePersistentId } from '../lib/roomCode.js';

const PlayerContext = createContext(null);

const NICKNAME_KEY = 'peg-solitaire:nickname';

export function PlayerProvider({ children }) {
  const [persistentId] = useState(() => getOrCreatePersistentId());
  const [nickname, setNicknameState] = useState(() => {
    return localStorage.getItem(NICKNAME_KEY) || '';
  });

  useEffect(() => {
    if (nickname) localStorage.setItem(NICKNAME_KEY, nickname);
  }, [nickname]);

  const value = useMemo(
    () => ({
      persistentId,
      nickname,
      setNickname: setNicknameState,
      clearNickname: () => {
        localStorage.removeItem(NICKNAME_KEY);
        setNicknameState('');
      },
    }),
    [persistentId, nickname],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}