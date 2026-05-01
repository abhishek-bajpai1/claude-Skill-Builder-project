import { NextRequest, NextResponse } from 'next/server';
import { readProfile, writeProfile, logActivity } from '@/lib/db';

export async function GET() {
  try {
    const profile = await readProfile();
    return NextResponse.json(profile);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readProfile();
    
    const updated = {
      ...current,
      ...body,
      lastVisit: new Date().toISOString()
    };
    
    await writeProfile(updated);

    // Contextual Activity Logging
    if (body.role && body.role !== current.role) {
      await logActivity({
        type: 'role_switch',
        description: `Switched career profile to ${body.role}.`,
        meta: { from: current.role, to: body.role }
      });
    }

    if (body.level && body.level !== current.level) {
      await logActivity({
        type: 'level_up',
        description: `Reached ${body.level} proficiency level!`,
        meta: { level: body.level }
      });
    }

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
