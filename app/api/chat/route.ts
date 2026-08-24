import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: '❌ ไม่พบ GEMINI_API_KEY ในระบบ Vercel Environment Variables'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: `❌ เกิดข้อผิดพลาด: ${error?.message || 'ไม่สามารถติดต่อ AI ได้'}`
    });
  }
}
