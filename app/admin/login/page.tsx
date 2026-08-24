'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profile?.role === 'admin') {
      router.push('/admin/settings');
    } else {
      setErrorMsg('คุณไม่มีสิทธิ์เข้าถึงระบบ Admin หลังบ้าน');
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="min-h-screen bg-[#050709] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0f1217] border border-amber-900/40 rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 mb-2 font-mono text-xs font-bold">
            RESTRICTED AREA
          </div>
          <h1 className="text-lg font-bold text-zinc-100">MEKBOTAI ADMIN</h1>
          <p className="text-xs text-zinc-500 mt-1">เข้าสู่ระบบจัดการสำหรับผู้ดูแลระบบ</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#171b22] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#171b22] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            เข้าสู่ระบบ Admin
          </button>
        </form>
      </div>
    </div>
  );
}
