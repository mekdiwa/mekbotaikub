'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminSettings() {
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) {
        setLogoUrl(data.logo_url);
        setSiteName(data.site_name);
      }
    }
    loadSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('กำลังบันทึก...');

    const { error } = await supabase
      .from('site_settings')
      .update({ logo_url: logoUrl, site_name: siteName, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) {
      setStatus('เกิดข้อผิดพลาด: ' + error.message);
    } else {
      setStatus('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#181b20] border border-zinc-800 p-6 rounded-xl">
      <h1 className="text-xl font-bold mb-4 text-emerald-400">MEKBOTAI — ระบบจัดการหลังบ้าน</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">ชื่อเว็บไซต์</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-[#101216] border border-zinc-700 px-3 py-2 rounded text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">URL โลโก้เว็บไซต์</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full bg-[#101216] border border-zinc-700 px-3 py-2 rounded text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {logoUrl && (
          <div className="mt-2">
            <span className="text-xs text-zinc-500 block mb-1">พรีวิวโลโก้:</span>
            <img src={logoUrl} alt="Logo Preview" className="h-12 w-auto object-contain bg-black/40 p-1 rounded" />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2 rounded text-sm transition-colors"
        >
          อัปเดตการตั้งค่า
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-zinc-300 text-center">{status}</p>}
    </div>
  );
}
