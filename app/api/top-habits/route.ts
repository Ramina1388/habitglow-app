import { NextRequest, NextResponse } from 'next/server';

let habitCounts: Record<string, number> = {};

export async function POST(req: NextRequest) {
  try {
    const { habit } = await req.json() as { habit: string };

    if (!habit) {
      return NextResponse.json({ error: 'Missing habit' }, { status: 400 });
    }

    habitCounts[habit] = (habitCounts[habit] || 0) + 1;

    return NextResponse.json({ message: 'Habit logged successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 });
  }
}

export async function GET() {
  const sortedHabits = Object.entries(habitCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([habit, count]) => ({ habit, count }));

  return NextResponse.json(sortedHabits);
}
