import { NextRequest, NextResponse } from 'next/server';
import { readActivity } from '@/lib/db';

export async function GET() {
  try {
    const activity = await readActivity();
    return NextResponse.json({ activity });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 });
  }
}
