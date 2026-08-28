import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom.js';
import { PlayerCard } from '../components/PlayerCard.jsx';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { formatScore } from '../lib/scoring.js';

export function ResultPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { persistentId } = usePlayer();
  const { room, players, results, loading } = useRoom(code);

  const ranked = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const myRank = useMemo(() => {
    const idx = ranked.findIndex((p) => p.persistent_id === persistentId);
    return idx === -1 ? null : idx + 1;
  }, [ranked, persistentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700">
        <div className="text-2xl font-bold animate-pulse">⏳ กำลังโหลดผล…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="text-purple-500 hover:text-purple-800 mb-4 font-bold"
        >
          ← กลับหน้าแรก
        </button>

        <div className="text-center mb-8 animate-float-up">
          <div className="text-7xl mb-2 inline-block animate-wiggle">🏆</div>
          <h1 className="text-5xl font-extrabold mb-2 text-gradient-rose">
            สรุปผลการประลอง!
          </h1>
          <div className="text-purple-600 font-bold">
            ห้อง <span className="font-mono tracking-widest text-rose-dark">{code}</span> ·{' '}
            {room?.max_rounds} รอบ
          </div>
          {myRank === 1 && (
            <div className="mt-3 text-rose-dark text-2xl font-extrabold animate-pop-in">
              🎉 คุณเป็นผู้ชนะ! ยอดเยี่ยมมาก!
            </div>
          )}
          {myRank && myRank > 1 && (
            <div className="mt-2 text-purple-700 font-bold">
              คุณได้อันดับ {myRank} 🎯
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 mb-6 border-2 border-lavender-soft">
          <h2 className="text-xl font-extrabold mb-4 text-purple-800">
            🏅 Leaderboard
          </h2>
          <div className="flex flex-col gap-2">
            {ranked.map((p, i) => (
              <PlayerCard
                key={p.id}
                player={p}
                isMe={p.persistent_id === persistentId}
                rank={i + 1}
              />
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 mb-6 border-2 border-lavender-soft overflow-x-auto">
            <h2 className="text-xl font-extrabold mb-4 text-purple-800">
              📊 ผลแต่ละรอบ
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-purple-500 font-bold text-left">
                  <th className="pb-2">ผู้เล่น</th>
                  <th className="pb-2">รอบ</th>
                  <th className="pb-2">Pegs เหลือ</th>
                  <th className="pb-2">คำใบ้</th>
                  <th className="pb-2">เวลา</th>
                  <th className="pb-2">คะแนน</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const player = players.find((p) => p.id === r.player_id);
                  if (!player) return null;
                  return (
                    <tr
                      key={r.id}
                      className="border-t-2 border-lavender-soft/60 text-purple-800"
                    >
                      <td className="py-2 font-bold">{player.nickname}</td>
                      <td className="py-2">{r.round_number}</td>
                      <td className="py-2">{r.pegs_remaining}</td>
                      <td className="py-2">{r.hints_used}</td>
                      <td className="py-2">{r.time_used_seconds}s</td>
                      <td className="py-2 font-extrabold text-rose-dark">
                        {formatScore(r.score_delta)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-coral via-rose to-rose-dark text-white font-extrabold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
          >
            กลับหน้าแรก 🏠
          </button>
        </div>
      </div>
    </div>
  );
}