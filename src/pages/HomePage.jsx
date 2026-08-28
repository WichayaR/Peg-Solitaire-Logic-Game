import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { loadProgression } from '../lib/progression.js';
import { HowToPlay } from '../components/HowToPlay.jsx';

export function HomePage() {
  const { nickname, setNickname } = usePlayer();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('peg-solitaire:persistent-id');
    if (stored) setProgress(loadProgression(stored));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('nickname')?.toString().trim() || '';
    if (!name) return;
    setNickname(name);
  }

  return (
    <div className="min-h-screen text-bark">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="text-center mb-10 animate-float-up">
          <div className="text-7xl mb-3 animate-wiggle inline-block">🧩</div>
          <h1 className="text-6xl font-extrabold tracking-tight mb-3 text-gradient-rose">
            Peg Solitaire
          </h1>
          <p className="text-forest text-lg font-semibold">
            ✨ เกมปริศนาฝึกสมอง · แข่งกับเพื่อนได้ทุกที่ ✨
          </p>
          <HowToPlay trigger="button" />
        </header>

        {progress && progress.totalGames > 0 && (
          <div className="bg-cream/80 backdrop-blur shadow-soft-lg rounded-3xl p-5 mb-6 animate-float-up border-2 border-mustard-soft">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wider text-sage font-bold">
                  ⭐ สถิติของคุณ
                </div>
                <div className="text-xl font-bold text-forest mt-1">
                  {progress.highestCleared > 0
                    ? `🏆 ด่านสูงสุดที่ผ่าน: ${progress.highestCleared}`
                    : `🌱 เริ่มต้นเล่นด่านแรก`}
                </div>
              </div>
              <div className="flex gap-5 text-sm">
                <Stat label="ชนะ" value={progress.totalWins} />
                <Stat label="เล่น" value={progress.totalGames} />
                <Stat
                  label="อัตราชนะ"
                  value={
                    progress.totalGames > 0
                      ? `${Math.round((progress.totalWins / progress.totalGames) * 100)}%`
                      : '–'
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-cream/80 backdrop-blur shadow-soft-lg rounded-3xl p-6 mb-6 border-2 border-sage-soft">
          <h2 className="text-lg font-bold text-forest mb-3">
            ✏️ ตั้งชื่อนักผจญภัย
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              name="nickname"
              defaultValue={nickname}
              placeholder="พิมพ์ชื่อเล่นของคุณ..."
              maxLength={20}
              className="flex-1 px-5 py-3 rounded-2xl bg-cream border-2 border-sage-soft focus:border-rust outline-none text-bark placeholder-sage font-medium transition"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-terracotta to-rust text-cream font-bold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
            >
              บันทึก ✓
            </button>
          </form>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Link
            to="/create"
            className="group block p-6 rounded-3xl bg-gradient-to-br from-sage-soft to-sage shadow-soft hover:shadow-soft-lg hover-bounce border-2 border-sage/40 transition-all"
          >
            <div className="text-5xl mb-2 inline-block group-hover:animate-wiggle">
              🏆
            </div>
            <div className="text-2xl font-extrabold text-forest mb-1">
              สร้างห้องประลอง
            </div>
            <p className="text-sm text-forest/80 font-medium">
              ตั้งค่าด่าน/เวลา/คำใบ้ · แชร์รหัสเชิญเพื่อน
            </p>
          </Link>

          <Link
            to="/join"
            className="group block p-6 rounded-3xl bg-gradient-to-br from-mustard-soft to-mustard shadow-soft hover:shadow-soft-lg hover-bounce border-2 border-mustard/40 transition-all"
          >
            <div className="text-5xl mb-2 inline-block group-hover:animate-wiggle">
              🔗
            </div>
            <div className="text-2xl font-extrabold text-bark mb-1">
              มาเล่นด้วยกัน
            </div>
            <p className="text-sm text-bark/70 font-medium">
              กรอกรหัส 6 ตัวจากเพื่อน · เล่นได้เลย!
            </p>
          </Link>

          <Link
            to="/solo"
            className="group block p-6 rounded-3xl bg-gradient-to-br from-peach-soft to-terracotta shadow-soft hover:shadow-soft-lg hover-bounce border-2 border-terracotta/40 transition-all sm:col-span-2"
          >
            <div className="text-5xl mb-2 inline-block group-hover:animate-wiggle">
              🌟
            </div>
            <div className="text-2xl font-extrabold text-rust mb-1">
              ฝึกฝนลำพัง
            </div>
            <p className="text-sm text-rust/80 font-medium">
              ฝึกเล่นคนเดียว · เลือกด่านอะไรก็ได้
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wider text-sage font-bold">
        {label}
      </div>
      <div className="text-xl font-extrabold text-rust tabular-nums">
        {value}
      </div>
    </div>
  );
}