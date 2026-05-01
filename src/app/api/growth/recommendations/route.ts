import { NextRequest, NextResponse } from 'next/server';
import { readSkills } from '@/lib/db';

// POST /api/growth/recommendations
// Body: { role?: string, goals?: string[] }
// Returns personalized AI-native growth recommendations
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { role = 'professional', goals = [] } = body;

    const skills = await readSkills();
    const totalSkills = skills.length;
    const topTags = getTopTags(skills);
    const mostUsed = skills.sort((a, b) => b.uses - a.uses).slice(0, 3);

    // Determine proficiency level from skill & usage data
    const level = determineLevel(totalSkills, skills);

    // Gap analysis: compare current tags vs recommended tags for the role
    const roleMap: Record<string, string[]> = {
      'product manager': ['Analysis', 'Data', 'Research', 'Communication', 'Strategy', 'Roadmap'],
      'developer': ['Code', 'Dev', 'Review', 'Testing', 'Automation', 'API'],
      'marketer': ['Email', 'Content', 'SEO', 'Social', 'Analytics', 'Campaign'],
      'recruiter': ['HR', 'Email', 'Outreach', 'Interview', 'Sourcing', 'Assessment'],
      'operations': ['Data', 'Report', 'Workflow', 'Automation', 'Meetings', 'Process'],
      'professional': ['Productivity', 'Communication', 'Analysis', 'Automation', 'Report'],
    };

    const idealTags = roleMap[role.toLowerCase()] || roleMap['professional'];
    const gaps = idealTags.filter(t => !topTags.map(tt => tt.toLowerCase()).includes(t.toLowerCase()));

    const recommendations = buildRecommendations(level, topTags, gaps, totalSkills, mostUsed, goals);
    const learningPath = buildLearningPath(level, role, gaps);
    const milestone = buildMilestone(level, totalSkills);
    const skillTemplates = buildSkillTemplates(role.toLowerCase());

    return NextResponse.json({
      level, topTags, gaps, totalSkills,
      mostUsed: mostUsed.map(s => s.name),
      recommendations, learningPath, milestone, skillTemplates,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Growth analysis failed' }, { status: 500 });
  }
}

function buildSkillTemplates(role: string) {
  const templates: Record<string, any[]> = {
    'product manager': [
      { name: 'PRD Writer', emoji: '📋', tags: ['Strategy', 'Docs'], frequency: 'weekly', tokens: '3.2k', impact: 'High', instructions: 'Write a structured Product Requirements Document from a feature brief. Include problem statement, user stories, success metrics, and technical constraints.' },
      { name: 'User Research Synthesizer', emoji: '🔍', tags: ['Research', 'Analysis'], frequency: 'weekly', tokens: '2.8k', impact: 'High', instructions: 'Synthesize raw user interview notes into themes, insights, and prioritized pain points using affinity mapping principles.' },
      { name: 'Roadmap Narrator', emoji: '🗺️', tags: ['Roadmap', 'Communication'], frequency: 'monthly', tokens: '2.1k', impact: 'Medium', instructions: 'Transform a raw feature backlog into a compelling, stakeholder-ready quarterly roadmap narrative with rationale for prioritization.' },
      { name: 'Sprint Retrospective Analyzer', emoji: '🔄', tags: ['Process', 'Analysis'], frequency: 'weekly', tokens: '1.5k', impact: 'Medium', instructions: 'Process sprint retrospective notes into structured action items, trends, and team health indicators.' },
      { name: 'Competitive Intel Brief', emoji: '🎯', tags: ['Research', 'Strategy'], frequency: 'monthly', tokens: '4.1k', impact: 'High', instructions: 'Analyze competitor features, pricing pages, and changelogs to produce a structured competitive landscape brief.' },
    ],
    'developer': [
      { name: 'PR Review Assistant', emoji: '🔍', tags: ['Code', 'Review'], frequency: 'daily', tokens: '2.5k', impact: 'High', instructions: 'Review a pull request diff for: logic errors, edge cases, security vulnerabilities, code style issues, and suggest specific improvements.' },
      { name: 'Unit Test Generator', emoji: '🧪', tags: ['Testing', 'Dev'], frequency: 'daily', tokens: '2.0k', impact: 'High', instructions: 'Generate comprehensive unit tests for the provided function including happy paths, edge cases, and error states using Jest/pytest syntax.' },
      { name: 'Commit Message Writer', emoji: '✍️', tags: ['Dev', 'Docs'], frequency: 'daily', tokens: '400', impact: 'Medium', instructions: 'Write a conventional commit message and short changelog entry from a git diff. Follow Conventional Commits spec.' },
      { name: 'API Docs Generator', emoji: '📚', tags: ['API', 'Docs'], frequency: 'weekly', tokens: '3.0k', impact: 'High', instructions: 'Generate OpenAPI/Swagger-style documentation for the provided REST API endpoints including request/response schemas and examples.' },
      { name: 'Bug Report Analyzer', emoji: '🐛', tags: ['Debug', 'Automation'], frequency: 'daily', tokens: '1.8k', impact: 'High', instructions: 'Analyze a bug report with stack trace to identify root cause, severity, affected components, and suggest a fix strategy.' },
    ],
    'marketer': [
      { name: 'SEO Blog Outliner', emoji: '📝', tags: ['Content', 'SEO'], frequency: 'weekly', tokens: '2.2k', impact: 'High', instructions: 'Create a detailed SEO-optimized blog post outline with H2/H3 structure, keyword placement, meta description, and CTA placement strategy.' },
      { name: 'Social Media Repurposer', emoji: '📱', tags: ['Social', 'Content'], frequency: 'weekly', tokens: '1.6k', impact: 'Medium', instructions: 'Repurpose a long-form blog post or article into 5 platform-specific social posts: LinkedIn, Twitter/X, Instagram caption, and newsletter snippet.' },
      { name: 'Campaign Brief Writer', emoji: '🎯', tags: ['Campaign', 'Strategy'], frequency: 'monthly', tokens: '3.5k', impact: 'High', instructions: 'Write a complete marketing campaign brief including objective, target audience, messaging pillars, channel strategy, and success metrics.' },
      { name: 'Email Sequence Builder', emoji: '📧', tags: ['Email', 'Automation'], frequency: 'weekly', tokens: '4.0k', impact: 'High', instructions: 'Create a 5-email drip sequence for a product launch with subject lines, preview text, body copy, and CTA for each email.' },
      { name: 'Analytics Report Narrator', emoji: '📊', tags: ['Analytics', 'Report'], frequency: 'weekly', tokens: '2.0k', impact: 'Medium', instructions: 'Transform raw marketing analytics data into an executive-ready narrative with key insights, trend analysis, and recommended actions.' },
    ],
    'recruiter': [
      { name: 'Job Description Writer', emoji: '📄', tags: ['HR', 'Docs'], frequency: 'weekly', tokens: '2.5k', impact: 'High', instructions: 'Write an inclusive, compelling job description from a role brief. Avoid gendered language, include salary band, and structure for ATS optimization.' },
      { name: 'Candidate Outreach Personalizer', emoji: '✉️', tags: ['Outreach', 'Email'], frequency: 'daily', tokens: '800', impact: 'High', instructions: 'Write a personalized 3-sentence LinkedIn outreach message for a candidate using their profile highlights and how they match the open role.' },
      { name: 'Interview Scorecard Generator', emoji: '📋', tags: ['Interview', 'Assessment'], frequency: 'weekly', tokens: '2.0k', impact: 'Medium', instructions: 'Create a structured interview scorecard with competency-based questions, scoring rubric (1-5), and red flag indicators for a specific role.' },
      { name: 'Rejection Email Writer', emoji: '🤝', tags: ['HR', 'Communication'], frequency: 'weekly', tokens: '600', impact: 'Medium', instructions: 'Write a respectful, warm candidate rejection email that preserves the relationship and keeps the door open for future opportunities.' },
      { name: 'Reference Check Script', emoji: '📞', tags: ['Sourcing', 'Assessment'], frequency: 'monthly', tokens: '1.4k', impact: 'Medium', instructions: 'Generate a structured reference check phone script with 8–10 targeted questions to validate a candidate\'s strengths and growth areas.' },
    ],
    'operations': [
      { name: 'SOP Document Writer', emoji: '📋', tags: ['Process', 'Docs'], frequency: 'monthly', tokens: '3.8k', impact: 'High', instructions: 'Convert a rough process description into a formatted Standard Operating Procedure (SOP) with numbered steps, decision trees, and roles/responsibilities.' },
      { name: 'Meeting Minutes Formatter', emoji: '📝', tags: ['Meetings', 'Automation'], frequency: 'daily', tokens: '1.2k', impact: 'High', instructions: 'Convert raw meeting notes into formatted minutes with: attendees, agenda items, decisions made, action items (owner + due date), and next steps.' },
      { name: 'Vendor Comparison Analyzer', emoji: '⚖️', tags: ['Analysis', 'Report'], frequency: 'monthly', tokens: '3.2k', impact: 'High', instructions: 'Analyze vendor proposals and produce a structured comparison matrix with scoring on: price, features, support, scalability, and risk.' },
      { name: 'KPI Dashboard Narrator', emoji: '📊', tags: ['Report', 'Data'], frequency: 'weekly', tokens: '2.0k', impact: 'Medium', instructions: 'Transform raw KPI data into a concise operations health report with trend analysis, traffic-light status indicators, and corrective recommendations.' },
      { name: 'Process Automation Planner', emoji: '🤖', tags: ['Workflow', 'Automation'], frequency: 'monthly', tokens: '4.0k', impact: 'High', instructions: 'Analyze a described manual process and output an automation blueprint: trigger events, steps to automate, tool recommendations, and ROI estimate.' },
    ],
    'professional': [
      { name: 'Weekly Digest Writer', emoji: '📰', tags: ['Productivity', 'Report'], frequency: 'weekly', tokens: '1.8k', impact: 'High', instructions: 'Summarize the week\'s key activities, decisions, blockers, and next priorities into a crisp stakeholder-ready digest email.' },
      { name: 'Email Triage & Reply Drafter', emoji: '📧', tags: ['Communication', 'Automation'], frequency: 'daily', tokens: '900', impact: 'High', instructions: 'Categorize an inbox dump by urgency/type and draft professional reply templates for the top 5 emails requiring response.' },
      { name: 'Meeting Agenda Builder', emoji: '📅', tags: ['Meetings', 'Productivity'], frequency: 'daily', tokens: '700', impact: 'Medium', instructions: 'Build a structured meeting agenda with time slots, discussion owners, pre-read materials, and desired outcomes from a brief topic description.' },
      { name: 'Decision Memo Writer', emoji: '⚡', tags: ['Communication', 'Analysis'], frequency: 'weekly', tokens: '2.5k', impact: 'High', instructions: 'Write a concise 1-pager decision memo: situation, options considered, recommendation, risks, and required approvals.' },
      { name: 'Goal Tracker Reporter', emoji: '🎯', tags: ['Analysis', 'Report'], frequency: 'monthly', tokens: '1.5k', impact: 'Medium', instructions: 'Compare current progress against set goals and generate a structured progress report with % completion, blockers, and re-prioritization suggestions.' },
    ],
  };
  return templates[role] || templates['professional'];
}


function getTopTags(skills: any[]): string[] {
  const tagCount: Record<string, number> = {};
  skills.forEach(s => (s.tags || []).forEach((t: string) => {
    tagCount[t] = (tagCount[t] || 0) + 1;
  }));
  return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
}

function determineLevel(count: number, skills: any[]): string {
  const totalUses = skills.reduce((a, s) => a + s.uses, 0);
  if (count >= 10 && totalUses >= 200) return 'Expert';
  if (count >= 5 && totalUses >= 50) return 'Advanced';
  if (count >= 2) return 'Intermediate';
  return 'Beginner';
}

function buildRecommendations(level: string, tags: string[], gaps: string[], count: number, mostUsed: any[], goals: string[]) {
  const recs = [];

  if (level === 'Beginner') {
    recs.push({
      type: 'quick_win',
      title: 'Create your first reusable Skill',
      description: 'Start by turning your most repeated task into a Skill. Save 10+ minutes per week instantly.',
      action: 'Create Skill',
      priority: 'High',
      impact: '⬆ Token savings: 30%',
    });
  }

  if (gaps.length > 0) {
    recs.push({
      type: 'skill_gap',
      title: `Fill Gap: Build a "${gaps[0]}" Skill`,
      description: `Users in your role who use ${gaps[0]} automation are 2.4x more likely to be in the top productivity tier.`,
      action: 'Browse Templates',
      priority: 'Medium',
      impact: '⬆ Efficiency: +24%',
    });
  }

  if (count >= 3) {
    recs.push({
      type: 'workflow',
      title: 'Chain Skills into a Workflow',
      description: `You have ${count} skills. Connecting them into a pipeline can eliminate 80% of manual handoffs between tasks.`,
      action: 'Build Workflow',
      priority: 'High',
      impact: '⬇ Execution time: -60%',
    });
  }

  recs.push({
    type: 'benchmark',
    title: 'Optimize Model Selection',
    description: 'Run a model benchmark to check if you can switch simpler skills from Sonnet to Haiku — cutting costs by up to 75%.',
    action: 'Run Benchmark',
    priority: 'Medium',
    impact: '⬇ Cost per run: -75%',
  });

  if (level === 'Advanced' || level === 'Expert') {
    recs.push({
      type: 'share',
      title: 'Publish to Team Library',
      description: 'Your high-usage skills are ready for sharing. Top contributors get early access to new Claude capabilities.',
      action: 'Publish Skills',
      priority: 'Low',
      impact: '⬆ Team productivity',
    });
  }

  return recs;
}

function buildLearningPath(level: string, role: string, gaps: string[]) {
  const paths: Record<string, any[]> = {
    Beginner: [
      { step: 1, title: 'Create your first Skill', done: false, est: '5 min' },
      { step: 2, title: 'Run a task analysis', done: false, est: '2 min' },
      { step: 3, title: 'Compare model costs with Benchmark', done: false, est: '3 min' },
    ],
    Intermediate: [
      { step: 1, title: 'Build 5 domain-specific skills', done: false, est: '30 min' },
      { step: 2, title: 'Chain skills into a Workflow', done: false, est: '15 min' },
      { step: 3, title: 'Share a skill to Team Library', done: false, est: '5 min' },
    ],
    Advanced: [
      { step: 1, title: 'Set up Agent Workflows for repetitive pipelines', done: false, est: '1 hr' },
      { step: 2, title: 'Audit skill performance with Privacy Inspector', done: false, est: '10 min' },
      { step: 3, title: 'Mentor a teammate — fork & share 3 skills', done: false, est: '20 min' },
    ],
    Expert: [
      { step: 1, title: 'Architect a multi-agent enterprise workflow', done: false, est: '2 hrs' },
      { step: 2, title: 'Build a domain-specific Skill Pack for your team', done: false, est: '1 hr' },
      { step: 3, title: 'Submit to the Anthropic Skills Showcase', done: false, est: 'Async' },
    ],
  };
  return paths[level] || paths['Beginner'];
}

function buildMilestone(level: string, count: number) {
  const next: Record<string, any> = {
    Beginner: { target: 'Intermediate', condition: 'Create 2+ Skills', progress: Math.min((count / 2) * 100, 100) },
    Intermediate: { target: 'Advanced', condition: 'Reach 5 Skills & 50 total uses', progress: Math.min((count / 5) * 100, 100) },
    Advanced: { target: 'Expert', condition: 'Reach 10 Skills & 200 total uses', progress: Math.min((count / 10) * 100, 100) },
    Expert: { target: 'Anthropic Fellow', condition: 'Contribute to Team Library', progress: 72 },
  };
  return next[level] || next['Beginner'];
}
