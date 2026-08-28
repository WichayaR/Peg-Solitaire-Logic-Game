import { useEffect, useState } from 'react';
import { formatTime } from '../lib/scoring.js';

export function Timer({ seconds, onExpire, running = true }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, running, onExpire]);

  const danger = remaining <= 10;
  const warning = remaining <= 30 && remaining > 10;

  const color = danger
    ? 'bg-gradient-to-r from-rust to-terracotta text-cream animate-pulse'
    : warning
      ? 'bg-gradient-to-r from-mustard to-peach text-bark'
      : 'bg-gradient-to-r from-sage to-sage-soft text-bark';

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-soft ${color}`}>
      <span className="text-lg">⏰</span>
      <span className="text-xl font-mono font-extrabold tabular-nums">
        {formatTime(remaining)}
      </span>
    </div>
  );
}