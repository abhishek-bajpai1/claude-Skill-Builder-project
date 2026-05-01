/**
 * SemanticTriage.ts
 * 
 * Moving from static Regex to Dynamic Architectural Primitives.
 * This module 'understands' intent by mapping it to deep reasoning states.
 */

export interface ArchitecturalPrimitives {
  autonomyLevel: number;        // 0-10 (Judgment required)
  branchingFactor: number;     // 1-10 (Decision complexity)
  validationIntensity: number;  // 0-10 (Ground truth criticality)
  stateRequirement: number;     // 0-10 (Multi-turn dependency)
  instructionComplexity: number; // 0-10 (IA risk)
  reasoningType: 'sequential' | 'exploratory' | 'recursive' | 'deterministic';
}

export interface SemanticTriageResult {
  primitives: ArchitecturalPrimitives;
  reasoningTrace: string[];
}

export function performSemanticTriage(task: string): SemanticTriageResult {
  const lower = task.toLowerCase();
  
  // Simulated Semantic Analysis
  const trace: string[] = [];
  
  // 1. Detect Decision Branching
  const hasBranching = /(if|unless|either|choice|depends|case|selection)/.test(lower);
  if (hasBranching) trace.push("Detected high Branching Factor: intent contains conditional pathing.");
  
  // 2. Detect Autonomy (Judgment)
  const needsJudgment = /(best|audit|recommend|critique|evaluate|decide|choose)/.test(lower);
  if (needsJudgment) trace.push("High Autonomy detected: task requires subjective AI evaluation.");
  
  // 3. Detect Validation (Ground Truth)
  const needsValidation = /(verify|check|confirm|correct|standard|compliance|exact)/.test(lower);
  if (needsValidation) trace.push("Ground Truth Criticality: intent requires strict schema adherence.");

  // 4. Detect Statefulness
  const isStateful = /(then|after|finally|remember|consistent|history)/.test(lower);
  if (isStateful) trace.push("Contextual Statefulness: multi-step trajectory detected.");

  const primitives: ArchitecturalPrimitives = {
    autonomyLevel: needsJudgment ? 8 : hasBranching ? 6 : 2,
    branchingFactor: hasBranching ? 9 : 3,
    validationIntensity: needsValidation ? 10 : 4,
    stateRequirement: isStateful ? 8 : 2,
    instructionComplexity: task.length > 200 ? 9 : 4,
    reasoningType: needsJudgment ? 'recursive' : isStateful ? 'sequential' : 'deterministic'
  };

  return { primitives, reasoningTrace: trace };
}
