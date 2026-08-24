'use client';

import { useState } from 'react';
import { Send, Sparkles, ChevronDown, Paperclip, Globe, Lock } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 3.7 Flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user', content: query }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 py-3 justify-between">
      {/* Top Model Selector */}
      <div className="flex items-center gap-2 relative z-30">
        <button
          onClick={() => setShowModelDropdown(!showModelDropdown)}
          className="flex items-center gap-2 bg-[#14171d] border border-red-900/40 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:border-red-600 transition-colors"
        >
          {selectedModel} <ChevronDown size={14} />
        </button>

        <div className="bg-[#14171d] border border-[#222733] px-3 py-1.5 rounded-lg text-xs text-zinc-400 flex items-center gap-1.5">
          <span>ไม่มี Agent</span> <ChevronDown size={14} />
        </div>

        {showModelDropdown && (
          <div className="absolute top-10 left-0 w-72 bg-[#12151b] border border-[#262c3a] rounded-xl shadow-2xl p-2 z-50 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase px-2 font-bold">เลือก MODEL</span>
            
            <div
              onClick={() => { setSelectedModel('Gemini 3.7 Flash'); setShowModelDropdown(false); }}
              className="p-2 rounded-lg bg-red-950/30 border border-red-800/40 text-xs text-red-400 flex justify-between items-center cursor-pointer"
            >
              <span>Gemini 3.7 Flash</span>
              <span className="text-[10px] text-emerald-400">Active</span>
            </div>

            <div className="p-2 rounded-lg text-xs text-zinc-500 flex justify-between items-center opacity-60">
              <span>Deepseek V4 Pro</span>
              <span className="text-[10px] flex items-center gap-1 text-amber-500"><Lock size={10} /> ล็อค</span>
            </div>

            <div className="p-2 rounded-lg text-xs text-zinc-500 flex justify-between items-center opacity-60">
              <span>Qwen 3.8-27B</span>
              <span className="text-[10px] flex items-center gap-1 text-amber-500"><Lock size={10} /> ล็อค</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-950/30 rounded-2xl border border-red-600/30 flex items-center justify-center mb-4 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Sparkles size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">มีอะไรให้ MEKBOTAI ช่วยไหม?</h2>
            <p className="text-xs text-zinc-400 max-w-sm mb-6">เลือกหัวข้อตัวอย่างด้านล่าง หรือเริ่มพิมพ์คำถามของคุณได้ทันที</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg text-left">
              {[
                { title: '>_ ANALYZE', desc: 'อธิบายกระบวนการทำงานของ Large Language Models' },
                { title: '>_ GENERATE', desc: 'เขียนฟังก์ชัน TypeScript สำหรับเชื่อมต่อ Supabase API' },
                { title: '>_ DEBUG', desc: 'วิเคราะห์สาเหตุและวิธีแก้ปัญหา Memory Leak ใน Node.js' },
                { title: '>_ COMPRESS', desc: 'สรุปประเด็นสำคัญของเนื้อหาให้กระชับและตรงจุด' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSendMessage(item.desc)}
                  className="p-3 bg-[#12151b] border border-[#1e232d] hover:border-red-900/60 rounded-xl cursor-pointer transition-all hover:bg-[#171a22]"
                >
                  <div className="text-xs font-mono font-bold text-red-400 mb-1">{item.title}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-[#15181e] border border-[#232731] text-zinc-200 rounded-bl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* แถบ Input ส่งคำถาม */}
      <div className="bg-[#12151b] border border-[#202531] rounded-2xl p-2 flex flex-col gap-2">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`ถาม ${selectedModel}...`}
          className="w-full bg-transparent border-none resize-none px-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-[#1c202a] pt-2 px-1">
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50">
              <Paperclip size={16} />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50">
              <Globe size={16} />
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={loading}
            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl disabled:opacity-50 transition-all shadow-md shadow-red-900/30"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
