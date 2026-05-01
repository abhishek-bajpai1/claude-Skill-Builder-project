import { NextRequest, NextResponse } from 'next/server';

// POST /api/pm/stakeholder
// Body: { update: string; product?: string }
export async function POST(req: NextRequest) {
  try {
    const { update = '', product = 'the product' } = await req.json();
    if (!update.trim()) return NextResponse.json({ error: 'Update text required' }, { status: 400 });

    const audiences = buildAudienceMessages(update, product);
    return NextResponse.json({ audiences });
  } catch (e) {
    return NextResponse.json({ error: 'Stakeholder generation failed' }, { status: 500 });
  }
}

function buildAudienceMessages(update: string, product: string) {
  // Extract key signal words from the update
  const lower = update.toLowerCase();
  const hasMetrics = /(\d+%|\d+x|revenue|cost|save|churn|retention|conversion)/.test(lower);
  const hasBug = /(bug|fix|issue|error|crash|broken|slow)/.test(lower);
  const hasFeature = /(feature|launch|ship|release|built|added|new)/.test(lower);
  const hasDelay = /(delay|pushed|blocked|risk|blocker|dependency|slip)/.test(lower);

  const tone = hasDelay ? 'cautionary' : hasFeature ? 'celebratory' : hasBug ? 'remedial' : 'informative';

  return [
    {
      audience: 'CEO / Leadership',
      emoji: '🏛️',
      tone: 'Strategic & concise',
      color: '#8b5cf6',
      message: generateCEO(update, product, tone, hasMetrics),
    },
    {
      audience: 'Engineering Team',
      emoji: '💻',
      tone: 'Technical & detailed',
      color: '#3b82f6',
      message: generateEngineering(update, product, hasBug, hasFeature, hasDelay),
    },
    {
      audience: 'Sales Team',
      emoji: '📈',
      tone: 'Opportunity-focused',
      color: '#22c55e',
      message: generateSales(update, product, hasFeature, hasMetrics),
    },
    {
      audience: 'Customer Success',
      emoji: '🤝',
      tone: 'Customer-impact',
      color: '#d97757',
      message: generateCS(update, product, hasBug, hasFeature),
    },
  ];
}

function generateCEO(update: string, product: string, tone: string, hasMetrics: boolean): string {
  const opener = tone === 'celebratory' ? '✅ Progress Update:' : tone === 'cautionary' ? '⚠️ Risk Update:' : '📊 Status Update:';
  return `${opener} Re: ${product}\n\n${update}\n\n${hasMetrics ? 'Key metrics are tracked and will be reported in the next business review.' : 'We continue to monitor impact and will surface data-driven insights in the next leadership sync.'}\n\nNext milestone: TBD — reach out if this requires immediate attention.`;
}

function generateEngineering(update: string, product: string, hasBug: boolean, hasFeature: boolean, hasDelay: boolean): string {
  const header = hasBug ? '🐛 Bug Context:' : hasFeature ? '🚀 Feature Scope:' : '📋 Sprint Update:';
  return `${header} ${product}\n\n${update}\n\n${hasBug ? 'Please prioritize root-cause analysis and add regression tests to prevent recurrence.' : hasDelay ? 'Let\'s sync async to identify blockers and adjust sprint capacity if needed.' : 'Ensure all acceptance criteria are met before marking done. Code review window: 24h.'}\n\nIf you have questions, ping in Slack thread.`;
}

function generateSales(update: string, product: string, hasFeature: boolean, hasMetrics: boolean): string {
  return `📣 Product Update for ${product}\n\n${hasFeature ? 'Great news — we\'ve shipped new capabilities that may be relevant to your pipeline conversations.' : 'Heads up on a recent update that may come up in customer calls.'}\n\nSummary: ${update}\n\n${hasMetrics ? 'If customers ask about ROI, we now have data to back this up — grab it from the sales portal.' : 'Feel free to use this as a talking point. The product team is available for technical demos.'}\n\nNext: Look for the full release note in the weekly Sales Digest.`;
}

function generateCS(update: string, product: string, hasBug: boolean, hasFeature: boolean): string {
  return `${hasBug ? '🔧 Resolved:' : hasFeature ? '🎉 What\'s New:' : '📬 Update:'} ${product}\n\n${hasBug ? 'We identified and resolved an issue that may have affected some customers. ' : hasFeature ? 'We\'ve shipped an improvement that enhances the customer experience. ' : ''}${update}\n\n${hasBug ? 'If customers raise this issue, confirm it is now resolved. Escalate to #bug-tracker if they are still seeing it.' : 'Feel free to highlight this in next week\'s customer check-ins as a value-add.'}\n\nCustomer-facing docs will be updated shortly.`;
}
