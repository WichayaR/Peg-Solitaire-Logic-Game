import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { localStore } from '../lib/localStore.js';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { useToast } from '../components/ToastHost.jsx';

export function JoinRoomPage() {
  const navigate = useNavigate();
  const { nickname, setNickname } = usePlayer();
  const { push } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nickname) {
      push('ตั้งชื่อนักผจญภัยก่อนนะ!', 'error');
      navigate('/');
      return;
    }
    if (!code.trim()) return;
    setLoading(true);
    const upperCode = code.trim().toUpperCase();

    if (!isSupabaseConfigured) {
      localStore
        .getRoomByCode(upperCode)
        .then((data) => {
          if (!data) {
            push('ไม่พบห้องนี้ — เช็ครหัสอีกครั้งนะ!', 'error');
            setLoading(false);
            return;
          }
          navigate(`/room/${data.code}`);
        })
        .catch((err) => {
          push('ผิดพลาด: ' + (err.message || err), 'error');
          setLoading(false);
        });
      return;
    }

    supabase
      .from('rooms')
      .select('code')
      .eq('code', upperCode)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) {
          push('ไม่พบห้องนี้ — เช็ครหัสอีกครั้งนะ!', 'error');
          setLoading(false);
          return;
        }
        navigate(`/room/${data.code}`);
      })
      .catch((err) => {
        push('ผิดพลาด: ' + (err.message || err), 'error');
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen text-bark">
      <div className="max-w-md mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="text-sage hover:text-forest mb-4 font-bold"
        >
          ← ย้อนกลับ
        </button>

        <h1 className="text-4xl font-extrabold mb-6 text-gradient-rose">
          🔗 มาเล่นด้วยกัน!
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur shadow-soft-lg rounded-3xl p-6 space-y-5 border-2 border-sage-soft"
        >
          <div>
            <label className="block text-sm font-bold text-forest mb-2">
              ✏️ ชื่อของคุณ
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-sage-soft focus:border-rose outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-forest mb-2">
              🔑 รหัสห้อง (6 ตัว)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="A3K9P2"
              className="w-full px-4 py-4 rounded-2xl bg-cream border-2 border-sage-soft focus:border-rose outline-none text-center text-3xl tracking-[0.4em] font-extrabold text-rust"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-terracotta via-rose to-rust text-white font-extrabold text-lg shadow-pop hover-bounce active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? '⏳ กำลังค้นหา…' : '🚀 เข้าร่วมเลย!'}
          </button>
        </form>
      </div>
    </div>
  );
}