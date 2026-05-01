import { NextRequest, NextResponse } from 'next/server';
import { readWorkspace, writeWorkspace, logActivity } from '@/lib/db';

export async function GET() {
  try {
    const ws = await readWorkspace();
    return NextResponse.json(ws);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load workspace' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readWorkspace();
    
    const updated = {
      ...current,
      ...body,
      lastUpdate: new Date().toISOString()
    };
    
    await writeWorkspace(updated);

    // Dynamic Activity Logging
    if (body.riceBacklog && body.riceBacklog.length > current.riceBacklog.length) {
      await logActivity({
        type: 'rice_run',
        description: `Prioritized ${body.riceBacklog.length} features in the RICE tool.`,
        meta: { count: body.riceBacklog.length }
      });
    }

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save workspace' }, { status: 500 });
  }
}
