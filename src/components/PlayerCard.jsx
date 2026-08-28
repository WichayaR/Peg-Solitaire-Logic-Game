import { formatScore } from '../lib/scoring.js';

const RANK_BG = {
  1: 'bg-gradient-to-br from-sunshine to-peach text-rose-dark',
  2: 'bg-gradient-to-br from-sky to-lavender-soft text-purple-700',
  3: 'bg-gradient-to-br from-peach to-coral text-white',
};

export function PlayerCard({ player, isMe = false, rank = null, compact = false, showReady = false }) {
  return (
    <div
      className={`
        relative flex items-center gap-3 rounded-2xl transition-all
        ${
          isMe
            ? 'bg-gradient-to-r from-sunshine/40 to-peach/40 ring-2 ring-rose shadow-soft-lg'
            : 'bg-white/70 ring-2 ring-lavender-soft shadow-soft'
        }
        ${compact ? 'p-2' : 'p-3'}
      `}
    >
      {showReady && (
        <div
          className={`
            absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shadow-soft
            ${player.is_ready ? 'bg-gradient-to-br from-mint-dark to-emerald-400 text-white' : 'bg-white text-purple-300'}
          `}
          title={player.is_ready ? 'พร้อมลุย!' : 'ยังไม่พร้อม'}
        >
          {player.is_ready ? '✓' : '…'}
        </div>
      )}
      {rank !== null && (
        <div
          className={`
            ${compact ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}
            rounded-full flex items-center justify-center font-extrabold shadow-soft
            ${RANK_BG[rank] || 'bg-gradient-to-br from-lavender-soft to-cream text-purple-600'}
          `}
        >
          {rank}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`${compact ? 'text-sm' : 'font-bold'} text-purple-800 truncate`}
          >
            {player.nickname}
            {isMe && (
              <span className="ml-1 text-xs text-rose-dark">(คุณ)</span>
            )}
          </span>
          {player.is_host && (
            <span
              className={`${compact ? 'text-[9px] px-1.5' : 'text-[10px] px-2'} py-0.5 rounded-full bg-gradient-to-r from-coral to-rose text-white font-bold uppercase tracking-wide`}
            >
              👑 Host
            </span>
          )}
        </div>
        {!compact && (
          <div className="text-xs text-purple-500 mt-0.5 font-medium">
            Pegs: {player.pegs_remaining} · Rounds: {player.finished_rounds}
          </div>
        )}
      </div>
      <div className="text-right">
        <div className={`${compact ? 'text-[10px]' : 'text-xs'} text-purple-400 font-bold`}>
          คะแนน
        </div>
        <div
          className={`${compact ? 'text-base' : 'text-xl'} font-extrabold text-rose-dark tabular-nums`}
        >
          {formatScore(player.score)}
        </div>
      </div>
    </div>
  );
}