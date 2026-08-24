'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-200">
      <header className="border-b border-zinc-800 bg-[#0c0f14] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-mono font-bold text-sm">MEKBOTAI</span>
          <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded">ADMIN PORTAL</span>
        </div>
        <button
          onClick={handleAdminLogout}
          className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
        >
          ออกจากระบบหลังบ้าน
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
