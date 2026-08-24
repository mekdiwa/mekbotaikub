import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: 'ข้อผิดพลาด: ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Environment Variables ของ Vercel' 
      });
    }

    // เรียกใช้งาน Google Gemini API
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
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ 
        reply: `Gemini API Error: ${data.error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ'}` 
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ 
        reply: 'AI ไม่สามารถตอบคำถามนี้ได้ (อาจติดตัวกรองความปลอดภัยของระบบ)' 
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ 
      reply: `Server Error: ${error?.message || 'เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว'}` 
    });
  }
}
