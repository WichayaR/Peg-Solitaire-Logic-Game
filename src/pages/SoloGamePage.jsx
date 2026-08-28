import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../components/Board.jsx';
import { LevelSelector } from '../components/LevelSelector.jsx';
import { HowToPlay } from '../components/HowToPlay.jsx';
import { LEVELS } from '../lib/boards.js';
import { createBoard } from '../lib/pegLogic.js';
import { calculateRoundScore, formatTime } from '../lib/scoring.js';
import {
  loadProgression,
  recordGame,
} from '../lib/progression.js';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { useToast } from '../components/ToastHost.jsx';

export function SoloGamePage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { persistentId } = usePlayer();
  const [progress, setProgress] = useState(() => loadProgression(persistentId));

  const [levelId, setLevelId] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [hintPenalty, setHintPenalty] = useState(30);
  const [running, setRunning] = useState(false);

  const [startTime, setStartTime] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [endInfo, setEndInfo] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const p = loadProgression(persistentId);
    setProgress(p);
  }, [persistentId]);

  const initialBoard = useMemo(() => {
    const lv = LEVELS.find((l) => l.id === levelId);
    return createBoard(lv.shape);
  }, [levelId]);

  const start = () => {
    setRunning(true);
    setStartTime(Date.now());
    setTimeUsed(0);
    setHintsUsed(0);
    setEndInfo(null);
    setScore(null);
  };

  const reset = () => {
    setRunning(false);
    setEndInfo(null);
    setScore(null);
    setTimeUsed(0);
    setHintsUsed(0);
  };

  const handlePegsChange = useCallback(() => {
    setTimeUsed(Math.floor((Date.now() - startTime) / 1000));
  }, [startTime]);

  const handleGameEnd = useCallback(
    (info) => {
      setEndInfo((prev) => {
        if (prev) return prev;
        const used = Math.floor((Date.now() - startTime) / 1000);
        setTimeUsed(used);

        const updated = recordGame(persistentId, {
          levelId,
          score: 0,
          win: info.win,
        });
        setProgress(updated);

        return info;
      });
    },
    [startTime, persistentId, levelId, push],
  );

  const handleHintUsed = useCallback(() => setHintsUsed((n) => n + 1), []);

  function handleSubmit() {
    const s = calculateRoundScore({
      isWin: endInfo.win,
      pegsRemaining: endInfo.pegs,
      hintsUsed,
      hintPenalty,
      timeUsedSeconds: timeUsed,
      timerSeconds,
    });
    setScore(s);

    if (endInfo.win) {
      const updated = recordGame(persistentId, {
        levelId,
        score: s.total,
        win: true,
      });
      setProgress(updated);
    }
  }

  const lvl = LEVELS.find((l) => l.id === levelId);

  return (
    <div className="min-h-screen text-bark">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-sage hover:text-forest mb-4 font-bold"
        >
          ← กลับหน้าแรก
        </button>

        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-4xl font-extrabold text-gradient-rose">
            🌟 ฝึกฝนลำพัง
          </h1>
          <HowToPlay trigger="button" />
        </div>
        <p className="text-forest mb-6 font-medium">
          เลือกด่านที่อยากเล่นแล้วลุยเลย!
        </p>

        {!running ? (
          <div className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 space-y-5 max-w-xl border-2 border-sage-soft">
            <div>
              <label className="block text-sm font-bold text-forest mb-2">
                🎯 เลือกด่าน
              </label>
              <LevelSelector
                value={levelId}
                onChange={setLevelId}
                bestScores={progress.bestScores}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-forest mb-1">
                  ⏰ เวลา (วิ)
                </label>
                <input
                  type="number"
                  min={60}
                  max={3600}
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Number(e.target.value))}
                  className="w-full px-3 py-3 rounded-2xl bg-cream border-2 border-sage-soft focus:border-rose outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-forest mb-1">
                  💡 ค่าปรับคำใบ้
                </label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={hintPenalty}
                  onChange={(e) => setHintPenalty(Number(e.target.value))}
                  className="w-full px-3 py-3 rounded-2xl bg-cream border-2 border-sage-soft focus:border-rose outline-none"
                />
              </div>
            </div>

            <button
              onClick={start}
              className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-terracotta via-rose to-rust text-white font-extrabold text-lg shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
            >
              ▶ ลุยเลย!
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 bg-white/70 backdrop-blur shadow-soft rounded-3xl p-4 border-2 border-sage-soft">
              <div className="text-forest font-bold">
                <strong className="text-rust text-lg">{lvl.label}</strong>
                <span className="block text-xs text-sage mt-0.5">{lvl.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-rust bg-gradient-to-r from-sunshine to-peach px-3 py-1.5 rounded-full shadow-soft">
                  {formatTime(Math.max(0, timerSeconds - timeUsed))}
                </span>
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-full bg-white shadow-soft hover-bounce text-forest font-bold text-sm ring-2 ring-lavender-soft"
                >
                  🔄 รีเซ็ต
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <Board
                key={`${levelId}-${startTime}`}
                board={initialBoard}
                disabled={!!endInfo}
                hintsAllowed={true}
                hintPenalty={hintPenalty}
                onPegsChange={handlePegsChange}
                onGameEnd={handleGameEnd}
                onHintUsed={handleHintUsed}
              />
            </div>

            {endInfo && !score && (
              <div className="bg-white/95 shadow-soft-lg ring-4 ring-rose rounded-3xl p-6 text-center max-w-md mx-auto animate-pop-in">
                <div className="text-5xl mb-2">
                  {endInfo.win ? '🎉' : '⏰'}
                </div>
                <div className="text-2xl font-extrabold text-forest mb-2">
                  {endInfo.win ? 'ยอดเยี่ยม!' : 'หมดเวลาแล้ว!'}
                </div>
                <p className="text-forest font-medium mb-4">
                  {endInfo.win
                    ? `เหลือแค่ 1 peg! 🎯`
                    : `เหลือ ${endInfo.pegs} pegs · ใช้ ${hintsUsed} คำใบ้`}
                </p>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-terracotta to-rose text-white font-extrabold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
                >
                  🏅 ดูคะแนน
                </button>
              </div>
            )}

            {score && (
              <div className="bg-gradient-to-br from-mint-soft via-cream to-sunshine/30 shadow-soft-lg rounded-3xl p-6 max-w-md mx-auto border-2 border-mint animate-pop-in">
                <h3 className="text-2xl font-extrabold text-forest mb-3 text-center">
                  🎯 คะแนนของคุณ
                </h3>
                <div className="text-sm text-forest space-y-1.5 bg-white/70 rounded-2xl p-4">
                  <div className="flex justify-between">
                    <span>🎯 Peg score</span>
                    <strong className="text-rust">+{score.pegScore}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>⏰ Time bonus</span>
                    <strong className="text-emerald-600">+{score.timeBonus}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>💡 Hint cost</span>
                    <strong className="text-rust">-{score.hintCost}</strong>
                  </div>
                </div>
                <div className="mt-4 text-center text-3xl font-extrabold text-rust">
                  รวม {score.total} คะแนน! 🏆
                </div>
                <button
                  onClick={reset}
                  className="mt-4 w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-terracotta to-rose text-white font-extrabold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
                >
                  เล่นอีกครั้ง 🔄
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 w-full px-4 py-2 rounded-2xl bg-white text-forest font-bold shadow-soft hover-bounce text-sm"
                >
                  กลับหน้าแรก 🏠
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}