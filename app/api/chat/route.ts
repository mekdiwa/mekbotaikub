import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: '❌ ไม่พบ GEMINI_API_KEY ในระบบ Vercel Environment Variables'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    const reply = response.text || 'AI ไม่มีข้อความตอบกลับ';

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: `❌ เกิดข้อผิดพลาด: ${error?.message || 'ไม่สามารถติดต่อ AI ได้'}`
    });
  }
}
