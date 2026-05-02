import { NextRequest, NextResponse } from 'next/server';

// POST /api/benchmark — simulate model benchmarks for a task
export async function POST(req: NextRequest) {
  try {
    const { task, tokens } = await req.json();
    const lower = (task || '').toLowerCase();

    const isComplex = /(multiple|pipeline|steps|agent|workflow)/.test(lower);
    const isSimple = /(summarize|list|draft|write)/.test(lower);

    const models = [
      {
        id: 'haiku',
        name: 'Claude Haiku',
        badge: 'Fastest & Cheapest',
        color: '#3b82f6',
        speed: isComplex ? 88 : 97,
        quality: isSimple ? 72 : 65,
        costIndex: 12,
        latency: isComplex ? '4s' : '2s',
        tokens: isComplex ? '3.1k' : '1.8k',
        costPerRun: '$0.0004',
        roi: '98% Cost Reduction',
        businessImpact: 'High-volume low-cost scaling',
        bestFor: 'Simple classification, extraction, short drafts',
      },
      {
        id: 'sonnet',
        name: 'Claude Sonnet',
        badge: 'Recommended',
        color: '#d97757',
        speed: isComplex ? 68 : 76,
        quality: isSimple ? 93 : 91,
        costIndex: 42,
        latency: isComplex ? '12s' : '6s',
        tokens: isComplex ? '4.8k' : '2.5k',
        costPerRun: '$0.015',
        roi: '12.5x Efficiency Gain',
        businessImpact: 'Optimal balance for production AI',
        bestFor: 'Complex reasoning, multi-step tasks, structured output',
        highlight: true,
      },
      {
        id: 'opus',
        name: 'Claude Opus',
        badge: 'Most Capable',
        color: '#8b5cf6',
        speed: isComplex ? 38 : 45,
        quality: isSimple ? 97 : 99,
        costIndex: 88,
        latency: isComplex ? '32s' : '18s',
        tokens: isComplex ? '7.2k' : '3.4k',
        costPerRun: '$0.075',
        roi: '99.9% Accuracy Delta',
        businessImpact: 'Highest strategic value insights',
        bestFor: 'Research, nuanced analysis, creative tasks',
      },
    ];

    const smartChoice = isComplex ? 'opus' : isSimple ? 'haiku' : 'sonnet';

    return NextResponse.json({ models, smartChoice });
  } catch (e) {
    return NextResponse.json({ error: 'Benchmark failed' }, { status: 500 });
  }
}
