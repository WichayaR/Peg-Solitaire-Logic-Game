import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ใช้ env vars ที่ไม่มี VITE_ prefix เพื่อให้ตั้งใน Vercel ได้ง่าย
// (Vercel เตือนเสมอสำหรับ vars ที่ขึ้นต้นด้วย VITE_ เพราะ public)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
  },
});