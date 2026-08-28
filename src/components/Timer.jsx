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
    ? 'bg-gradient-to-r from-coral to-rose text-white animate-pulse'
    : warning
      ? 'bg-gradient-to-r from-sunshine to-peach text-purple-800'
      : 'bg-gradient-to-r from-mint to-sky text-purple-800';

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-soft ${color}`}>
      <span className="text-lg">⏰</span>
      <span className="text-xl font-mono font-extrabold tabular-nums">
        {formatTime(remaining)}
      </span>
    </div>
  );
}