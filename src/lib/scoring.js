// =========================================================
// Scoring system
// =========================================================
// Round score =
//   pegScore + timeBonus - hintPenalty
//
//   pegScore        = (isWin ? pegsRemaining : 0) * 100
//                     เหลือ 1 peg (ชนะ) = 100 คะแนน,
//                     เหลือมากกว่า 1 = 0 คะแนน (แพ้รอบ)
//   timeBonus       = max(0, (timer - timeUsed) / 5)
//                     จบเร็วก็ได้โบนัส
//   hintPenalty     = hintsUsed * penaltyPerHint
//
// Total score = sum of round scores

export function calculateRoundScore({
  isWin,
  pegsRemaining,
  hintsUsed,
  hintPenalty,
  timeUsedSeconds,
  timerSeconds,
}) {
  const pegScore = isWin ? pegsRemaining * 100 : 0;
  const timeRemaining = Math.max(0, timerSeconds - timeUsedSeconds);
  const timeBonus = Math.floor(timeRemaining / 5);
  const hintCost = hintsUsed * hintPenalty;
  const total = pegScore + timeBonus - hintCost;
  return {
    pegScore,
    timeBonus,
    hintCost,
    total,
  };
}

export function formatScore(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}