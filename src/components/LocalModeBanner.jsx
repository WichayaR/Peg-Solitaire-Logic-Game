import { isSupabaseConfigured } from '../lib/supabase.js';

export function LocalModeBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-mustard via-terracotta to-rust text-cream shadow-soft text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div>
          <strong className="font-bold">🧪 โหมดทดสอบ</strong>
          <span className="ml-2">
            เล่นได้เลยไม่ต้องตั้ง Supabase · เปิด 2 tabs เพื่อทดสอบ multiplayer
          </span>
        </div>
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline underline hover:text-cream font-medium"
        >
          ตั้ง Supabase →
        </a>
      </div>
    </div>
  );
}