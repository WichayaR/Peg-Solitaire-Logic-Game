import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LevelSelector } from '../components/LevelSelector.jsx';
import { createRoom } from '../lib/api.js';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { useToast } from '../components/ToastHost.jsx';
import { loadProgression } from '../lib/progression.js';
import { getLevelById } from '../lib/boards.js';

export function CreateRoomPage() {
  const navigate = useNavigate();
  const { persistentId, nickname, setNickname } = usePlayer();
  const { push } = useToast();

  const [progress, setProgress] = useState(() => loadProgression(persistentId));
  const [levelId, setLevelId] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [maxRounds, setMaxRounds] = useState(3);
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [hintsAllowed, setHintsAllowed] = useState(true);
  const [hintPenalty, setHintPenalty] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const p = loadProgression(persistentId);
    setProgress(p);
    setLevelId(p.unlockedLevel);
  }, [persistentId]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nickname) {
      push('ตั้งชื่อนักผจญภัยก่อนนะ!', 'error');
      navigate('/');
      return;
    }

    setSubmitting(true);
    const selectedLevel = getLevelById(levelId);
    createRoom({
      hostId: persistentId,
      boardShape: selectedLevel.shape,
      level: levelId,
      timerSeconds,
      maxRounds,
      minPlayers,
      maxPlayers,
      hintsAllowed,
      hintPenalty,
    })
      .then((room) => {
        navigate(`/room/${room.code}`);
      })
      .catch((err) => {
        push('สร้างห้องไม่สำเร็จ: ' + (err.message || err), 'error');
        setSubmitting(false);
      });
  }

  return (
    <div className="min-h-screen text-slate-800">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="text-purple-500 hover:text-purple-800 mb-4 font-bold"
        >
          ← ย้อนกลับ
        </button>

        <h1 className="text-4xl font-extrabold mb-2 text-gradient-rose">
          🎮 ตั้งค่าห้องประลอง
        </h1>
        <p className="text-purple-600 mb-6 font-medium">
          คุณจะเป็นหัวหน้าทีม — แชร์รหัสเชิญเพื่อนมาช่วยสู้!
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 space-y-5 border-2 border-lavender-soft"
        >
          <div>
            <label className="block text-sm font-bold text-purple-700 mb-2">
              ✏️ ชื่อหัวหน้าทีม
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-lavender-soft focus:border-rose outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-purple-700 mb-2">
              🎯 เลือกด่านเริ่มต้น (ด่านถัดไปจะยากขึ้นอัตโนมัติ)
            </label>
            <LevelSelector
              value={levelId}
              onChange={setLevelId}
              bestScores={progress.bestScores}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-purple-700 mb-1">
                ⏰ เวลาต่อรอบ (วิ)
              </label>
              <input
                type="number"
                min={30}
                max={1800}
                step={30}
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-lavender-soft focus:border-rose outline-none"
              />
              <p className="text-xs text-purple-400 mt-1 font-medium">30–1800 วินาที</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-700 mb-1">
                🔄 จำนวนรอบ
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxRounds}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-lavender-soft focus:border-rose outline-none"
              />
              <p className="text-xs text-purple-400 mt-1 font-medium">1–10 รอบ</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-700 mb-1">
                👥 ผู้เล่นขั้นต่ำ
              </label>
              <input
                type="number"
                min={1}
                max={Math.max(maxPlayers - 1, 1)}
                value={minPlayers}
                onChange={(e) => setMinPlayers(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-lavender-soft focus:border-rose outline-none"
              />
              <p className="text-xs text-purple-400 mt-1 font-medium">ขั้นต่ำที่จะเริ่มได้</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-700 mb-1">
                👑 ผู้เล่นสูงสุด
              </label>
              <input
                type="number"
                min={Math.max(minPlayers, 2)}
                max={100}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-lavender-soft focus:border-rose outline-none"
              />
              <p className="text-xs text-purple-400 mt-1 font-medium">2–100 คน</p>
            </div>
          </div>

          <div className="bg-cream/60 rounded-2xl p-4 border-2 border-lavender-soft">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hintsAllowed}
                onChange={(e) => setHintsAllowed(e.target.checked)}
                className="accent-rose w-5 h-5"
              />
              <span className="text-purple-800 font-bold">
                💡 เปิดให้ใช้คำใบ้
              </span>
            </label>
            {hintsAllowed && (
              <div className="mt-3 pl-7">
                <label className="block text-sm text-purple-600 font-bold mb-1">
                  ค่าปรับต่อการใช้คำใบ้
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={hintPenalty}
                  onChange={(e) => setHintPenalty(Number(e.target.value))}
                  className="w-full accent-rose"
                />
                <div className="text-sm text-rose-dark font-extrabold mt-1">
                  -{hintPenalty} คะแนน / คำใบ้
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-coral via-rose to-rose-dark text-white font-extrabold text-lg shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            {submitting ? '⏳ กำลังสร้างห้อง…' : '🚀 สร้างห้องเลย!'}
          </button>
        </form>
      </div>
    </div>
  );
}