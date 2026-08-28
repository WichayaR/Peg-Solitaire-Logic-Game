import { useState } from 'react';
import { PlayerCard } from './PlayerCard.jsx';

export function Scoreboard({ players, persistentId, compact = false, showReady = false }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...players].sort((a, b) => b.score - a.score);

  const visible = compact && !expanded ? sorted.slice(0, 5) : sorted;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm uppercase tracking-wider text-purple-700 font-extrabold">
          🏆 กระดานคะแนน
        </h3>
        <span className="text-xs text-purple-500 font-medium">
          {players.length} คน
        </span>
      </div>
      <div
        className={`
          flex flex-col gap-2
          ${compact && !expanded ? '' : 'max-h-[calc(100vh-200px)] overflow-y-auto pr-1'}
        `}
      >
        {sorted.length === 0 ? (
          <div className="text-sm text-purple-400 px-3 py-4 text-center bg-white/40 rounded-2xl">
            ยังไม่มีผู้เล่น
          </div>
        ) : (
          visible.map((p, i) => (
            <PlayerCard
              key={p.id}
              player={p}
              isMe={p.persistent_id === persistentId}
              rank={i + 1}
              compact={compact}
              showReady={showReady}
            />
          ))
        )}
      </div>
      {compact && sorted.length > 5 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs text-purple-600 hover:text-purple-800 px-3 py-2 rounded-full bg-white/60 hover:bg-white shadow-soft font-bold"
        >
          {expanded
            ? '▲ ย่อ'
            : `▼ ดูทั้งหมด (${sorted.length} คน)`}
        </button>
      )}
    </div>
  );
}