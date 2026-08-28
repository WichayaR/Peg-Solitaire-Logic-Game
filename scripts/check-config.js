// Build-time check: เตือนถ้า deploy production แต่ไม่ได้ตั้ง Supabase
import { readFileSync, existsSync } from 'fs';

const isProd = process.env.NODE_ENV === 'production' ||
  process.argv.includes('--prod') ||
  process.env.VERCEL_ENV === 'production';

if (!isProd) {
  // dev mode → ผ่านเฉยๆ (Local Mode ปกติ)
  process.exit(0);
}

// production → ตรวจ config
if (!existsSync('.env')) {
  console.error('\n❌ .env not found — production build needs Supabase config\n');
  process.exit(0);
}

const envContent = readFileSync('.env', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const url = urlMatch?.[1]?.trim() || '';
const key = keyMatch?.[1]?.trim() || '';

if (!url || url.includes('placeholder') || !key || key.includes('placeholder')) {
  console.error('\n');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('⚠️  WARNING: Production build without Supabase config');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  console.error('  VITE_SUPABASE_URL:', url || '(empty)');
  console.error('  VITE_SUPABASE_ANON_KEY:', key ? '***' : '(empty)');
  console.error('');
  console.error('  → App will run in Local Mode');
  console.error('  → Players cannot play across different devices');
  console.error('  → Only works for solo / 2 tabs on same device');
  console.error('');
  console.error('  See SUPABASE_SETUP.md for the 5-minute setup guide');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.error('Build will continue. Press Ctrl+C to cancel if you forgot to set Supabase.\n');
} else {
  console.log('\n✅ Supabase config detected — production build OK\n');
}