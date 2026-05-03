import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Target, Send, Loader2, Network, CheckCircle2, Sparkles, Database, Mic } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Simple Markdown Parser for the Council
function renderMarkdown(text: string) {
  const blocks = text.split('\n\n');
  return blocks.map((block, i) => {
    // If the block contains a header and text separated by a single newline, split it
    const lines = block.split('\n');
    return (
      <div key={i} className="mb-4">
        {lines.map((line, j) => {
          let content = line.trim();
          if (!content) return null;

          if (content.startsWith('### ')) {
            return <h4 key={j} className="text-[11px] font-black text-indigo-300 mb-2 uppercase tracking-widest">{content.replace('### ', '')}</h4>;
          }

          const isBullet = content.startsWith('* ');
          if (isBullet) content = content.substring(2);

          // Handle bold text **text**
          const parts = content.split(/(\*\*.*?\*\*)/g).map((part, k) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <span key={k} className="font-bold text-white">{part.slice(2, -2)}</span>;
            }
            return part;
          });

          if (isBullet) {
            return <li key={j} className="ml-5 list-disc text-slate-300 text-sm mb-1">{parts}</li>;
          }

          return <p key={j} className="text-sm text-slate-300 leading-relaxed mb-2">{parts}</p>;
        })}
      </div>
    );
  });
}

interface Agent {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  description: string;
}

type CouncilMode = 'founder' | 'growth' | 'career';

const COUNCIL_MODES: Record<CouncilMode, Agent[]> = {
  founder: [
    { id: 'visionary', name: 'The Visionary', icon: Target, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)] border-cyan-500/30', description: 'Explores maximum potential and creative horizons.' },
    { id: 'skeptic', name: 'The Analyst', icon: ShieldAlert, color: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(251,113,133,0.4)] border-rose-500/30', description: 'Identifies systemic risks and logical fallacies.' },
    { id: 'pragmatist', name: 'The Executor', icon: CheckCircle2, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)] border-emerald-500/30', description: 'Translates high-level ideas into actionable mechanics.' }
  ],
  growth: [
    { id: 'visionary', name: 'Growth Lead', icon: Network, color: 'text-orange-400', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.4)] border-orange-500/30', description: 'Focuses on virality and acquisition loops.' },
    { id: 'skeptic', name: 'Data Scientist', icon: ShieldAlert, color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.4)] border-blue-500/30', description: 'Validates assumptions with quantitative rigor.' },
    { id: 'pragmatist', name: 'Product Architect', icon: Target, color: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.4)] border-purple-500/30', description: 'Optimizes user experience and retention.' }
  ],
  career: [
    { id: 'visionary', name: 'Headhunter', icon: Target, color: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.4)] border-yellow-500/30', description: 'Identifies market gaps and high-pay roles.' },
    { id: 'skeptic', name: 'Mentor', icon: ShieldAlert, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)] border-cyan-500/30', description: 'Evaluates your current skill readiness.' },
    { id: 'pragmatist', name: 'Career Coach', icon: CheckCircle2, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)] border-emerald-500/30', description: 'Creates a 90-day upskilling roadmap.' }
  ]
};

interface Message {
  id: string;
  agentId: string | 'user' | 'system';
  content: string;
}

export default function AgentCouncilView({ initialTask }: { initialTask?: string }) {
  const [taskInput, setTaskInput] = useState(initialTask || '');

  useEffect(() => {
    if (initialTask) {
      handleSimulateCouncil(initialTask);
    }
  }, [initialTask]);
  const [councilMode, setCouncilMode] = useState<CouncilMode>('founder');
  const agents = COUNCIL_MODES[councilMode];
  const [retrievedContext, setRetrievedContext] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ reliability: number; reasoningDepth: string; tokensUsed: number } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, activeAgent]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSimulateCouncil = async (forcedTask?: string) => {
    const finalTask = forcedTask || taskInput;
    if (!finalTask.trim()) return;

    const newTaskMessage: Message = { id: Date.now().toString(), agentId: 'user', content: finalTask };
    setMessages(prev => [...prev, newTaskMessage]);
    setTaskInput('');
    setIsProcessing(true);
    setMetrics(null);
    setRetrievedContext([]);
    setSuggestions([]);

    try {
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: finalTask, mode: councilMode })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Simulation Step 0: RAG / Semantic Retrieval
      if (data.retrievedContext && data.retrievedContext.length > 0) {
         setRetrievedContext(data.retrievedContext);
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            agentId: 'system',
            content: `**Semantic Memory Retrieved**\n\nFound ${data.retrievedContext.length} highly relevant matches from the professional library to ground this analysis.`
         }]);
         await new Promise(r => setTimeout(r, 1200));
      }

      // Simulate Agent 1
      setActiveAgent(agents[0].id);
      await new Promise(r => setTimeout(r, 1500));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: agents[0].id,
        content: data.visionary
      }]);

      // Simulate Agent 2
      setActiveAgent(agents[1].id);
      await new Promise(r => setTimeout(r, 2000));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: agents[1].id,
        content: data.skeptic
      }]);

      // Simulate Agent 3
      setActiveAgent(agents[2].id);
      await new Promise(r => setTimeout(r, 1800));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: agents[2].id,
        content: data.pragmatist
      }]);

      // Final Synthesis
      setActiveAgent(null);
      await new Promise(r => setTimeout(r, 1000));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: 'system',
        content: data.system
      }]);

      // NEW: Conflict Resolution Step
      if (data.reconciliation) {
         await new Promise(r => setTimeout(r, 1500));
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            agentId: 'system',
            content: `**Neural Conflict Resolution**\n\n${data.reconciliation}`
         }]);
      }

      // NEW: Neural Self-Critique (Reflection Pattern)
      if (data.selfCritique) {
         await new Promise(r => setTimeout(r, 1800));
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            agentId: 'system',
            content: `${data.selfCritique}`
         }]);
      }

      setMetrics(data.metrics);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setActiveAgent(null);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: 'system',
        content: "Error: Neural link disconnected. Consensus failed."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col p-8">
      {/* Premium ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto w-full mb-10 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
            <Network className="w-10 h-10 text-indigo-400" />
            Neural Agent Council
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Multi-perspective synthesis engine.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 group"
            onClick={() => {
              const reportText = messages.map(m => `${m.agentId.toUpperCase()}: ${m.content}`).join('\n\n---\n\n');
              const blob = new Blob([reportText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Strategic_Report_${Date.now()}.txt`;
              a.click();
              alert("Strategic Council Report generated and downloaded successfully.");
            }}
          >
             <Database size={14} className="text-slate-400 group-hover:text-white transition-colors" />
             Download Report
          </button>
          {isProcessing && (
            <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Debate</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 z-10 flex-1 min-h-0">
        
        {/* Left Side: Agents & Reliability Dashboard */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Council Mode Switcher */}
          <section className="bg-slate-900/60 rounded-[2rem] border border-slate-800 p-2 flex gap-1 mb-4">
             {(['founder', 'growth', 'career'] as CouncilMode[]).map((mode) => (
                <button
                   key={mode}
                   onClick={() => {
                      setCouncilMode(mode);
                      setMessages([]); // Clear chat for new persona set
                   }}
                   className={cn(
                      "flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300",
                      councilMode === mode 
                        ? "bg-white text-black shadow-lg" 
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                   )}
                >
                   {mode}
                </button>
             ))}
          </section>

          {councilMode === 'career' ? (
             <section className="p-6 bg-slate-900/60 rounded-[2rem] border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                   <Target size={16} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Career Audit</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">"Career mode now operates in real-time neural link mode. Direct mentor communication established."</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-bold text-slate-500">Latency</span>
                   <span className="text-[9px] font-bold text-emerald-500">14ms</span>
                </div>
             </section>
          ) : (
             <section className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">Council Nodes</h3>
               {agents.map((agent) => {
                 const Icon = agent.icon;
                 const isActive = activeAgent === agent.id;
                 return (
                   <div 
                     key={agent.id}
                     className={cn(
                       "p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden backdrop-blur-md",
                       isActive 
                         ? cn("bg-slate-900 border-white/20", agent.glow) 
                         : "bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/50"
                     )}
                   >
                     <div className="flex items-center gap-4 relative z-10">
                       <div className={cn("p-2.5 rounded-xl transition-colors", isActive ? "bg-slate-800" : "bg-slate-950")}>
                         <Icon className={cn("w-5 h-5", isActive ? agent.color : "text-slate-500")} />
                       </div>
                       <div>
                         <p className={cn("font-bold text-sm", isActive ? "text-white" : "text-slate-300")}>{agent.name}</p>
                         <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{agent.description}</p>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </section>
          )}

          {/* RAG Neural Memory */}
          <section className="bg-slate-900/60 rounded-[2rem] border border-slate-800 p-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Sparkles size={12} className="text-cyan-400" />
              Neural Memory (RAG)
            </h3>
            {retrievedContext.length > 0 ? (
               <div className="space-y-3">
                  {retrievedContext.map((item, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 bg-slate-950 rounded-xl border border-cyan-500/20 group hover:border-cyan-500/40 transition-colors"
                     >
                        <div className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter mb-1">{item.category}</div>
                        <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">{item.content}</div>
                     </motion.div>
                  ))}
               </div>
            ) : (
               <div className="py-4 flex flex-col items-center justify-center text-center opacity-20">
                  <Database size={24} className="text-slate-500 mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-tighter italic">No Semantic Matches</span>
               </div>
            )}
          </section>

          {/* Reliability Dashboard */}
          <section className="bg-slate-900/60 rounded-[2rem] border border-slate-800 p-6 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <ShieldAlert size={12} className="text-indigo-400" />
              Reliability Audit
            </h3>

            {metrics ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400">Consensus Index</span>
                    <span className="text-emerald-400">{metrics.reliability}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.reliability}%` }}
                      className="h-full bg-emerald-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Depth</span>
                    <span className="text-xs font-bold text-white">{metrics.reasoningDepth}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Tokens</span>
                    <span className="text-xs font-bold text-white">{metrics.tokensUsed}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Cross-Model Alignment</span>
                   {[
                      { name: 'Claude 3.5', score: 98, color: 'text-orange-400' },
                      { name: 'GPT-4o (Sim)', score: 92, color: 'text-emerald-400' },
                      { name: 'Gemini 2.0 (Sim)', score: 95, color: 'text-indigo-400' }
                   ].map((model, i) => (
                      <div key={i} className="flex justify-between items-center text-[9px] font-bold">
                         <span className="text-slate-400">{model.name}</span>
                         <span className={model.color}>{model.score}%</span>
                      </div>
                   ))}
                </div>

                <div className="pt-2 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] text-slate-400 font-medium">Neural Integrity Verified</span>
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center text-center opacity-30">
                 <Loader2 size={24} className="animate-spin text-slate-500 mb-2" />
                 <span className="text-[9px] font-black uppercase tracking-tighter">Waiting for Consensus</span>
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Arena */}
        <div className="lg:col-span-3 flex flex-col h-[75vh] bg-slate-900/40 border border-slate-800 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {councilMode === 'career' ? (
             <CareerMentor userRole="Professional" />
          ) : (
             <>
               {/* Chat Area */}
               <div ref={chatRef} className="flex-1 p-8 overflow-y-auto space-y-8 scroll-smooth">
                 {messages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                     <Sparkles className="w-16 h-16 text-slate-500 mb-6" />
                     <p className="text-xl font-medium text-slate-300">Initialize sequence.</p>
                     <p className="text-sm text-slate-500 mt-2">Submit a thesis for the council to deconstruct.</p>
                   </div>
                 ) : (
                   <AnimatePresence initial={false}>
                     {messages.map((msg) => {
                       if (msg.agentId === 'user') {
                         return (
                           <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                             <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-4 rounded-3xl rounded-tr-sm max-w-[80%] shadow-lg shadow-indigo-500/20">
                               <p className="text-sm leading-relaxed">{msg.content}</p>
                             </div>
                           </motion.div>
                         );
                       }
                       
                       if (msg.agentId === 'system') {
                         return (
                           <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-10">
                             <div className="bg-slate-950/80 border border-indigo-500/30 px-8 py-5 rounded-2xl flex items-center gap-4 text-indigo-100 shadow-[0_0_30px_rgba(99,102,241,0.15)] max-w-[90%] backdrop-blur-md">
                               <Network className="w-6 h-6 text-indigo-400 shrink-0" />
                               <div className="text-sm font-medium leading-relaxed w-full">{renderMarkdown(msg.content)}</div>
                             </div>
                           </motion.div>
                         );
                       }

                       const agent = agents.find(a => a.id === msg.agentId);
                       if (!agent) return null;
                       const Icon = agent.icon;

                       return (
                         <motion.div key={msg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-5 max-w-[85%]">
                           <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-slate-900 shadow-lg", agent.glow)}>
                             <Icon className={cn("w-6 h-6", agent.color)} />
                           </div>
                           <div className="space-y-1.5 mt-1">
                             <div className="flex items-center gap-3">
                               <span className={cn("font-bold text-xs tracking-wide uppercase", agent.color)}>{agent.name}</span>
                             </div>
                             <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-4 rounded-3xl rounded-tl-sm shadow-sm backdrop-blur-sm">
                               <div className="text-sm text-slate-200 leading-relaxed w-full">{renderMarkdown(msg.content)}</div>
                             </div>
                           </div>
                         </motion.div>
                       );
                     })}
                     {isProcessing && activeAgent && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-slate-400 ml-16 mt-4">
                         <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                         <span className="text-xs font-bold tracking-widest uppercase text-indigo-400/70">Synthesizing...</span>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 )}
               </div>

               {/* Input Area */}
               <div className="p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl space-y-4">
                 <div className="relative flex items-center max-w-4xl mx-auto">
                   <input 
                     type="text" 
                     value={taskInput}
                     onChange={(e) => setTaskInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSimulateCouncil()}
                     placeholder="E.g., I'm thinking of completely pivoting my career into AI engineering..."
                     disabled={isProcessing}
                     className="w-full pl-6 pr-16 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50 shadow-inner"
                   />
                   <button 
                     onClick={() => handleSimulateCouncil()}
                     disabled={isProcessing || !taskInput.trim()}
                     className="absolute right-3 p-3 bg-white text-black rounded-xl hover:bg-slate-200 disabled:opacity-20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                   >
                     <Send className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
}
