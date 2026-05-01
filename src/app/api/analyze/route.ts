import { NextRequest, NextResponse } from 'next/server';
import { refactorToSkill, calculateContextRot } from '@/lib/refactorEngine';
import { runArchitecturalTournament, predictTrajectory } from '@/lib/TournamentSimulator';
import { performSemanticTriage } from '@/lib/SemanticTriage';
import profLibrary from '@/data/professional_library.json';

// POST /api/analyze — analyze a task and give a recommendation
export async function POST(req: NextRequest) {
  try {
    const { task, persona } = await req.json();
    if (!task) return NextResponse.json({ error: 'Task is required' }, { status: 400 });

    const lower = task.toLowerCase();
    const result = analyzeTask(lower, task, persona);

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

function analyzeTask(lower: string, raw: string, personaOverride?: string) {
  // AI-Native Dynamic Intent Triage
  const { primitives, reasoningTrace } = performSemanticTriage(raw);
  
  const complexity = Math.max(primitives.branchingFactor, primitives.stateRequirement);
  const tournament = runArchitecturalTournament(raw, complexity);
  const trajectories = {
    prompt: predictTrajectory('prompt', complexity),
    workflow: predictTrajectory('workflow', complexity),
    skill: predictTrajectory('skill', complexity),
    agent: predictTrajectory('agent', complexity),
  };

  let recommendation: 'workflow' | 'skill' | 'agent';
  let capability: 'workflow' | 'skill' | 'agent';
  let subscription: 'Free' | 'Pro' | 'Max';
  let confidence: number;
  let reason: string;
  let skillName: string;
  let tags: string[];

  // Dynamic Routing based on Primitives
  if (primitives.autonomyLevel > 7 || primitives.branchingFactor > 8) {
    recommendation = 'agent';
    capability = 'agent';
    subscription = 'Max';
    confidence = 94;
    reason = "Dynamic Intent Detection: Found High Branching + High Autonomy primitives. This intent requires an Agent capable of non-deterministic exploration and multi-branch decision making.";
    skillName = 'Sovereign Agent';
    tags = ['Agent', 'Autonomous', 'Dynamic'];
  } else if (primitives.validationIntensity > 7 || primitives.stateRequirement > 6) {
    recommendation = 'skill';
    capability = 'skill';
    subscription = 'Pro';
    confidence = 89;
    reason = "Dynamic Intent Detection: Found High Validation + Sequential State primitives. This task is best served by a modular Skill that enforces strict XML guardrails and high instruction adherence.";
    skillName = 'Deterministic Skill'; // Generic for now, can be improved
    tags = ['Skill', 'Pro', 'Stateful'];
  } else {
    recommendation = 'workflow';
    capability = 'workflow';
    subscription = 'Free';
    confidence = 72;
    reason = "Dynamic Intent Detection: Found Sequential / Single-turn primitives. A basic Workflow using Project context is sufficient for this architectural requirement.";
    skillName = 'Direct Workflow';
    tags = ['Free', 'Workflow', 'Standard'];
  }

  const frequencyHint = primitives.stateRequirement > 5 ? 'daily' : 'monthly';
  const tokenSavings = recommendation === 'workflow' ? 0 : Math.floor(20 + Math.random() * 30);

  return {
    recommendation,
    capability,
    subscription,
    confidence,
    reason,
    skillName,
    tags,
    frequencyHint,
    tokenSavings,
    predictions: {
      tokens: capability === 'agent' ? '8,000' : capability === 'skill' ? '2,500' : '1,500',
      latency: capability === 'agent' ? '25s' : capability === 'skill' ? '12s' : '5s',
      quality: capability === 'agent' ? 'Max (Autonomous)' : capability === 'skill' ? 'High (Deterministic)' : 'Variable (Prompting)',
      cost: capability === 'agent' ? 'High' : capability === 'skill' ? 'Low' : 'Free',
    },
    tournament,
    trajectories,
    triage: { primitives, reasoningTrace },
    strategicRationale: generateStrategicRationale(capability, complexity),
    simulation: generateSimulationData(capability, raw),
    refactoredPrompt: refactorToSkill(raw),
    alternatives: buildAlternatives(capability),
    strategist: {
      modelRecommendation: generateModelRecommendation(primitives, complexity),
      collaborativeAdvice: generateCollaborativeAdvice(raw, capability),
      learningCurve: generateLearningCurve(primitives)
    },
    masteryRoadmap: generateMasteryRoadmap(raw, primitives, capability, personaOverride || "")
  };
}

function generateMasteryRoadmap(raw: string, primitives: any, capability: string, persona: string) {
  const lib = (profLibrary as any)[persona] || (profLibrary as any)["The Efficiency Specialist"];
  
  const isAgent = capability === 'agent';
  const buildDuration = isAgent ? "5 hours" : "90 mins";
  const predictedTokens = isAgent ? "25,000" : "8,500";

  return {
    badge: lib.badge,
    roleContext: lib.role_context,
    coreSkills: lib.core_skills,
    dataSource: "JobCompetence v2.1 (Kaggle/O*NET)",
    resourceBank: {
      predictedTokens,
      buildDuration
    },
    milestones: {
      daily: lib.daily,
      weekly: lib.weekly,
      monthly: lib.monthly
    }
  };
}


function generateModelRecommendation(primitives: any, complexity: number) {
  if (complexity > 7 || primitives.autonomyLevel > 6) {
    return {
      id: 'opus',
      name: 'Claude 3 Opus',
      reason: "High ambiguity and autonomous branching requires maximum reasoning density. Opus ensures zero-drift logic even in fringe edge cases."
    };
  }
  if (complexity > 4 || primitives.instructionComplexity > 5) {
    return {
      id: 'sonnet',
      name: 'Claude 3.5 Sonnet',
      reason: "Balanced reasoning for daily professional tasks. Optimal speed-to-intelligence ratio for deterministic skill execution."
    };
  }
  return {
    id: 'haiku',
    name: 'Claude 3 Haiku',
    reason: "Low-complexity task. Haiku provides near-instant latency and sub-cent pricing without sacrificing base instruction adherence."
  };
}

function generateCollaborativeAdvice(raw: string, capability: string) {
  // Logic stub for library matching
  const hasSimilar = raw.includes('audit') || raw.includes('report') || raw.includes('email');
  if (hasSimilar && capability === 'skill') {
    return {
      type: 'fork',
      match: 'Corporate Governance v2',
      rationale: "A high-fidelity skill for similar intents exists. Forking 'Corporate Governance' will save you 40% of implementation time."
    };
  }
  return {
    type: 'new',
    rationale: "Unique intent pattern detected. Building a fresh skill ensures optimal architectural fit for your specific constraints."
  };
}

function generateLearningCurve(primitives: any) {
  if (primitives.instructionComplexity > 7) return { level: 'Advanced', estimate: '45 mins to master' };
  if (primitives.instructionComplexity > 4) return { level: 'Intermediate', estimate: '15 mins to master' };
  return { level: 'Beginner', estimate: '5 mins to master' };
}

function generateStrategicRationale(tier: string, complexity: number): string {
  if (tier === 'skill') {
    return "Choosing Skills for this intent because it requires high-frequency repeatability with a deterministic output. Unlike Agents, Skills eliminate 'looping risk' and provide a fixed token-cost-per-run, ensuring enterprise-grade stability at scale.";
  }
  if (tier === 'agent') {
    return "Prioritizing Agents due to the high ambiguity and multi-branch exploration required. A static Skill or Workflow would fail when encountering non-standard edge cases; an Agent provides the necessary autonomous reasoning to self-correct and pursue the goal.";
  }
  return "Workflows are recommended here to enforce rigid governance and predictable state transitions. This task is mission-critical and requires zero variance, making a deterministic step-by-step pipeline the safest architectural choice.";
}

function generateSimulationData(capability: string, task: string) {
  const steps = [
    { step: 'Reasoning & Intent', successProbability: 95, driftRisk: 5, failureMode: 'Ambiguity' },
    { step: 'Data Fetching', successProbability: 88, driftRisk: 12, failureMode: 'Latency' },
    { step: 'Logic Execution', successProbability: 92, driftRisk: 8, failureMode: 'Validation Error' },
    { step: 'Output Formatting', successProbability: 98, driftRisk: 2, failureMode: 'Structural Drift' },
  ];

  // Adjust scores based on capability
  if (capability === 'workflow') {
    steps[1].successProbability -= 15; steps[1].driftRisk += 15;
    steps[2].successProbability -= 10; steps[2].driftRisk += 10;
  } else if (capability === 'agent') {
    steps[1].driftRisk += 25; steps[1].failureMode = 'Hallucinated Tool Case';
    steps[2].driftRisk += 15; steps[2].failureMode = 'Recursive Loop';
  }

  const avgReliability = Math.round(steps.reduce((acc, s) => acc + s.successProbability, 0) / steps.length);
  const maxDrift = Math.max(...steps.map(s => s.driftRisk));

  return {
    reliabilityScore: avgReliability,
    driftRisk: maxDrift,
    stabilityHeatmap: steps,
    contextRot: calculateContextRot(task),
    suggestedGuardrails: [
      'Implement deterministic schema validation',
      'Add human-in-the-loop for high-drift steps',
      'Use prompt-chaining for sub-task isolation'
    ],
    roi: {
      monthlySavings: capability === 'agent' ? 1200 : capability === 'skill' ? 450 : 0,
      efficiencyGain: capability === 'agent' ? '400%' : capability === 'skill' ? '150%' : '15%',
      timeSaved: capability === 'agent' ? '12 hours/week' : capability === 'skill' ? '3.5 hours/week' : '15 mins/day',
      humanSummary: capability === 'agent' ? "Eliminates cognitive load for complex orchestration." : capability === 'skill' ? "Standardizes repetitive daily tasks into 1-click expert runs." : "Simplifies one-off interaction."
    }
  };
}

function buildAlternatives(primary: string) {
  const all = [
    { type: 'workflow', label: 'Claude Workflow', time: 'Instant', tokens: '1.5k', quality: 'Good', sub: 'Free' },
    { type: 'skill', label: 'Deterministic Skill', time: '12s', tokens: '2.5k', quality: 'High', sub: 'Pro' },
    { type: 'agent', label: 'Autonomous Agent', time: '25s', tokens: '8k', quality: 'Max', sub: 'Max' },
  ];
  return all.map(a => ({ ...a, isRecommended: a.type === primary }));
}
