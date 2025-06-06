import { NextResponse } from 'next/server';

type HabitLog = {
  name: string;
  date: string;
};

let logs: Record<string, number> = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid habit name' }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const key = `${name}-${today}`;

    if (!logs[key]) {
      logs[key] = 0;
    }

    logs[key] += 1;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ logs });
}
