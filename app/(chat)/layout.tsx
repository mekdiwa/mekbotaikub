'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { MessageSquare, PlusCircle, Bot, BookOpen, Terminal, History, Settings, User, LogOut, Menu, X } from 'lucide-react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState('');
  const [points, setPoints] = useState(25);
  const [logoUrl, setLogoUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email || '');

      const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
      if (profile) setPoints(profile.points);

      const { data: settings } = await supabase.from('site_settings').select('logo_url').single();
      if (settings) setLogoUrl(settings.logo_url);
    }
    getUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0c0e] text-zinc-300 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar เมนูฝั่งซ้าย */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#0d0f12] border-r border-[#1a1d24] flex flex-col justify-between z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
              )}
              <span className="font-mono font-bold text-red-500 tracking-wider text-sm">MEKBOTAI</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800">ONLINE</span>
            </div>
            <button className="md:hidden text-zinc-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-red-950/20 text-red-400 border border-red-900/30 rounded-lg text-sm font-medium">
              <MessageSquare size={16} /> แชท
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm transition-colors">
              <PlusCircle size={16} /> เติม Point
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm transition-colors">
              <Bot size={16} /> Agent
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm transition-colors">
              <BookOpen size={16} /> ฐานความรู้
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm transition-colors">
              <Terminal size={16} /> ใช้งาน CLI
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm transition-colors">
              <History size={16} /> ประวัติการใช้งาน
            </button>
          </nav>

          <div className="border-t border-[#1a1d24] pt-3">
            <span className="text-[11px] text-zinc-500 font-semibold px-3 uppercase tracking-wider">บัญชี</span>
            <div className="space-y-1 mt-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm">
                <Settings size={16} /> ตั้งค่า
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-zinc-200 hover:bg-[#15181e] rounded-lg text-sm">
                <User size={16} /> โปรไฟล์
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#1a1d24] bg-[#090a0c]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center font-bold text-xs text-red-400">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{userEmail.split('@')[0]}</p>
              <p className="text-[10px] text-zinc-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-zinc-400 hover:text-red-400 py-1 transition-colors"
          >
            <LogOut size={14} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-12 border-b border-[#1a1d24] flex items-center justify-between px-4 md:hidden bg-[#0d0f12]">
          <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-300">
            <Menu size={20} />
          </button>
          <span className="font-mono font-bold text-red-500">MEKBOTAI</span>
          <div className="text-xs text-emerald-400">{points} P</div>
        </header>

        <main className="flex-1 relative overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
