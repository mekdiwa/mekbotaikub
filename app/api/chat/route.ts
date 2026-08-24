import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: '❌ ไม่พบ GEMINI_API_KEY: กรุณาเพิ่ม Key ใน Environment Variables ของ Vercel' 
      });
    }

    // ใช้ v1 API แบบเสถียร รองรับโมเดล flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    const data = await response.json();

    // หาก Google แจ้ง Error (เช่น Key ผิด หรือ Quota หมด)
    if (data.error) {
      return NextResponse.json({ 
        reply: `❌ Google API Error (${data.error.code || 'Unknown'}): ${data.error.message}` 
      });
    }

    // ดึงข้อความตอบกลับ
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ 
        reply: `⚠️ ไม่พบข้อความตอบกลับ (Status: ${JSON.stringify(data)})` 
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ 
      reply: `❌ Server Error: ${error?.message || 'การเชื่อมต่อผิดพลาด'}` 
    });
  }
}
