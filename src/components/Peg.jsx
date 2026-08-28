import { memo } from 'react';

function PegComponent({
  state,
  row,
  col,
  size = 56,
  selected = false,
  hintFrom = false,
  hintTo = false,
  onClick,
}) {
  if (state === null) {
    return (
      <div
        style={{ width: size, height: size }}
        className="opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  // Peg: wood-tone ลูกหมุดไม้ ดูอบอุ่น ไม่กันกับ background
  const baseColor =
    state === 1
      ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500'
      : 'bg-[#3a2f2a]';

  // ring + selected/hint ใช้สีเน้นที่อ่านง่าย
  const ringState = selected
    ? 'ring-[6px] ring-sunshine shadow-[0_0_0_3px_rgba(255,224,130,0.4)]'
    : hintFrom
      ? 'ring-[6px] ring-sky animate-pulse'
      : hintTo
        ? 'ring-[6px] ring-sky animate-pulse'
        : '';

  // hover scale เล็กน้อย ไม่ bounce เพื่อไม่ให้ดูลอย
  const cursor = state === 1
    ? 'cursor-pointer hover:scale-105 active:scale-95'
    : 'cursor-default';

  // Peg มี shadow ใต้ (ดูวางบนกระดาน) + inner gradient เบาๆ
  const pegStyle = state === 1 ? {
    boxShadow:
      'inset 0 -3px 6px rgba(120, 60, 20, 0.35), ' +  // shadow ด้านล่าง (ดูเป็นมิติ)
      'inset 0 2px 3px rgba(255, 255, 255, 0.6), ' +   // highlight ด้านบนเบาๆ
      '0 3px 8px rgba(0, 0, 0, 0.3), ' +              // drop shadow ใต้ peg (วางบนกระดาน)
      '0 1px 2px rgba(0, 0, 0, 0.2)',                  // tight shadow ที่ฐาน
  } : {
    // Empty hole: ดูเป็นรูบนกระดานไม้
    boxShadow:
      'inset 0 2px 4px rgba(0, 0, 0, 0.5), ' +
      'inset 0 -1px 2px rgba(0, 0, 0, 0.3)',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: size, height: size, ...pegStyle }}
      className={`
        relative rounded-full transition-transform duration-150
        ${baseColor} ${ringState} ${cursor}
      `}
      data-row={row}
      data-col={col}
      data-state={state}
      aria-label={state === 1 ? `peg ที่ ${row},${col}` : `hole ที่ ${row},${col}`}
    >
      {state === 1 && (
        // subtle highlight เบาๆ — ไม่ glossy เกินไป
        <span className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />
      )}
    </button>
  );
}

export const Peg = memo(PegComponent);