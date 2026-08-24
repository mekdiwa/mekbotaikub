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

    // วนหาโมเดลที่ใช้งานได้อัตโนมัติ
    const modelCandidates = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-pro'
    ];

    let reply = '';
    let lastError = '';

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(message);
        const response = await result.response;
        reply = response.text();
        if (reply) break;
      } catch (err: any) {
        lastError = err.message;
        continue;
      }
    }

    if (!reply) {
      return NextResponse.json({
        reply: `❌ Google API Error: ${lastError}\n\n👉 กรุณาสร้าง API Key ใหม่ที่ aistudio.google.com/app/apikey แล้วนำไปใส่ใน Vercel`
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: `❌ เกิดข้อผิดพลาดในระบบ: ${error?.message || 'เชื่อมต่อล้มเหลว'}`
    });
  }
}
