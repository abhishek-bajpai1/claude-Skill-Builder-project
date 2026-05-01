import { NextRequest, NextResponse } from 'next/server';

// POST /api/pm/classify
// Body: { requests: string[] }
export async function POST(req: NextRequest) {
  try {
    const { requests = [] } = await req.json();
    if (!requests.length) return NextResponse.json({ error: 'No requests provided' }, { status: 400 });

    const classified = requests.map((r: string, idx: number) => ({
      id: idx,
      text: r,
      ...classifyRequest(r),
    }));

    // Group by theme
    const groups = groupByTheme(classified);

    return NextResponse.json({ classified, groups });
  } catch (e) {
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 });
  }
}

function classifyRequest(text: string) {
  const lower = text.toLowerCase();

  // Type
  let type = 'Enhancement';
  let typeColor = '#3b82f6';
  if (/(bug|broken|error|crash|fail|not work|wrong|issue|can't|cannot)/.test(lower)) {
    type = 'Bug Report'; typeColor = '#ef4444';
  } else if (/(new|add|create|build|want|need|wish|request|could you|would love)/.test(lower)) {
    type = 'New Feature'; typeColor = '#8b5cf6';
  } else if (/(slow|performance|faster|speed|lag|latency)/.test(lower)) {
    type = 'Performance'; typeColor = '#f59e0b';
  } else if (/(confus|unclear|hard to|difficult|ux|ui|design|flow)/.test(lower)) {
    type = 'UX Issue'; typeColor = '#ec4899';
  }

  // Priority
  let priority = 'Medium';
  let priorityScore = 5;
  if (/(urgent|blocker|critical|asap|immediately|production|down|broken)/.test(lower)) {
    priority = 'Critical'; priorityScore = 10;
  } else if (/(important|need|required|must|key|core|main)/.test(lower)) {
    priority = 'High'; priorityScore = 7;
  } else if (/(nice to have|sometime|eventually|future|low|minor)/.test(lower)) {
    priority = 'Low'; priorityScore = 2;
  }

  // Theme tag
  let theme = 'General';
  if (/(export|download|pdf|csv|report)/.test(lower)) theme = 'Export & Reports';
  else if (/(login|auth|password|sso|sign)/.test(lower)) theme = 'Authentication';
  else if (/(notif|email|alert|remind)/.test(lower)) theme = 'Notifications';
  else if (/(dashboard|chart|graph|visual|metric)/.test(lower)) theme = 'Analytics & Dashboards';
  else if (/(integrat|api|sync|connect|webhook)/.test(lower)) theme = 'Integrations';
  else if (/(search|filter|sort|find)/.test(lower)) theme = 'Search & Navigation';
  else if (/(mobile|phone|responsive|app)/.test(lower)) theme = 'Mobile';
  else if (/(slow|fast|load|performance)/.test(lower)) theme = 'Performance';

  return { type, typeColor, priority, priorityScore, theme };
}

function groupByTheme(items: any[]) {
  const groups: Record<string, any[]> = {};
  items.forEach(item => {
    if (!groups[item.theme]) groups[item.theme] = [];
    groups[item.theme].push(item);
  });
  // Sort each group by priority score
  Object.values(groups).forEach(g => g.sort((a, b) => b.priorityScore - a.priorityScore));
  return groups;
}
