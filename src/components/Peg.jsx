import { memo } from 'react';

function PegComponent({
  state,
  row,
  col,
  size = 56,
  selected = false,
  validTarget = false,   // หลุมที่ขยับได้เมื่อคลิก peg
  overJump = false,      // peg ตัวที่จะถูกลบ
  hintFrom = false,
  hintTo = false,
  hintOver = false,
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

  // peg: ลูกหมุดไม้
  const baseColor =
    state === 1
      ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500'
      : 'bg-[#3a2f2a]';

  // priority: hint > selected > overJump > validTarget > normal
  let ringState = '';
  if (state === 1) {
    if (hintFrom)
      ringState = 'ring-[6px] ring-mustard shadow-[0_0_20px_rgba(239,183,70,0.8)] animate-pulse';
    else if (selected)
      ringState = 'ring-[6px] ring-mustard shadow-[0_0_0_3px_rgba(239,183,70,0.4)]';
    else if (overJump)
      ringState = 'ring-[5px] ring-rust animate-pulse';
    else if (hintOver)
      ringState = 'ring-[5px] ring-rust';
  } else {
    // หลุมว่าง
    if (hintTo)
      ringState = 'ring-[6px] ring-mustard shadow-[0_0_20px_rgba(239,183,70,0.8)] animate-pulse';
    else if (validTarget)
      ringState = 'ring-[5px] ring-sage animate-pulse';
  }

  const cursor =
    state === 1
      ? 'cursor-pointer hover:scale-105 active:scale-95'
      : validTarget
        ? 'cursor-pointer hover:scale-110 active:scale-95'
        : 'cursor-default';

  const pegStyle = state === 1
    ? {
        boxShadow:
          'inset 0 -3px 6px rgba(120, 60, 20, 0.35), ' +
          'inset 0 2px 3px rgba(255, 255, 255, 0.6), ' +
          '0 3px 8px rgba(0, 0, 0, 0.3), ' +
          '0 1px 2px rgba(0, 0, 0, 0.2)',
      }
: validTarget
        ? {
            boxShadow:
              'inset 0 2px 4px rgba(0, 0, 0, 0.5), ' +
              'inset 0 -1px 2px rgba(0, 0, 0, 0.3), ' +
              '0 0 12px rgba(112, 153, 139, 0.6)', // glow เขียว sage
          }
      : {
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
      {/* ลูกหมุด: subtle highlight + optional dot เขียวบอก valid target */}
      {state === 1 && !validTarget && (
        <span className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />
      )}
      {/* validTarget (หลุมว่าง) → dot เขียว pulse ตรงกลาง */}
      {state === 0 && validTarget && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-3 h-3 rounded-full bg-sage animate-pulse shadow-[0_0_8px_rgba(112,153,139,0.9)]" />
        </span>
      )}
      {/* overJump (peg ที่จะถูกลบ) → กากบาท X */}
      {state === 1 && overJump && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white font-extrabold text-2xl drop-shadow">×</span>
        </span>
      )}
      {/* hintOver → กากบาทด้วย */}
      {state === 1 && hintOver && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white font-extrabold text-2xl drop-shadow">×</span>
        </span>
      )}
    </button>
  );
}

export const Peg = memo(PegComponent);