import { useState } from 'react';

// =========================================================
// Simple SVG diagrams for beginners
// =========================================================

// Diagram 1: Before → After (สิ่งที่เกิดขึ้น)
function DiagramJump() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-cream rounded-2xl p-4 my-3">
      <div className="text-xs text-amber-700 font-extrabold uppercase tracking-wider text-center mb-2">
        กดปุ่ม → เกิดอะไรขึ้น?
      </div>
      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Before */}
        <div>
          <div className="text-center text-xs text-purple-600 font-bold mb-1.5">ก่อนกด</div>
          <div className="flex items-center justify-center gap-1.5">
            <PegSvg />
            <PegSvg />
            <HoleSvg />
          </div>
        </div>
        {/* Arrow */}
        <div>
          <div className="text-center text-xs text-purple-600 font-bold mb-1.5">หลังกด</div>
          <div className="flex items-center justify-center gap-1.5">
            <HoleSvg />
            <PegSvg />
            <PegSvg />
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-purple-600 font-medium mt-3">
        ↳ ลูกหมุด<strong className="text-coral">ข้าม</strong>ไป → ลูกหมุด<strong className="text-coral">หาย</strong>
      </div>
    </div>
  );
}

// Diagram 2: 4 directions (ทิศที่ขยับได้)
function DiagramDirections() {
  return (
    <div className="bg-gradient-to-br from-sky/30 to-lavender/30 rounded-2xl p-4 my-3">
      <div className="text-xs text-purple-700 font-extrabold uppercase tracking-wider text-center mb-2">
        ขยับได้ 4 ทิศ
      </div>
      <svg viewBox="0 0 200 130" className="w-full max-w-xs mx-auto">
        {/* center hole */}
        <circle cx="100" cy="65" r="20" fill="#3a2f2a" />
        <text x="100" y="69" textAnchor="middle" fontSize="11" fill="#fff8f0" fontWeight="bold">?</text>
        {/* 4 directions */}
        <g>
          <circle cx="100" cy="20" r="18" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <circle cx="100" cy="20" r="14" fill="none" stroke="#92400e" strokeWidth="1" />
        </g>
        <g>
          <circle cx="100" cy="110" r="18" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
        </g>
        <g>
          <circle cx="25" cy="65" r="18" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
        </g>
        <g>
          <circle cx="175" cy="65" r="18" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
        </g>
        {/* arrows */}
        <path d="M 100 42 L 100 38" stroke="#d94f7f" strokeWidth="2.5" markerEnd="url(#ar)" />
        <path d="M 100 88 L 100 92" stroke="#d94f7f" strokeWidth="2.5" markerEnd="url(#ar)" />
        <path d="M 47 65 L 43 65" stroke="#d94f7f" strokeWidth="2.5" markerEnd="url(#ar)" />
        <path d="M 153 65 L 157 65" stroke="#d94f7f" strokeWidth="2.5" markerEnd="url(#ar)" />
        {/* labels */}
        <text x="100" y="10" textAnchor="middle" fontSize="10" fill="#7a6b8c" fontWeight="bold">↑</text>
        <text x="100" y="128" textAnchor="middle" fontSize="10" fill="#7a6b8c" fontWeight="bold">↓</text>
        <text x="12" y="68" textAnchor="middle" fontSize="10" fill="#7a6b8c" fontWeight="bold">←</text>
        <text x="188" y="68" textAnchor="middle" fontSize="10" fill="#7a6b8c" fontWeight="bold">→</text>
        <defs>
          <marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#d94f7f" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

// Small SVG components
function PegSvg({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
      <circle cx="20" cy="14" r="3" fill="white" opacity="0.5" />
    </svg>
  );
}

function HoleSvg({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill="#3a2f2a" />
    </svg>
  );
}

// =========================================================
// Main HowToPlay component
// =========================================================

export function HowToPlay({ trigger = 'button' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger === 'button' && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-full bg-white/80 shadow-soft hover-bounce ring-2 ring-lavender-soft text-purple-700 font-bold text-sm"
        >
          📖 วิธีเล่น
        </button>
      )}
      {trigger === 'inline' && (
        <div className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 border-2 border-lavender-soft mb-6">
          <HowToPlayContent />
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-soft-lg rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto animate-pop-in border-4 border-rose/30"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-extrabold text-gradient-rose">
                📖 วิธีเล่น
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-cream hover:bg-cream-dark text-purple-700 font-extrabold text-lg flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <HowToPlayContent />
          </div>
        </div>
      )}
    </>
  );
}

function HowToPlayContent() {
  return (
    <div className="space-y-5 text-purple-800">
      {/* HERO: เป้าหมาย */}
      <div className="bg-gradient-to-r from-coral to-rose rounded-2xl p-5 text-white text-center shadow-pop">
        <div className="text-5xl mb-2">🎯</div>
        <div className="text-2xl font-extrabold mb-1">เป้าหมาย</div>
        <div className="text-base font-bold">เหลือลูกหมุด <span className="text-3xl mx-1">1</span> ตัว</div>
        <div className="text-sm opacity-90 mt-1">จากทั้งหมด 24–48 ตัว</div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 py-2 bg-cream/50 rounded-xl">
        <div className="flex items-center gap-2">
          <PegSvg size={24} />
          <span className="font-bold text-sm">= ลูกหมุด</span>
        </div>
        <div className="flex items-center gap-2">
          <HoleSvg size={24} />
          <span className="font-bold text-sm">= หลุม</span>
        </div>
      </div>

      {/* STEP 1 */}
      <Step
        number={1}
        title="คลิกลูกหมุดที่อยากขยับ"
        detail="ลูกหมุดที่ถูกเลือกจะมีวงกลมสีเหลืองล้อมรอบ"
        icon="👆"
      />

      {/* STEP 2 - มี diagram */}
      <Step
        number={2}
        title="คลิกหลุมว่างที่อยู่ติดกัน"
        detail="ลูกหมุดจะกระโดดข้ามไป และลูกหมุดที่อยู่ตรงกลางจะหายไป"
        icon="👆"
      >
        <DiagramJump />
      </Step>

      {/* STEP 3 - ทิศ */}
      <Step
        number={3}
        title="เลือกทิศที่จะขยับ"
        detail="ขึ้น / ลง / ซ้าย / ขวา — ห้ามเฉียง!"
        icon="↕️"
      >
        <DiagramDirections />
      </Step>

      {/* Tips box */}
      <div className="bg-gradient-to-r from-mint-soft to-cream rounded-2xl p-4 border-2 border-mint-dark/30">
        <div className="font-extrabold text-emerald-700 mb-1">💡 เคล็ดลับ</div>
        <div className="text-sm text-emerald-800">
          จบเร็ว = ได้คะแนนโบนัส (วินาทีที่เหลือ ÷ 5)
        </div>
      </div>

      {/* Scorebox */}
      <div className="bg-gradient-to-br from-sunshine/40 to-peach/40 rounded-2xl p-4 border-2 border-sunshine">
        <div className="font-extrabold text-rose-dark mb-2 text-center">🏆 คะแนน</div>
        <div className="text-sm space-y-1 text-purple-800">
          <div className="flex justify-between bg-white/60 rounded-lg px-2 py-1">
            <span>เหลือ 1 peg</span>
            <strong className="text-emerald-600">+100</strong>
          </div>
          <div className="flex justify-between bg-white/60 rounded-lg px-2 py-1">
            <span>จบเร็ว</span>
            <strong className="text-emerald-600">+โบนัส</strong>
          </div>
          <div className="flex justify-between bg-white/60 rounded-lg px-2 py-1">
            <span>ใช้คำใบ้</span>
            <strong className="text-coral">-50 ต่อครั้ง</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, detail, icon, children }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-coral to-rose text-white font-extrabold text-lg flex items-center justify-center shadow-pop">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{icon}</span>
          <span className="font-extrabold text-purple-800 text-base">{title}</span>
        </div>
        <div className="text-sm text-purple-600 leading-relaxed mb-1">{detail}</div>
        {children}
      </div>
    </div>
  );
}