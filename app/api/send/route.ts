import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, phone, model } = await req.json();

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat_id = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chat_id) {
    return NextResponse.json({ success: false, error: 'Missing env vars' }, { status: 500 });
  }

  const text = `📺 Новая заявка\nИмя: ${name}\nТелефон: ${phone}\nМодель ТВ: ${model}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text }),
  });

  if (!res.ok) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
