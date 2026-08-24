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

    // เรียกใช้โมเดล gemini-1.5-flash ผ่าน v1beta
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ 
        reply: `❌ Google API Error (${data.error.code}): ${data.error.message}` 
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ 
        reply: '⚠️ ไม่พบข้อความตอบกลับจาก AI' 
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ 
      reply: `❌ Server Error: ${error?.message || 'เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว'}` 
    });
  }
}
