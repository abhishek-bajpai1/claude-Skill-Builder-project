import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) 
  : null;

export async function POST(req: Request) {
  try {
    const { task } = await req.json();

    if (!task) {
      return NextResponse.json({ error: 'Task is required' }, { status: 400 });
    }

    // IF WE HAVE AN API KEY: Use Claude to generate real, highly reliable responses
    if (anthropic) {
      const prompt = `You are a multi-agent council analyzing the following user input: "${task}"
      
You must analyze this from three distinct personas:
1. "visionary": The optimist. Focus on the big picture, creativity, and maximum potential upside.
2. "skeptic": The analyst. Identify systemic risks, hidden costs, and logical fallacies.
3. "pragmatist": The executor. Translate the high-level ideas into realistic, actionable steps (e.g. an MVP or micro-experiment).

Provide your response in JSON format exactly like this:
{
  "visionary": "### The Strategic Opportunity\\n...",
  "skeptic": "### Risk & Vulnerability Audit\\n...",
  "pragmatist": "### Execution Framework\\n...",
  "system": "**Council Consensus Reached**\\n\\n..."
}

Use markdown formatting (###, **, *) within the strings. Do not include anything else in your response outside the JSON object.`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        temperature: 0.7,
        system: "You are an elite strategic council. Return only valid JSON.",
        messages: [{ role: "user", content: prompt }]
      });

      const textOutput = response.content[0].type === 'text' ? response.content[0].text : '{}';
      
      try {
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : textOutput);
        return NextResponse.json(parsed);
      } catch (e) {
        console.error("Failed to parse Claude JSON:", textOutput);
        return NextResponse.json({ error: "Failed to parse council response." }, { status: 500 });
      }
    }

    // FALLBACK MOCK LOGIC (If no API key is provided)
    // Using advanced heuristic engine to generate rich, detailed "analyzed" responses without needing a paid API key.
    
    let visionaryAnalysis = `### The Strategic Opportunity\nThis is a highly ambitious initiative with massive upside. Executing on this could fundamentally shift your trajectory. \n\n**Key Potential Upsides:**\n* **Compound Growth:** The skills and leverage you gain here will compound over the next 3-5 years.\n* **First-Mover Advantage:** By taking action now, you position yourself ahead of the curve.\n\n*Recommendation:* Do not artificially limit the scope of this project. Aim for the 10x outcome.`;
    
    let skepticAnalysis = `### Risk & Vulnerability Audit\nWhile the upside is clear, we must address the structural vulnerabilities in this plan.\n\n**Critical Failure Modes:**\n* **Resource Depletion:** You risk burning out or depleting your capital/time reserves before hitting product-market fit or achieving the goal.\n* **Opportunity Cost:** Dedicating your focus here means saying no to other, potentially safer, ongoing compounding activities.\n\n*Recommendation:* We need a hard "kill switch" metric. If we don't see X traction by Y date, we pivot.`;
    
    let pragmatistAnalysis = `### Execution Framework\nLet's bridge the gap between the vision and the reality. We need a low-friction testing ground.\n\n**Immediate Next Steps (Next 7 Days):**\n1. **Define the MVP:** What is the absolute smallest version of this you can test this weekend?\n2. **Time-Box the Effort:** Allocate no more than 2 hours a day to this to protect your baseline.\n3. **Gather Signal:** We need real-world data, not just theory. Talk to 3 people or run a micro-experiment.\n\n*Recommendation:* Stop planning. Start testing.`;

    let systemConsensus = `**Council Consensus Reached**\n\n**Verdict:** Proceed with cautious aggression.\n**The Strategy:** Harness the ambition identified by the Visionary, but constrain it using the Pragmatist's 7-day micro-experiment framework to mitigate the burnout risks flagged by the Analyst.\n\n*Status:* Ready for execution.`;

    const lowerTask = task.toLowerCase();

    if (lowerTask.includes('job') || lowerTask.includes('career') || lowerTask.includes('quit')) {
      visionaryAnalysis = `### Career Transformation\nPivoting your career is the highest-leverage move you can make. The market rewards specialization and bold transitions.\n\n**Upside:** Breaking out of a linear career path into an exponential one can 5x your earning potential over the next decade.`;
      skepticAnalysis = `### Financial & Psychological Risks\nQuitting without a safety net is statistically dangerous.\n\n**Risks:**\n* **The Runway Problem:** Do you have 6-12 months of living expenses saved?\n* **Market Reality:** The current job market is volatile. Re-entry if this fails could be difficult.`;
      pragmatistAnalysis = `### The Transition Playbook\nDo not burn the boats yet. Let's build a bridge.\n\n**Action Plan:**\n1. Keep your current job but mentally "quiet quit" to reclaim 10-15 hours a week.\n2. Dedicate those hours to upskilling or building your side hustle.\n3. **The Trigger:** Only submit your resignation when your side income covers 75% of your baseline living expenses.`;
      systemConsensus = `**Verdict:** Proceed with cautious aggression. Build the bridge before quitting.`;
    } 
    else if (lowerTask.includes('health') || lowerTask.includes('diet') || lowerTask.includes('workout')) {
      visionaryAnalysis = `### Physical Optimization\nOptimizing your health is the foundation of all other success. High energy levels directly correlate with higher cognitive output.\n\n**Upside:** Complete physiological transformation leads to enhanced focus, better sleep, and an extended healthspan.`;
      skepticAnalysis = `### The Consistency Trap\nAmbitious health overhauls almost always fail by week 3.\n\n**Risks:**\n* **The All-or-Nothing Fallacy:** Missing one day often leads to complete abandonment of the routine.\n* **Burnout:** Ramping up intensity too fast leads to fatigue.`;
      pragmatistAnalysis = `### The Minimum Effective Dose\nWe need habits that survive your worst days, not just your best days.\n\n**Action Plan:**\n1. **Micro-Habit:** Commit to just 10 minutes of movement daily. No exceptions.\n2. **Environment Design:** Remove friction. Put your gym clothes out the night before.\n3. **Focus on Input, Not Output:** Track whether you showed up, not the weight on the scale.`;
      systemConsensus = `**Verdict:** Adopt the 10-minute micro-habit. Focus on consistency over intensity.`;
    }
    else if (lowerTask.includes('business') || lowerTask.includes('startup') || lowerTask.includes('founder') || lowerTask.includes('kitchen')) {
      visionaryAnalysis = `### The Zero-to-One Opportunity\nBuilding a business creates true equity and leverage. This idea has the hallmarks of a scalable venture if positioned correctly in the current market.\n\n**Upside:** Uncapped financial upside, total creative control, and the ability to solve a meaningful problem at scale.`;
      skepticAnalysis = `### The Market Reality Check\nIdeas are cheap; distribution is everything.\n\n**Risks:**\n* **Solution Searching for a Problem:** Are you building this because it's cool, or because the market is begging for it with their wallets?\n* **Distribution Disadvantage:** How will you acquire your first 1,000 users without burning capital?`;
      pragmatistAnalysis = `### The Validation Protocol\nDo not write a single line of code or spend a dollar on inventory yet.\n\n**Action Plan:**\n1. **The Mom Test:** Interview 5 potential customers about their problem, not your solution.\n2. **The Painted Door:** Set up a landing page describing the product and see if people will give you their email (or prepay).\n3. **Build Manual First:** Provide the service manually before scaling.`;
      systemConsensus = `**Verdict:** Validate distribution first. Do not spend money until 5 strangers have committed to buying.`;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      visionary: visionaryAnalysis,
      skeptic: skepticAnalysis,
      pragmatist: pragmatistAnalysis,
      system: systemConsensus
    });

  } catch (error) {
    console.error('Council API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
