import { NextRequest, NextResponse } from 'next/server';

// POST /api/pm/prioritize
// Body: { features: Array<{ name: string; reach?: number; impact?: number; confidence?: number; effort?: number }> }
export async function POST(req: NextRequest) {
  try {
    const { features = [] } = await req.json();
    if (!features.length) return NextResponse.json({ error: 'No features provided' }, { status: 400 });

    const scored = features.map((f: any) => {
      // Auto-score if not provided (heuristic from name/description)
      const lower = (f.name || '').toLowerCase();

      const reach = f.reach ?? scoreReach(lower);
      const impact = f.impact ?? scoreImpact(lower);
      const confidence = f.confidence ?? 70;
      const effort = f.effort ?? scoreEffort(lower);

      const rice = Math.round((reach * impact * confidence) / 100 / effort);

      return {
        name: f.name,
        reach,
        impact,
        confidence,
        effort,
        rice,
        tier: rice > 300 ? 'P0 — Must Have' : rice > 150 ? 'P1 — Should Have' : rice > 50 ? 'P2 — Could Have' : 'P3 — Won\'t Have',
        tierColor: rice > 300 ? '#ef4444' : rice > 150 ? '#d97757' : rice > 50 ? '#3b82f6' : '#94a3b8',
        rationale: buildRationale(reach, impact, confidence, effort, rice),
      };
    });

    // Sort by RICE score descending
    scored.sort((a: any, b: any) => b.rice - a.rice);

    return NextResponse.json({ prioritized: scored });
  } catch (e) {
    return NextResponse.json({ error: 'Prioritization failed' }, { status: 500 });
  }
}

function scoreReach(name: string): number {
  if (/(all|everyone|global|dashboard|home|search)/.test(name)) return 9000;
  if (/(notification|email|alert|report)/.test(name)) return 5000;
  if (/(enterprise|admin|api|integration)/.test(name)) return 2000;
  return 3000;
}

function scoreImpact(name: string): number {
  if (/(revenue|payment|checkout|retention|churn)/.test(name)) return 3;
  if (/(performance|speed|latency|bug|fix|crash)/.test(name)) return 3;
  if (/(onboard|signup|convert|activation)/.test(name)) return 2;
  if (/(delight|polish|ui|design|animation)/.test(name)) return 1;
  return 2;
}

function scoreEffort(name: string): number {
  if (/(redesign|migration|refactor|rebuild|architecture)/.test(name)) return 8;
  if (/(integration|api|sync|webhook)/.test(name)) return 5;
  if (/(button|label|copy|text|color|icon)/.test(name)) return 1;
  return 3;
}

function buildRationale(r: number, i: number, c: number, e: number, rice: number): string {
  if (rice > 300) return `High reach (${r.toLocaleString()} users) combined with strong impact (${i}x) makes this a top priority.`;
  if (rice > 150) return `Good balance of reach and impact. Confidence is ${c}%, suggesting more discovery may de-risk further.`;
  if (rice > 50) return `Moderate RICE score. Consider batching with similar work to improve efficiency (effort: ${e}).`;
  return `Low reach-to-effort ratio. Revisit when confidence improves or effort decreases.`;
}
