import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom.js';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { joinRoom, startRoom, setPlayerReady } from '../lib/api.js';
import { useToast } from '../components/ToastHost.jsx';
import { Scoreboard } from '../components/Scoreboard.jsx';
import { LEVELS } from '../lib/boards.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export function LobbyPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { persistentId, nickname, setNickname } = usePlayer();
  const { push } = useToast();
  const { room, players, loading, error } = useRoom(code);
  const [joining, setJoining] = useState(false);
  const [starting, setStarting] = useState(false);

  const me = players.find((p) => p.persistent_id === persistentId);
  const isHost = room?.host_id === persistentId;
  const minPlayers = room?.min_players || 2;
  const hasEnoughPlayers = players.length >= minPlayers;
  const readyCount = players.filter((p) => p.is_ready).length;
  const allReady = players.length > 0 && readyCount === players.length;
  const canStart =
    isHost && hasEnoughPlayers && allReady && room?.status === 'waiting';

  // auto-join เมื่อมี nickname และห้องพร้อม
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!room) return;
    if (!nickname) {
      navigate('/');
      return;
    }
    const me = players.find((p) => p.persistent_id === persistentId);
    if (me) return;
    if (joining) return;

    setJoining(true);
    joinRoom({
      roomId: room.id,
      persistentId,
      nickname,
      isHost: room.host_id === persistentId,
    })
      .catch((err) => {
        push('เข้าร่วมห้องไม่สำเร็จ: ' + (err.message || err), 'error');
      })
      .finally(() => setJoining(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, nickname, persistentId]);

  // auto-redirect ไปหน้าเล่นเมื่อ Host เริ่มเกม
  useEffect(() => {
    if (!room) return;
    if (room.status !== 'playing') return;
    if (!nickname) return;
    const me = players.find((p) => p.persistent_id === persistentId);
    if (!me) return;
    if (window.location.pathname.endsWith('/play')) return;
    navigate(`/room/${code}/play`);
  }, [room?.status, room?.current_round, players, persistentId, code, nickname, navigate]);

  function copyShareLink() {
    const link = `${window.location.origin}/room/${code}`;
    navigator.clipboard
      .writeText(link)
      .then(() => push('คัดลอกลิงก์แล้ว! 🎉', 'success'))
      .catch(() => push('คัดลอกไม่สำเร็จ', 'error'));
  }

  function copyCode() {
    navigator.clipboard
      .writeText(code)
      .then(() => push('คัดลอกรหัสแล้ว! 🎉', 'success'))
      .catch(() => push('คัดลอกไม่สำเร็จ', 'error'));
  }

  function handleStart() {
    if (!room) return;
    setStarting(true);
    startRoom(room.id, 1)
      .then(() => {
        navigate(`/room/${code}/play`);
      })
      .catch((err) => {
        push('เริ่มเกมไม่สำเร็จ: ' + (err.message || err), 'error');
        setStarting(false);
      });
  }

  if (!isSupabaseConfigured) {
    // local mode ก็ใช้งานได้ตามปกติ ไม่ต้องบล็อค
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-forest">
        <div className="text-2xl font-bold animate-pulse">⏳ กำลังโหลดห้อง…</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-forest">
        <div className="bg-gradient-to-r from-terracotta to-rose text-white px-8 py-4 rounded-2xl shadow-soft-lg font-bold">
          {error || 'ไม่พบห้อง 😢'}
        </div>
      </div>
    );
  }

  const levelInfo = LEVELS.find((l) => l.id === room.level);

  return (
    <div className="min-h-screen text-bark">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-sage hover:text-forest mb-4 font-bold"
        >
          ← กลับหน้าแรก
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 animate-float-up">
          <div>
            <div className="text-sm uppercase tracking-wider text-sage font-bold">
              🔑 Room Code
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-5xl font-mono font-extrabold tracking-[0.2em] text-gradient-rose">
                {code}
              </span>
              <button
                onClick={copyCode}
                className="px-3 py-2 text-xs rounded-full bg-white shadow-soft hover-bounce ring-2 ring-lavender-soft"
                title="คัดลอกรหัส"
              >
                📋
              </button>
            </div>
          </div>

          <button
            onClick={copyShareLink}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-mint-dark to-emerald-400 text-white font-extrabold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all"
          >
            🔗 คัดลอกลิงก์เชิญเพื่อน!
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 border-2 border-sage-soft animate-float-up">
            <h2 className="text-2xl font-extrabold mb-4 text-forest">
              ⚙️ การตั้งค่าห้อง
            </h2>
            <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Row label="🎯 ด่าน">{levelInfo?.label}</Row>
              <Row label="🎲 กระดาน">{levelInfo?.description}</Row>
              <Row label="⏰ เวลาต่อรอบ">{room.timer_seconds} วินาที</Row>
              <Row label="🔄 จำนวนรอบ">{room.max_rounds} รอบ</Row>
              <Row label="👥 ผู้เล่น">
                {players.length}/{room.max_players || 20} คน (ขั้นต่ำ {minPlayers})
              </Row>
              <Row label="💡 คำใบ้">
                {room.hints_allowed ? `เปิด (-${room.hint_penalty} คะแนน)` : 'ปิด'}
              </Row>
              <Row label="📊 สถานะ">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sunshine to-peach text-forest text-xs font-extrabold uppercase">
                  {room.status}
                </span>
              </Row>
            </dl>

            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {!nickname && (
                <input
                  type="text"
                  placeholder="ชื่อของคุณ..."
                  defaultValue={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 min-w-[160px] px-3 py-3 rounded-2xl bg-cream border-2 border-sage-soft focus:border-rose outline-none"
                />
              )}

              {me && room?.status === 'waiting' && (
                <button
                  onClick={() => setPlayerReady(me.id, !me.is_ready)}
                  className={`
                    px-5 py-3 rounded-2xl font-extrabold transition-all shadow-soft hover-bounce active:scale-95
                    ${
                      me.is_ready
                        ? 'bg-gradient-to-r from-mint-dark to-emerald-400 text-white shadow-pop'
                        : 'bg-white text-forest ring-2 ring-lavender-soft'
                    }
                  `}
                >
                  {me.is_ready ? '✓ พร้อมลุย!' : 'กดเมื่อพร้อม'}
                </button>
              )}

              {isHost && (
                <button
                  onClick={handleStart}
                  disabled={!canStart || starting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-terracotta via-rose to-rust text-white font-extrabold shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  title={
                    !hasEnoughPlayers
                      ? `ต้องมีผู้เล่นอย่างน้อย ${minPlayers} คน`
                      : !allReady
                        ? 'รอผู้เล่นทุกคนกดพร้อม'
                        : ''
                  }
                >
                  {starting ? '⏳ กำลังเริ่ม…' : '🚀 ลุย!'}
                </button>
              )}
            </div>

            <div className="mt-4 space-y-1">
              {!isHost && room?.status === 'waiting' && (
                <div className="text-forest text-sm font-medium">
                  {hasEnoughPlayers
                    ? allReady
                      ? '✓ ทุกคนพร้อมแล้ว — รอหัวหน้าทีมสั่งลุย…'
                      : `⏳ รอผู้เล่นอีก ${players.length - readyCount} คนกดพร้อม…`
                    : `⏳ รอผู้เล่นอีก ${minPlayers - players.length} คน (ขั้นต่ำ ${minPlayers} คน)`}
                </div>
              )}
              {isHost && !hasEnoughPlayers && (
                <div className="text-mustard-700 text-sm font-medium">
                  ⏳ รอผู้เล่นอย่างน้อย {minPlayers} คน — ตอนนี้มี {players.length} คน
                </div>
              )}
              {isHost && hasEnoughPlayers && !allReady && (
                <div className="text-mustard-700 text-sm font-medium">
                  ⏳ รอผู้เล่นกดพร้อม — {readyCount}/{players.length} คนพร้อมแล้ว
                </div>
              )}
              {isHost && hasEnoughPlayers && allReady && (
                <div className="text-emerald-600 text-sm font-extrabold animate-pop-in">
                  ✓ ทุกคนพร้อมแล้ว! กดลุยได้เลย 🎉
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-4 border-2 border-sage-soft">
            <Scoreboard
              players={players}
              persistentId={persistentId}
              compact
              showReady={room?.status === 'waiting'}
            />
            <div className="mt-3 text-xs text-sage px-2 font-medium">
              {me ? `คุณเข้าร่วมในชื่อ "${me.nickname}"` : '⏳ กำลังเพิ่มคุณเข้าห้อง…'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <>
      <dt className="text-sage font-bold">{label}</dt>
      <dd className="text-forest font-extrabold">{children}</dd>
    </>
  );
}