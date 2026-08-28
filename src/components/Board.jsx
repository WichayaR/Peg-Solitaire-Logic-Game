import { useMemo, useState, useEffect } from 'react';
import { Peg } from './Peg.jsx';
import {
  getValidMoves,
  applyMove,
  isGameOver,
  isWin,
  countPegs,
} from '../lib/pegLogic.js';

export function Board({
  board: initialBoard,
  size = 56,
  disabled = false,
  hintsAllowed = true,
  hintPenalty = 50,
  onPegsChange,
  onGameEnd,
  onHintUsed,
}) {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [hintMove, setHintMove] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    setBoard(initialBoard);
    setSelected(null);
    setHintMove(null);
    setHintsUsed(0);
  }, [initialBoard]);

  const validMoves = useMemo(() => getValidMoves(board), [board]);
  const pegs = useMemo(() => countPegs(board), [board]);

  useEffect(() => {
    onPegsChange?.(pegs);
  }, [pegs, onPegsChange]);

  useEffect(() => {
    if (disabled) return;
    if (isGameOver(board) || isWin(board)) {
      onGameEnd?.({ win: isWin(board), pegs, hintsUsed });
    }
  }, [board, disabled, onGameEnd, pegs, hintsUsed]);

  function handleCellClick(r, c) {
    if (disabled) return;
    if (board[r][c] === null) return;
    setHintMove(null);

    if (board[r][c] === 1) {
      if (selected && selected.r === r && selected.c === c) {
        setSelected(null);
      } else {
        setSelected({ r, c });
      }
      return;
    }

    if (board[r][c] === 0 && selected) {
      const move = validMoves.find(
        (m) =>
          m.from.r === selected.r &&
          m.from.c === selected.c &&
          m.to.r === r &&
          m.to.c === c,
      );
      if (move) {
        const next = applyMove(board, move);
        setBoard(next);
        setSelected(null);
      } else {
        setSelected(null);
      }
    }
  }

  function useHint() {
    if (!hintsAllowed) return;
    if (disabled) return;
    const moves = getValidMoves(board);
    if (moves.length === 0) return;
    let best = moves[0];
    let bestScore = -Infinity;
    for (const move of moves) {
      const next = applyMove(board, move);
      const remaining = countPegs(next);
      const futureMoves = getValidMoves(next).length;
      const score = -remaining * 100 + futureMoves;
      if (score > bestScore) {
        bestScore = score;
        best = move;
      }
    }
    setHintMove(best);
    setSelected(best.from);
    setHintsUsed((n) => n + 1);
    onHintUsed?.();
  }

  const hintFromKey = hintMove ? `${hintMove.from.r}-${hintMove.from.c}` : null;
  const hintToKey = hintMove ? `${hintMove.to.r}-${hintMove.to.c}` : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid gap-1 p-4 rounded-[2rem] shadow-soft-lg ring-4 ring-amber-900/30"
        style={{
          gridTemplateColumns: `repeat(${board.length}, ${size}px)`,
          gridTemplateRows: `repeat(${board.length}, ${size}px)`,
          backgroundColor: '#d4a574', // wood-tone กลาง
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(120, 80, 40, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(60, 30, 10, 0.12) 0%, transparent 50%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(101, 67, 33, 0.05) 2px,
              rgba(101, 67, 33, 0.05) 3px
            )
          `,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            return (
              <Peg
                key={key}
                state={cell}
                row={r}
                col={c}
                size={size}
                selected={selected && selected.r === r && selected.c === c}
                hintFrom={key === hintFromKey}
                hintTo={key === hintToKey}
                onClick={() => handleCellClick(r, c)}
              />
            );
          }),
        )}
      </div>

      <div className="flex items-center gap-3 text-sm font-bold text-purple-700 bg-white/60 px-5 py-2.5 rounded-full shadow-soft">
        <span>🎯 Pegs: <strong className="text-rose-dark">{pegs}</strong></span>
        <span className="text-purple-300">|</span>
        <span>⚡ Moves: <strong className="text-rose-dark">{validMoves.length}</strong></span>
        {hintsAllowed && (
          <>
            <span className="text-purple-300">|</span>
            <span>💡 Hints: <strong className="text-rose-dark">{hintsUsed}</strong></span>
            <button
              type="button"
              onClick={useHint}
              disabled={disabled || validMoves.length === 0}
              className="ml-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky to-lavender hover-bounce text-white text-xs font-bold shadow-soft disabled:opacity-40 active:scale-95 transition"
              title={`ใช้คำใบ้ หัก ${hintPenalty} คะแนน`}
            >
              💡 คำใบ้ (-{hintPenalty})
            </button>
          </>
        )}
      </div>
    </div>
  );
}