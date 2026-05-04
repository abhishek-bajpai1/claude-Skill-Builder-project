"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, Sparkles, Zap, Shield, Save, 
  RefreshCw, Terminal, CheckCircle2, AlertCircle, 
  TrendingDown, ArrowRight, Loader2, Code
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createSkill } from '@/lib/api';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const SkillLabView = () => {
  const [instructions, setInstructions] = useState('');
  const [name, setName] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [labMetrics, setLabMetrics] = useState({
    coherence: 0,
    efficiency: 0,
    latency: '0ms',
    tokenSavings: '0'
  });
  const [optimizedVersion, setOptimizedVersion] = useState<string | null>(null);

  // Simulate real-time metrics based on instruction length and content
  useEffect(() => {
    if (!instructions.trim()) {
       setLabMetrics({ coherence: 0, efficiency: 0, latency: '0ms', tokenSavings: '0' });
       return;
    }
    const timer = setTimeout(() => {
      const len = instructions.length;
      const hasStructure = instructions.includes('#') || instructions.includes('- ');
      setLabMetrics({
        coherence: Math.min(40 + (len / 10) + (hasStructure ? 30 : 0), 98),
        efficiency: Math.min(20 + (len / 20) + (hasStructure ? 40 : 0), 94),
        latency: `${Math.floor(100 + len / 2)}ms`,
        tokenSavings: `${Math.floor(len * 1.5)}/use`
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [instructions]);

  const handleOptimize = async () => {
    if (!instructions.trim()) return;
    setIsOptimizing(true);
    try {
      // Simulate neural optimization
      await new Promise(r => setTimeout(r, 2000));
      const optimized = `## ROLE\nYou are an expert agent specialized in [DOMAIN].\n\n## INSTRUCTIONS\n1. Analyze input for semantic intent.\n2. Apply the following logic: ${instructions}\n3. Format output as high-fidelity structured data.\n\n## CONSTRAINTS\n- Maximize token efficiency.\- Maintain 99.9% logical coherence.`;
      setOptimizedVersion(optimized);
      setInstructions(optimized);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = async () => {
    if (!name || !instructions) return;
    setIsSaving(true);
    try {
      await createSkill({
        name,
        instructions,
        output: 'Structured Neural Output',
        frequency: 'Daily',
        capability: 'skill',
        subscription: 'Pro',
        team: 'Neural Lab',
        tags: ['lab-optimized']
      });
      alert("Skill finalized and saved to your Neural Library!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/20 w-fit">
            <FlaskConical size={12} /> Neural Skill Lab
          </div>
          <h1 className="text-5xl font-serif text-slate-900 leading-tight">Prompt Engineering Sandbox</h1>
          <p className="text-lg text-slate-500 max-w-2xl">Refine, optimize, and stress-test your AI skills before deployment to production.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
            onClick={handleOptimize}
            disabled={isOptimizing || !instructions}
            className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
           >
              {isOptimizing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Auto-Optimize
           </button>
           <button 
            onClick={handleSave}
            disabled={isSaving || !name || !instructions}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
           >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Finalize Skill
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Terminal size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Instruction Editor</span>
                 </div>
                 <input 
                    type="text" 
                    placeholder="Skill Name (e.g. Strategic Auditor)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-900 outline-none text-right placeholder:text-slate-300"
                 />
              </div>
              <textarea 
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Paste your raw prompt or draft your skill instructions here..."
                className="flex-1 p-8 text-sm font-mono text-slate-700 bg-white resize-none outline-none leading-relaxed placeholder:text-slate-300"
              />
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-slate-400">{instructions.length} characters</span>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><Code size={10} /> Markdown Active</span>
                    <span className="flex items-center gap-1"><Shield size={10} /> Secure Layer</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Real-time Analysis Panel */}
        <div className="space-y-6">
           <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-2">
                 <Zap size={14} /> Live Neural Telemetry
              </h3>

              <div className="space-y-10 flex-1">
                 {/* Coherence Meter */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-slate-400">Logic Coherence</span>
                       <span className="text-2xl font-bold font-mono">{labMetrics.coherence}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${labMetrics.coherence}%` }}
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                       />
                    </div>
                 </div>

                 {/* Efficiency Meter */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-slate-400">Token Efficiency</span>
                       <span className="text-2xl font-bold font-mono text-emerald-400">{labMetrics.efficiency}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${labMetrics.efficiency}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                       />
                    </div>
                 </div>

                 {/* Latency & Savings Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                       <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Avg. Latency</div>
                       <div className="text-xl font-bold font-mono">{labMetrics.latency}</div>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                       <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Token ROI</div>
                       <div className="text-xl font-bold font-mono text-indigo-400">+{labMetrics.tokenSavings}</div>
                    </div>
                 </div>

                 {/* Insight Cards */}
                 <div className="space-y-3 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                       <div className={cn("w-1.5 h-1.5 rounded-full", labMetrics.coherence > 80 ? "bg-emerald-500" : "bg-amber-500")} />
                       {labMetrics.coherence > 80 ? "Prompt logic is production-ready." : "Missing structural identifiers (#, -)."}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                       <div className={cn("w-1.5 h-1.5 rounded-full", instructions.length > 50 ? "bg-emerald-500" : "bg-rose-500")} />
                       {instructions.length > 50 ? "Sufficient semantic context provided." : "Instruction depth is critically low."}
                    </div>
                 </div>
              </div>

              {/* Status Footer */}
              <div className="mt-auto pt-8 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Sandbox Synchronized</span>
                 </div>
                 <AlertCircle size={14} className="text-slate-700" />
              </div>
           </div>
        </div>
      </div>

      {/* Lab Insight Banner */}
      <div className="bg-[#f3f3ee] border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
               <Shield className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
               <h4 className="text-xl font-serif text-slate-900">Enterprise Shield Active</h4>
               <p className="text-sm text-slate-500 max-w-md">Your lab experiments are processed through a zero-retention privacy layer. No instructions are used for training.</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Neural Trust Score:</span>
            <span className="text-lg font-black text-slate-900 tracking-tighter">99.9%</span>
         </div>
      </div>
    </div>
  );
};

export default SkillLabView;
