import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Board } from '../components/Board.jsx';
import { Timer } from '../components/Timer.jsx';
import { Scoreboard } from '../components/Scoreboard.jsx';
import { useRoom } from '../hooks/useRoom.js';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { useToast } from '../components/ToastHost.jsx';
import {
  submitRoundResult,
  applyPlayerScore,
  nextRound,
  finishRoom,
} from '../lib/api.js';
import { createBoard } from '../lib/pegLogic.js';
import { calculateRoundScore } from '../lib/scoring.js';
import { recordGame, loadProgression } from '../lib/progression.js';
import { getBoardForRound, getLevelForRound } from '../lib/boards.js';

export function GamePage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { persistentId } = usePlayer();
  const { push } = useToast();
  const { room, players, results, loading } = useRoom(code);

  const me = useMemo(
    () => players.find((p) => p.persistent_id === persistentId),
    [players, persistentId],
  );

  const [hintsUsed, setHintsUsed] = useState(0);
  const [pegsRemaining, setPegsRemaining] = useState(0);
  const [gameOver, setGameOver] = useState(null); // {win, pegs, hints} | null
  const [submitted, setSubmitted] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0); // seconds
  const startTimeRef = useRef(Date.now());
  const tickedRef = useRef(null);

  const initialBoard = useMemo(() => {
    if (!room) return null;
    const shape = getBoardForRound(room.level, room.current_round);
    return createBoard(shape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, room?.level, room?.current_round]);

  const currentLevel = useMemo(() => {
    if (!room) return null;
    return getLevelForRound(room.level, room.current_round);
  }, [room?.level, room?.current_round]);

  // tick timer
  useEffect(() => {
    if (!room) return;
    if (gameOver) return;
    if (room.status !== 'playing') return;
    tickedRef.current = setInterval(() => {
      setTimeUsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(tickedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, room?.status, gameOver]);

  // restart timer เมื่อเริ่มรอบใหม่
  useEffect(() => {
    setHintsUsed(0);
    setGameOver(null);
    setSubmitted(false);
    setTimeUsed(0);
    startTimeRef.current = Date.now();
  }, [room?.current_round]);

  const handlePegsChange = useCallback((n) => setPegsRemaining(n), []);

  const handleGameEnd = useCallback(
    (info) => {
      // ป้องกัน trigger ซ้ำ
      setGameOver((prev) => prev || info);
    },
    [],
  );

  const handleHintUsed = useCallback(() => setHintsUsed((n) => n + 1), []);

  async function handleSubmit() {
    if (!me || !room || !gameOver) return;
    const score = calculateRoundScore({
      isWin: gameOver.win,
      pegsRemaining: gameOver.pegs,
      hintsUsed,
      hintPenalty: room.hint_penalty,
      timeUsedSeconds: timeUsed,
      timerSeconds: room.timer_seconds,
    });
    try {
      await submitRoundResult({
        roomId: room.id,
        playerId: me.id,
        roundNumber: room.current_round,
        scoreDelta: score.total,
        pegsRemaining: gameOver.pegs,
        hintsUsed,
        timeUsedSeconds: timeUsed,
      });
      await applyPlayerScore(me.id, {
        scoreDelta: score.total,
        pegsRemaining: gameOver.pegs,
      });

      // บันทึก progression (เฉพาะรอบสุดท้าย + ถ้าชนะ)
      const isLastRound = room.current_round >= room.max_rounds;
      if (isLastRound) {
        const before = loadProgression(persistentId);
        const updated = recordGame(persistentId, {
          levelId: room.level,
          score: score.total,
          win: gameOver.win,
        });
        if (gameOver.win && updated.unlockedLevel > before.unlockedLevel) {
          push(
            `🎉 ปลดล็อกด่าน ${updated.unlockedLevel} แล้ว!`,
            'success',
          );
        }
      }

      setSubmitted(true);
      push(
        gameOver.win
          ? `🎉 ชนะ! +${score.total} คะแนน`
          : `⏰ จบรอบ · เหลือ ${gameOver.pegs} pegs · ${score.total} คะแนน`,
        gameOver.win ? 'success' : 'info',
      );
    } catch (e) {
      push('ส่งคะแนนไม่สำเร็จ: ' + (e.message || e), 'error');
    }
  }

  async function handleNextRound() {
    if (!room) return;
    const next = room.current_round + 1;
    if (next > room.max_rounds) {
      await finishRoom(room.id);
      navigate(`/room/${code}/result`);
      return;
    }
    await nextRound(room.id, next);
  }

  if (loading || !room || !initialBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-100">
        <div className="animate-pulse">กำลังโหลดเกม…</div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-100">
        <div>คุณยังไม่ได้เข้าร่วมห้อง</div>
      </div>
    );
  }

  if (room.status === 'finished') {
    navigate(`/room/${code}/result`);
    return null;
  }

  const myResultThisRound = results.find(
    (r) => r.player_id === me.id && r.round_number === room.current_round,
  );
  const everyoneSubmitted =
    players.length > 0 && players.every((p) =>
      results.some(
        (r) => r.player_id === p.id && r.round_number === room.current_round,
      ),
    );
  const isHost = room.host_id === persistentId;

  return (
    <div className="min-h-screen text-slate-800">
      <header className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur shadow-soft border-b-2 border-lavender-soft">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="text-purple-500 hover:text-purple-800 font-bold"
          >
            ← ออก
          </button>
          <span className="text-purple-300">·</span>
          <span className="font-mono tracking-widest text-rose-dark font-extrabold">
            {code}
          </span>
          <span className="text-purple-300">·</span>
          <span className="text-purple-700 font-bold">
            🎮 รอบ {room.current_round}/{room.max_rounds}
          </span>
          {currentLevel && (
            <>
              <span className="text-purple-300">·</span>
              <span className="text-purple-700 font-extrabold">
                {currentLevel.label}
              </span>
            </>
          )}
        </div>
        <Timer
          seconds={room.timer_seconds}
          running={room.status === 'playing' && !gameOver}
          onExpire={() => {
            if (!gameOver) {
              setGameOver({ win: false, pegs: pegsRemaining, hints: hintsUsed });
            }
          }}
        />
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid lg:grid-cols-[280px_1fr_280px] gap-6">
        <aside className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-4 border-2 border-lavender-soft">
          <Scoreboard players={players} persistentId={persistentId} compact />
        </aside>

        <main className="flex flex-col items-center gap-4">
          <Board
            board={initialBoard}
            disabled={!!gameOver || submitted}
            hintsAllowed={room.hints_allowed}
            hintPenalty={room.hint_penalty}
            onPegsChange={handlePegsChange}
            onGameEnd={handleGameEnd}
            onHintUsed={handleHintUsed}
          />

          {gameOver && !submitted && (
            <div className="bg-white/95 shadow-soft-lg ring-4 ring-rose rounded-3xl p-6 text-center max-w-md animate-pop-in">
              <div className="text-5xl mb-2">
                {gameOver.win ? '🎉' : '⏰'}
              </div>
              <div className="text-2xl font-extrabold text-purple-800 mb-2">
                {gameOver.win ? 'ยอดเยี่ยม!' : 'หมดเวลาแล้ว!'}
              </div>
              <p className="text-purple-600 font-medium mb-4">
                {gameOver.win
                  ? `เหลือแค่ 1 peg — เก่งมากเลย!`
                  : `เหลือ ${gameOver.pegs} pegs · ใช้ ${hintsUsed} คำใบ้`}
              </p>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-coral to-rose text-white font-extrabold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
              >
                🏅 ส่งคะแนน
              </button>
            </div>
          )}

          {submitted && (
            <div className="bg-gradient-to-r from-mint-dark to-emerald-400 text-white rounded-3xl p-5 text-center shadow-pop animate-pop-in">
              <div className="text-xl font-extrabold mb-1">
                ✓ ส่งคะแนนเรียบร้อย!
              </div>
              <div className="text-sm opacity-90">รอคนอื่นส่งคะแนน…</div>
              {everyoneSubmitted && isHost && (
                <div className="mt-3">
                  <button
                    onClick={handleNextRound}
                    className="px-5 py-3 rounded-2xl bg-white text-rose-dark font-extrabold shadow-soft hover-bounce active:translate-y-1 transition-all"
                  >
                    {room.current_round >= room.max_rounds
                      ? '🏆 สรุปผล'
                      : `▶ รอบที่ ${room.current_round + 1}`}
                  </button>
                </div>
              )}
              {everyoneSubmitted && !isHost && (
                <div className="mt-2 text-sm opacity-90">
                  ⏳ รอหัวหน้าทีมเริ่มรอบถัดไป…
                </div>
              )}
            </div>
          )}

          {myResultThisRound && !submitted && (
            <div className="text-purple-600 text-sm font-medium bg-white/60 px-4 py-2 rounded-full shadow-soft">
              ✓ คุณส่งคะแนนรอบนี้แล้ว · {myResultThisRound.score_delta} คะแนน
            </div>
          )}
        </main>

        <aside className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-4 border-2 border-lavender-soft text-sm space-y-3">
          <div>
            <div className="text-purple-400 text-xs uppercase font-bold tracking-wider">👤 ผู้เล่น</div>
            <div className="text-purple-800 font-extrabold">{me.nickname}</div>
          </div>
          <div>
            <div className="text-purple-400 text-xs uppercase font-bold tracking-wider">🎯 Pegs เหลือ</div>
            <div className="text-rose-dark font-extrabold text-xl">
              {pegsRemaining}
            </div>
          </div>
          <div>
            <div className="text-purple-400 text-xs uppercase font-bold tracking-wider">⏱️ ใช้เวลา</div>
            <div className="text-rose-dark font-extrabold text-xl">
              {Math.floor(timeUsed / 60)}:
              {(timeUsed % 60).toString().padStart(2, '0')}
            </div>
          </div>
          {room.hints_allowed && (
            <div>
              <div className="text-purple-400 text-xs uppercase font-bold tracking-wider">💡 คำใบ้</div>
              <div className="text-rose-dark font-extrabold text-xl">
                {hintsUsed} <span className="text-sm text-purple-500">(-{hintsUsed * room.hint_penalty})</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}