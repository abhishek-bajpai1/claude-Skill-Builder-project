/**
 * refactorEngine.ts
 * 
 * Provides automated refactoring of raw user prompts into Claude-Native Modular Skills.
 * Uses best practices: XML tags, Clear instructions, and Separation of Context.
 */

export interface RefactorResult {
  instructions: string;
  xmlTags: string[];
  isModular: boolean;
}

export function refactorToSkill(rawTask: string): RefactorResult {
  // AI-Native Heuristics for Refactoring
  const lines = rawTask.split('\n').filter(l => l.trim().length > 0);
  
  // 1. Identify "The Goal"
  const goalLine = lines.find(l => l.toLowerCase().includes('write') || l.toLowerCase().includes('build') || l.toLowerCase().includes('audit')) || lines[0];
  
  // 2. Wrap in XML Structure (The "Claude Best Practice")
  const refactored = `
<task_objective>
${goalLine}
</task_objective>

<process_instructions>
1. Analyze the context provided in the input.
2. Apply domain-specific expertise to identify core patterns.
3. Generate the following output structure:
   - Summary of Findings
   - Actionable Recommendations
   - Predicted Impact
</process_instructions>

<output_formatting>
Always wrap the response in clear markdown sections. 
Use bold text for critical emphasis.
</output_formatting>
`.trim();

  return {
    instructions: refactored,
    xmlTags: ['task_objective', 'process_instructions', 'output_formatting'],
    isModular: true
  };
}

export function calculateContextRot(task: string): number {
  // Heuristic: Poorly structured prompts with filler words have higher 'rot'.
  const fillerWords = ['please', 'i want to', 'could you', 'maybe', 'something like', 'uh', 'um'];
  const words = task.toLowerCase().split(' ');
  const fillerCount = words.filter(w => fillerWords.includes(w)).length;
  
  // Base rot between 5% and 45% based on filler density
  const rot = Math.min(45, Math.max(5, (fillerCount / words.length) * 100 * 2));
  return Math.round(rot);
}
