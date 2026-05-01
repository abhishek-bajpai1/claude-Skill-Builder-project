import { NextRequest, NextResponse } from 'next/server';
import { readSkills, writeSkills, Skill } from '@/lib/db';
import { randomUUID } from 'crypto';

// GET /api/skills — fetch all skills
export async function GET() {
  try {
    const skills = await readSkills();
    return NextResponse.json({ skills });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 });
  }
}

// POST /api/skills — create a new skill
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, instructions, output, frequency, team, tags, capability, subscription } = body;

    if (!name || !instructions) {
      return NextResponse.json({ error: 'Name and instructions are required' }, { status: 400 });
    }

    const newSkill: Skill = {
      id: randomUUID(),
      name,
      instructions,
      output: output || '',
      frequency: frequency || 'weekly',
      capability: capability || 'workflow',
      subscription: subscription || 'Free',
      team: team || 'My Workspace',
      tags: tags || [],
      uses: 0,
      stars: 0,
      tokens: estimateTokens(instructions),
      createdAt: new Date().toISOString(),
    };

    const skills = await readSkills();
    skills.unshift(newSkill);
    await writeSkills(skills);

    return NextResponse.json({ skill: newSkill }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

// DELETE /api/skills?id=xxx — delete a skill
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });

    const skills = await readSkills();
    const updated = skills.filter(s => s.id !== id);
    await writeSkills(updated);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}

// PATCH /api/skills?id=xxx&action=star — increment usage or star
export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const action = req.nextUrl.searchParams.get('action'); // 'use' | 'star'
    if (!id) return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });

    const skills = await readSkills();
    const idx = skills.findIndex(s => s.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (action === 'star') skills[idx].stars += 1;
    if (action === 'use') skills[idx].uses += 1;
    await writeSkills(skills);

    return NextResponse.json({ skill: skills[idx] });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

function estimateTokens(text: string): string {
  const approxTokens = Math.round(text.split(' ').length * 1.3);
  if (approxTokens < 1000) return `${approxTokens}`;
  return `${(approxTokens / 1000).toFixed(1)}k`;
}
