import { LEVELS } from '../lib/boards.js';

export function LevelSelector({
  value,
  onChange,
  bestScores = {},
}) {
  return (
    <div className="grid gap-2">
      {LEVELS.map((lv) => {
        const selected = value === lv.id;
        const best = bestScores[lv.id];
        return (
          <label
            key={lv.id}
            className={`
              flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer
              ${
                selected
                  ? 'bg-gradient-to-r from-mustard-soft to-peach-soft ring-2 ring-rust shadow-soft-lg hover-bounce'
                  : 'bg-cream/80 ring-2 ring-sage-soft hover:ring-rust hover-bounce'
              }
            `}
          >
            <input
              type="radio"
              name="lvl"
              value={lv.id}
              checked={selected}
              onChange={() => onChange?.(lv.id)}
              className="accent-rust w-5 h-5"
            />
            <div className="text-2xl">
              {lv.id === 1 ? '🌱' : lv.id === 2 ? '🌷' : lv.id === 3 ? '💎' : '👑'}
            </div>
            <div className="flex-1">
              <div className="font-bold text-forest flex items-center gap-2">
                {lv.label}
              </div>
              <div className="text-xs text-sage font-medium">
                {lv.description}
              </div>
            </div>
            {best !== undefined && best > 0 && (
              <div className="text-right">
                <div className="text-[10px] text-sage uppercase tracking-wider font-bold">
                  Best
                </div>
                <div className="text-base font-extrabold text-rust tabular-nums">
                  {best}
                </div>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}