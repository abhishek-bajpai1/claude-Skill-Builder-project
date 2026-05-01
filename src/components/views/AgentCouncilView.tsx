import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Target, Send, Loader2, Network, CheckCircle2, Sparkles } from 'lucide-react';
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

type AgentRole = 'visionary' | 'skeptic' | 'pragmatist';

interface Agent {
  id: AgentRole;
  name: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  description: string;
}

const AGENTS: Agent[] = [
  {
    id: 'visionary',
    name: 'The Visionary',
    icon: Target,
    color: 'text-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)] border-cyan-500/30',
    description: 'Explores maximum potential and creative horizons.'
  },
  {
    id: 'skeptic',
    name: 'The Analyst',
    icon: ShieldAlert,
    color: 'text-rose-400',
    glow: 'shadow-[0_0_15px_rgba(251,113,133,0.4)] border-rose-500/30',
    description: 'Identifies systemic risks and logical fallacies.'
  },
  {
    id: 'pragmatist',
    name: 'The Executor',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)] border-emerald-500/30',
    description: 'Translates high-level ideas into actionable mechanics.'
  }
];

interface Message {
  id: string;
  agentId: AgentRole | 'user' | 'system';
  content: string;
}

export default function AgentCouncilView() {
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentRole | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, activeAgent]);

  const handleSimulateCouncil = async () => {
    if (!taskInput.trim()) return;

    const newTaskMessage: Message = { id: Date.now().toString(), agentId: 'user', content: taskInput };
    setMessages(prev => [...prev, newTaskMessage]);
    setTaskInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTaskMessage.content })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Simulate Agent 1: Visionary
      setActiveAgent('visionary');
      await new Promise(r => setTimeout(r, 1500));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: 'visionary',
        content: data.visionary
      }]);

      // Simulate Agent 2: Skeptic
      setActiveAgent('skeptic');
      await new Promise(r => setTimeout(r, 2000));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: 'skeptic',
        content: data.skeptic
      }]);

      // Simulate Agent 3: Pragmatist
      setActiveAgent('pragmatist');
      await new Promise(r => setTimeout(r, 1800));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        agentId: 'pragmatist',
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
        {isProcessing && (
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Debate</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 z-10 flex-1 min-h-0">
        
        {/* Left Side: Agents List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">Council Nodes</h3>
          {AGENTS.map((agent) => {
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
                {isActive && (
                  <motion.div 
                    layoutId="active-glow"
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" 
                  />
                )}
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
        </div>

        {/* Right Side: Arena */}
        <div className="lg:col-span-3 flex flex-col h-[70vh] bg-slate-900/40 border border-slate-800 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
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

                  const agent = AGENTS.find(a => a.id === msg.agentId);
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
          <div className="p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-xl">
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
                onClick={handleSimulateCouncil}
                disabled={isProcessing || !taskInput.trim()}
                className="absolute right-3 p-3 bg-white text-black rounded-xl hover:bg-slate-200 disabled:opacity-20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
