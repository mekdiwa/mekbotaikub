'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0e] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e161b] border border-[#1e2d37] rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-emerald-400 font-mono mb-2">MEKBOTAI</h1>
        <p className="text-zinc-400 text-sm text-center mb-6">สร้างบัญชีผู้ใช้งานใหม่</p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#16222a] border border-[#233542] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#16222a] border border-[#233542] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-lg text-sm transition-all shadow-lg hover:shadow-emerald-500/20"
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors">
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
