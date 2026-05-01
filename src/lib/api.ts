// Shared API client functions for all Skill Advisor endpoints

export interface SimulationStep {
  step: string;
  successProbability: number;
  driftRisk: number;
  failureMode: string;
}

export interface TrajectoryPoint {
  turn: number;
  probability: number;
}

export interface TierResults {
  reliability: number;
  tokens: number;
  latency: string;
  quality: number;
  failureTurn?: number;
}

export interface TournamentLedger {
  prompt: TierResults;
  workflow: TierResults;
  skill: TierResults;
  agent: TierResults;
}

export interface AnalysisResult {
  recommendation: 'workflow' | 'skill' | 'agent';
  capability: 'workflow' | 'skill' | 'agent';
  subscription: 'Free' | 'Pro' | 'Max';
  confidence: number;
  reason: string;
  skillName: string;
  tags: string[];
  frequencyHint: string;
  tokenSavings: number;
  
  // High-Fidelity Strategic Data
  tournament: TournamentLedger;
  trajectories: Record<string, TrajectoryPoint[]>;
  
  simulation: {
    reliabilityScore: number;
    driftRisk: number;
    stabilityHeatmap: SimulationStep[];
    suggestedGuardrails: string[];
    roi: { monthlySavings: number; efficiencyGain: string; timeSaved: string; humanSummary: string };
    contextRot: number;
  };

  refactoredPrompt?: {
    instructions: string;
    xmlTags: string[];
    isModular: boolean;
  };

  strategicRationale: string; // Expert reasoning for the chosen architecture
  
  triage: {
    primitives: any;
    reasoningTrace: string[];
  };

  predictions: { tokens: string; latency: string; quality: string; cost: string };
  alternatives: { type: string; label: string; time: string; tokens: string; quality: string; isRecommended: boolean; sub?: string }[];
  
  strategist: {
    modelRecommendation: { id: string; name: string; reason: string };
    collaborativeAdvice: { type: 'fork' | 'new'; match?: string; rationale: string };
    learningCurve: { level: string; estimate: string };
  };
  

  masteryRoadmap: {
    badge: string;
    dataSource?: string;
    roleContext?: string;
    coreSkills: string[];
    resourceBank: {
      predictedTokens: string;
      buildDuration: string;
    };
    milestones: {
      daily: string;
      weekly: string;
      monthly: string;
    };
  };
}

export interface Skill {
  id: string;
  name: string;
  instructions: string;
  output: string;
  frequency: string;
  capability: 'workflow' | 'skill' | 'agent';
  subscription: 'Free' | 'Pro' | 'Max';
  team?: string;
  tags?: string[];
  uses: number;
  stars: number;
  tokens: string;
  createdAt: string;
}

export async function analyzeTask(task: string, persona?: string): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, persona }),
  });
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills');
  if (!res.ok) throw new Error('Failed to fetch skills');
  const data = await res.json();
  return data.skills;
}

export async function createSkill(payload: Omit<Skill, 'id' | 'uses' | 'stars' | 'tokens' | 'createdAt'>): Promise<Skill> {
  const res = await fetch('/api/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create skill');
  const data = await res.json();
  return data.skill;
}

export async function deleteSkill(id: string): Promise<void> {
  const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete skill');
}

export async function starSkill(id: string): Promise<Skill> {
  const res = await fetch(`/api/skills?id=${id}&action=star`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to star skill');
  const data = await res.json();
  return data.skill;
}

export async function fetchBenchmark(task: string) {
  const res = await fetch('/api/benchmark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error('Benchmark failed');
  return res.json();
}
