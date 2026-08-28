import { useState } from 'react';

function PegSvg({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill="#efb746" stroke="#3a2f2a" strokeWidth="2" />
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

function DiagramJump() {
  return (
    <div className="bg-gradient-to-br from-mustard-soft to-cream rounded-2xl p-4 my-3 border-2 border-mustard-soft">
      <div className="text-xs text-rust font-extrabold uppercase tracking-wider text-center mb-2">
        กดปุ่ม → เกิดอะไรขึ้น?
      </div>
      <div className="grid grid-cols-2 gap-3 items-center">
        <div>
          <div className="text-center text-xs text-forest font-bold mb-1.5">ก่อนกด</div>
          <div className="flex items-center justify-center gap-1.5">
            <PegSvg />
            <PegSvg />
            <HoleSvg />
          </div>
        </div>
        <div>
          <div className="text-center text-xs text-forest font-bold mb-1.5">หลังกด</div>
          <div className="flex items-center justify-center gap-1.5">
            <HoleSvg />
            <PegSvg />
            <PegSvg />
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-forest font-medium mt-3">
        ↳ ลูกหมุด<strong className="text-rust">ข้าม</strong>ไป → ลูกหมุด<strong className="text-rust">หาย</strong>
      </div>
    </div>
  );
}

function DiagramDirections() {
  return (
    <div className="bg-gradient-to-br from-sage-soft to-sage rounded-2xl p-4 my-3 border-2 border-sage">
      <div className="text-xs text-forest font-extrabold uppercase tracking-wider text-center mb-2">
        ขยับได้ 4 ทิศ
      </div>
      <svg viewBox="0 0 200 130" className="w-full max-w-xs mx-auto">
        <circle cx="100" cy="65" r="20" fill="#3a2f2a" />
        <text x="100" y="69" textAnchor="middle" fontSize="11" fill="#fff8f0" fontWeight="bold">?</text>
        <g>
          <circle cx="100" cy="20" r="18" fill="#efb746" stroke="#3a2f2a" strokeWidth="2" />
        </g>
        <g>
          <circle cx="100" cy="110" r="18" fill="#efb746" stroke="#3a2f2a" strokeWidth="2" />
        </g>
        <g>
          <circle cx="25" cy="65" r="18" fill="#efb746" stroke="#3a2f2a" strokeWidth="2" />
        </g>
        <g>
          <circle cx="175" cy="65" r="18" fill="#efb746" stroke="#3a2f2a" strokeWidth="2" />
        </g>
        <path d="M 100 42 L 100 38" stroke="#b94d27" strokeWidth="2.5" markerEnd="url(#ar)" />
        <path d="M 100 88 L 100 92" stroke="#b94d27" strokeWidth="2.5" markerEnd="url(#ar)" />
        <path d="M 47 65 L 43 65" stroke="#b94d27" strokeWidth="2.5" markerEnd="url(#ar)" />
        <path d="M 153 65 L 157 65" stroke="#b94d27" strokeWidth="2.5" markerEnd="url(#ar)" />
        <text x="100" y="10" textAnchor="middle" fontSize="10" fill="#546046" fontWeight="bold">↑</text>
        <text x="100" y="128" textAnchor="middle" fontSize="10" fill="#546046" fontWeight="bold">↓</text>
        <text x="12" y="68" textAnchor="middle" fontSize="10" fill="#546046" fontWeight="bold">←</text>
        <text x="188" y="68" textAnchor="middle" fontSize="10" fill="#546046" fontWeight="bold">→</text>
        <defs>
          <marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#b94d27" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

export function HowToPlay({ trigger = 'button' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger === 'button' && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-full bg-cream shadow-soft hover-bounce ring-2 ring-sage-soft text-forest font-bold text-sm"
        >
          📖 วิธีเล่น
        </button>
      )}
      {trigger === 'inline' && (
        <div className="bg-cream/80 backdrop-blur shadow-soft-lg rounded-3xl p-6 border-2 border-sage-soft mb-6">
          <HowToPlayContent />
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bark/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream shadow-soft-lg rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto animate-pop-in border-4 border-mustard-soft"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-extrabold text-gradient-rose">
                📖 วิธีเล่น
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-cream-dark hover:bg-mustard-soft text-forest font-extrabold text-lg flex items-center justify-center"
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
    <div className="space-y-5 text-bark">
      <div className="bg-gradient-to-r from-rust to-terracotta rounded-2xl p-5 text-cream text-center shadow-pop">
        <div className="text-5xl mb-2">🎯</div>
        <div className="text-2xl font-extrabold mb-1">เป้าหมาย</div>
        <div className="text-base font-bold">เหลือลูกหมุด <span className="text-3xl mx-1">1</span> ตัว</div>
        <div className="text-sm opacity-90 mt-1">จากทั้งหมด 24–48 ตัว</div>
      </div>

      <div className="flex items-center justify-center gap-6 py-2 bg-cream-dark/50 rounded-xl">
        <div className="flex items-center gap-2">
          <PegSvg size={24} />
          <span className="font-bold text-sm">= ลูกหมุด</span>
        </div>
        <div className="flex items-center gap-2">
          <HoleSvg size={24} />
          <span className="font-bold text-sm">= หลุม</span>
        </div>
      </div>

      <Step
        number={1}
        title="คลิกลูกหมุดที่อยากขยับ"
        detail="ลูกหมุดที่ถูกเลือกจะมีวงกลมสีเหลืองล้อมรอบ"
        icon="👆"
      />

      <Step
        number={2}
        title="คลิกหลุมว่างที่อยู่ติดกัน"
        detail="ลูกหมุดจะกระโดดข้ามไป และลูกหมุดที่อยู่ตรงกลางจะหายไป"
        icon="👆"
      >
        <DiagramJump />
      </Step>

      <Step
        number={3}
        title="เลือกทิศที่จะขยับ"
        detail="ขึ้น / ลง / ซ้าย / ขวา — ห้ามเฉียง!"
        icon="↕️"
      >
        <DiagramDirections />
      </Step>

      <div className="bg-gradient-to-r from-sage-soft to-sage rounded-2xl p-4 border-2 border-sage">
        <div className="font-extrabold text-forest mb-1">💡 เคล็ดลับ</div>
        <div className="text-sm text-bark">
          จบเร็ว = ได้คะแนนโบนัส (วินาทีที่เหลือ ÷ 5)
        </div>
      </div>

      <div className="bg-gradient-to-br from-mustard-soft to-peach-soft rounded-2xl p-4 border-2 border-mustard">
        <div className="font-extrabold text-rust mb-2 text-center">🏆 คะแนน</div>
        <div className="text-sm space-y-1 text-bark">
          <div className="flex justify-between bg-cream/70 rounded-lg px-2 py-1">
            <span>เหลือ 1 peg</span>
            <strong className="text-forest">+100</strong>
          </div>
          <div className="flex justify-between bg-cream/70 rounded-lg px-2 py-1">
            <span>จบเร็ว</span>
            <strong className="text-forest">+โบนัส</strong>
          </div>
          <div className="flex justify-between bg-cream/70 rounded-lg px-2 py-1">
            <span>ใช้คำใบ้</span>
            <strong className="text-rust">-50 ต่อครั้ง</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, detail, icon, children }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-rust to-terracotta text-cream font-extrabold text-lg flex items-center justify-center shadow-pop">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{icon}</span>
          <span className="font-extrabold text-forest text-base">{title}</span>
        </div>
        <div className="text-sm text-forest/80 leading-relaxed mb-1">{detail}</div>
        {children}
      </div>
    </div>
  );
}