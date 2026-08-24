'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const router = useRouter();

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0e] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0e161b] border border-[#1e2d37] rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        
        {/* โคมไฟ & ตัวบอท Interactive */}
        <div className="relative mb-6 flex flex-col items-center">
          <div className="w-16 h-8 bg-zinc-700 rounded-t-full relative z-20"></div>
          <div className="w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl absolute top-4 z-0"></div>
          
          <div className="w-20 h-20 bg-[#162a2c] border-2 border-emerald-400 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_20px_#10b981] mt-4 transition-all duration-300">
            {isPasswordFocused ? (
              <div className="flex gap-2">
                <div className="w-4 h-1.5 bg-emerald-300 rounded-full"></div>
                <div className="w-4 h-1.5 bg-emerald-300 rounded-full"></div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="w-3.5 h-3.5 bg-emerald-300 rounded-full animate-bounce"></div>
                <div className="w-3.5 h-3.5 bg-emerald-300 rounded-full animate-bounce"></div>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-emerald-400 tracking-wider mb-2 font-mono">MEKBOTAI</h1>
        <p className="text-zinc-400 text-sm mb-6 text-center">เข้าสู่ระบบเพื่อเริ่มใช้งานโมเดล AI</p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onClick={playClickSound}
              className="w-full bg-[#16222a] border border-[#233542] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 text-sm"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              onClick={playClickSound}
              className="w-full bg-[#16222a] border border-[#233542] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold py-3 rounded-lg shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all text-sm tracking-wide"
          >
            SIGN IN →
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors">
            ยังไม่มีบัญชี? สมัครสมาชิกที่นี่
          </Link>
        </div>
      </div>
    </div>
  );
}
