import { useState } from 'react';

// =========================================================
// Diagram components — แสดงการ move ด้วย SVG เล็กๆ
// =========================================================

function DiagramMove() {
  // แสดง move แบบ: peg → over → empty
  const size = 32;
  const gap = 6;
  return (
    <svg viewBox={`0 0 ${size * 3 + gap * 2} ${size}`} className="w-full max-w-[260px] h-auto my-2">
      {/* peg from (highlighted) */}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
      <circle cx={size / 2} cy={size / 2 - 4} r={3} fill="white" opacity="0.5" />
      {/* peg over (will be removed) */}
      <circle cx={size / 2 + size + gap} cy={size / 2} r={size / 2 - 2} fill="#f5d0a0" stroke="#92400e" strokeWidth="2" opacity="0.5" />
      <line x1={size / 2 + 5} y1={size / 2 - 8} x2={size / 2 + size + gap - 5} y2={size / 2 - 8} stroke="#d94f7f" strokeWidth="2.5" />
      {/* empty hole (target) */}
      <circle cx={size / 2 + (size + gap) * 2} cy={size / 2} r={size / 2 - 2} fill="#3a2f2a" />
      {/* arrow */}
      <path d={`M ${size + 4} ${size / 2} L ${(size + gap) * 2 - 4} ${size / 2}`} stroke="#d94f7f" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d94f7f" />
        </marker>
      </defs>
    </svg>
  );
}

function DiagramBeforeAfter() {
  // before: ● ● ○
  // after:  ○ ● ●
  const size = 32;
  const gap = 6;
  const w = size * 3 + gap * 2;

  return (
    <div className="grid grid-cols-2 gap-3 my-2">
      <div>
        <div className="text-xs text-purple-500 font-bold mb-1 text-center">ก่อน</div>
        <svg viewBox={`0 0 ${w} ${size}`} className="w-full max-w-[240px]">
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <circle cx={size / 2} cy={size / 2 - 4} r={3} fill="white" opacity="0.5" />
          <circle cx={size / 2 + size + gap} cy={size / 2} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <circle cx={size / 2 + size + gap} cy={size / 2 - 4} r={3} fill="white" opacity="0.5" />
          <circle cx={size / 2 + (size + gap) * 2} cy={size / 2} r={size / 2 - 2} fill="#3a2f2a" />
        </svg>
      </div>
      <div>
        <div className="text-xs text-purple-500 font-bold mb-1 text-center">หลัง</div>
        <svg viewBox={`0 0 ${w} ${size}`} className="w-full max-w-[240px]">
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#3a2f2a" />
          <circle cx={size / 2 + size + gap} cy={size / 2} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <circle cx={size / 2 + size + gap} cy={size / 2 - 4} r={3} fill="white" opacity="0.5" />
          <circle cx={size / 2 + (size + gap) * 2} cy={size / 2} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <circle cx={size / 2 + (size + gap) * 2} cy={size / 2 - 4} r={3} fill="white" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function Diagram4Directions() {
  const size = 32;
  const gap = 4;
  const cx = size + gap;
  const cy = size + gap;
  return (
    <svg viewBox={`0 0 ${size * 2 + gap * 2} ${size * 2 + gap * 2}`} className="w-32 h-32 my-2 mx-auto">
      {/* center hole */}
      <circle cx={cx} cy={cy} r={size / 2 - 2} fill="#3a2f2a" />
      {/* 4 directions */}
      <circle cx={cx} cy={gap + size / 2} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" /> {/* up */}
      <circle cx={cx} cy={cy + size + gap} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" /> {/* down */}
      <circle cx={gap + size / 2} cy={cy} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" /> {/* left */}
      <circle cx={cx + size + gap} cy={cy} r={size / 2 - 2} fill="#fbbf24" stroke="#92400e" strokeWidth="2" /> {/* right */}
      {/* arrows */}
      <path d={`M ${cx} ${size + 2} L ${cx} ${gap + size - 2}`} stroke="#d94f7f" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <path d={`M ${cx} ${cy + 2} L ${cx} ${cy + size + gap - 2}`} stroke="#d94f7f" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <path d={`M ${size + 2} ${cy} L ${gap + size - 2} ${cy}`} stroke="#d94f7f" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <path d={`M ${cx + 2} ${cy} L ${cx + size + gap - 2} ${cy}`} stroke="#d94f7f" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <defs>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#d94f7f" />
        </marker>
      </defs>
    </svg>
  );
}

function DiagramScoreBoard() {
  return (
    <div className="bg-white/70 rounded-2xl p-3 my-2 space-y-1 text-sm">
      <div className="flex justify-between items-center">
        <span>🎯 ชนะ (เหลือ 1 peg)</span>
        <strong className="text-emerald-600">+100</strong>
      </div>
      <div className="flex justify-between items-center">
        <span>⏰ จบเร็ว (เหลือ 60s)</span>
        <strong className="text-emerald-600">+12</strong>
      </div>
      <div className="flex justify-between items-center">
        <span>💡 ใช้คำใบ้ 1 ครั้ง</span>
        <strong className="text-coral">-50</strong>
      </div>
      <div className="border-t-2 border-lavender-soft pt-1 mt-2 flex justify-between items-center">
        <span className="font-extrabold">🏆 รวม</span>
        <strong className="text-rose-dark text-lg">62 คะแนน</strong>
      </div>
    </div>
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
    <div className="space-y-4 text-purple-800">
      <p className="font-bold text-base">
        🎯 เป้าหมาย: <span className="text-rose-dark">เหลือลูกหมุด 1 ตัว</span> ให้ได้!
      </p>

      <Rule
        icon="🟡"
        title="ลูกหมุดคืออะไร?"
        body={
          <>
            <div className="flex items-center gap-3 my-2">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
                <circle cx="20" cy="14" r="3" fill="white" opacity="0.5" />
              </svg>
              <span>= ลูกหมุด (peg) · คลิกเพื่อย้าย</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" fill="#3a2f2a" />
              </svg>
              <span>= หลุมว่าง (hole)</span>
            </div>
          </>
        }
      />

      <Rule
        icon="➡️"
        title="วิธีเคลื่อนลูกหมุด"
        body={
          <>
            <p className="mb-2">
              ลูกหมุดจะ <strong>กระโดดข้ามลูกหมุดตัวที่อยู่ติดกัน</strong> ไปลงหลุมว่าง
              <br />
              <span className="text-coral font-bold">ลูกหมุดที่ถูกข้ามจะหายไป</span>
            </p>
            <DiagramBeforeAfter />
            <ol className="text-sm space-y-1 mt-2">
              <li><strong>1.</strong> คลิกลูกหมุดที่ต้องการขยับ (จะมีวงกลมสีเหลืองล้อมรอบ)</li>
              <li><strong>2.</strong> คลิกหลุมว่างที่อยู่ติดกัน (ผ่านลูกหมุดตัวกลาง)</li>
              <li><strong>3.</strong> ลูกหมุดจะกระโดดข้าม ลูกหมุดตัวกลางหายไป</li>
            </ol>
          </>
        }
      />

      <Rule
        icon="↕️"
        title="ทิศที่ขยับได้"
        body={
          <>
            <p>เลื่อนได้ 4 ทิศ ไม่ใช่ทแยง:</p>
            <Diagram4Directions />
          </>
        }
      />

      <Rule
        icon="💡"
        title="คำใบ้"
        body={
          <>
            กดปุ่ม <strong>💡 คำใบ้</strong> เพื่อดู move ที่ดีที่สุด แต่จะ <span className="text-coral font-bold">หักคะแนน</span> ตามที่ Host ตั้งไว้
          </>
        }
      />

      <Rule
        icon="🏆"
        title="คะแนน"
        body={
          <>
            <p className="mb-2">คะแนนของคุณคำนวณจาก:</p>
            <DiagramScoreBoard />
          </>
        }
      />

      <div className="bg-gradient-to-r from-mint-soft to-cream rounded-2xl p-3 mt-4">
        <p className="text-sm text-purple-700 font-medium">
          💡 <strong>เคล็ดลับ:</strong> ดูว่าแถวไหนมีลูกหมุดแน่นๆ ลองกระโดดออกด้านนอกก่อนเพื่อเปิดทางให้ลูกหมุดอื่น!
        </p>
      </div>
    </div>
  );
}

function Rule({ icon, title, body }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="font-extrabold text-purple-800 mb-1">{title}</div>
        <div className="text-sm text-purple-700 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}