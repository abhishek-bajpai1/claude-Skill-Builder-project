"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, TrendingUp, Zap, 
  Target, BarChart3, Info, CheckCircle2, Share2, MousePointer2, Clock, Sparkles, GraduationCap, Coins, Download, Database
} from 'lucide-react';
import type { AnalysisResult } from '@/lib/api';

interface Props {
  task: string;
  analysis: AnalysisResult;
  onCreateAction: () => void;
  onDashboard: () => void;
}

const DecisionCockpit: React.FC<Props> = ({ task, analysis, onCreateAction, onDashboard }) => {
  const { strategist, simulation, masteryRoadmap } = analysis;
  const [showExpertDetails, setShowExpertDetails] = useState(false);

  const downloadCSV = () => {
    const rows = [
      ["Strategic Roadmap", analysis.masteryRoadmap.badge],
      ["Task", task],
      ["Data Source", analysis.masteryRoadmap.dataSource || "Kaggle/O*NET"],
      ["", ""],
      ["Timeline", "Goal"],
      ["Daily", analysis.masteryRoadmap.milestones.daily],
      ["Weekly", analysis.masteryRoadmap.milestones.weekly],
      ["Monthly", analysis.masteryRoadmap.milestones.monthly],
      ["", ""],
      ["Resource Bank", ""],
      ["Est. Tokens", analysis.masteryRoadmap.resourceBank.predictedTokens],
      ["Build Duration", analysis.masteryRoadmap.resourceBank.buildDuration]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Strategic_Roadmap_${analysis.masteryRoadmap.badge.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* 1. Header: The Mastery Hero */}
      <section className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <GraduationCap size={250} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-10 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-[#d97757] uppercase tracking-[0.2em]">
                <Sparkles size={12} /> Strategic Path Identified
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
                <Database size={8} className="text-blue-500" /> {analysis.masteryRoadmap.dataSource || "Verified Dataset"}
              </div>
            </div>
            <h1 className="text-6xl font-serif text-slate-900 leading-tight">
               Master the Path of the <span className="text-[#d97757]">{masteryRoadmap.badge}</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed italic">
              "{simulation.roi.humanSummary}"
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 w-full md:w-auto min-w-[280px]">
             <div className="flex justify-between items-center mb-4">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Bank</div>
               <button onClick={downloadCSV} className="p-2 hover:bg-white rounded-lg text-[#d97757] transition-all" title="Export CSV">
                  <Download size={14} />
               </button>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between gap-6">
                   <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Coins size={16} className="text-orange-500" /> {masteryRoadmap.resourceBank.predictedTokens}
                   </div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Tokens</div>
                </div>
                <div className="flex items-center justify-between gap-6">
                   <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Clock size={16} className="text-blue-500" /> {masteryRoadmap.resourceBank.buildDuration}
                   </div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Build Time</div>
                </div>
             </div>
             <div className="mt-6 pt-6 border-t border-slate-150">
               <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <TrendingUp size={12} /> Predicted Efficiency
               </div>
               <div className="text-2xl font-black text-slate-900">{simulation.roi.efficiencyGain}</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
           {masteryRoadmap.coreSkills.map((skill, i) => (
             <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-3 group hover:bg-black hover:text-white transition-all cursor-default">
                <div className="w-2 h-2 rounded-full bg-[#d97757] group-hover:bg-white" />
                <span className="text-xs font-bold uppercase tracking-wide">{skill}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 2. Mastery Roadmap: Time-Based Milestones */}
      <section className="bg-[#1a1a1a] p-12 rounded-[3.5rem] shadow-2xl text-white space-y-12">
         <div className="flex items-center justify-between">
            <div className="space-y-2">
               <h2 className="text-3xl font-serif text-[#d97757]">Mastery Roadmap</h2>
               <p className="text-slate-400 text-sm">Data-driven timeline sourced from industry patterns.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={downloadCSV}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all border border-white/5 flex items-center gap-2"
              >
                <Download size={14} /> Export CSV
              </button>
              <button 
                onClick={() => setShowExpertDetails(!showExpertDetails)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-[#d97757] uppercase tracking-widest transition-all border border-white/5"
              >
                <BarChart3 size={14} className="inline mr-2" /> Audit Logic
              </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daily */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-orange-500/20 transition-all" />
               <div className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Phase 1: Daily</div>
               <h3 className="text-2xl font-serif">Quick Win</h3>
               <p className="text-slate-400 text-sm leading-relaxed">{masteryRoadmap.milestones.daily}</p>
               <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase">
                  Goal: Immediate Value <ArrowRight size={12} />
               </div>
            </div>

            {/* Weekly */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/20 transition-all" />
               <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Phase 2: Weekly</div>
               <h3 className="text-2xl font-serif">Systems Check</h3>
               <p className="text-slate-400 text-sm leading-relaxed">{masteryRoadmap.milestones.weekly}</p>
               <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase">
                  Goal: Stability <ArrowRight size={12} />
               </div>
            </div>

            {/* Monthly */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-purple-500/20 transition-all" />
               <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Phase 3: Monthly</div>
               <h3 className="text-2xl font-serif">Scale Mastery</h3>
               <p className="text-slate-400 text-sm leading-relaxed">{masteryRoadmap.milestones.monthly}</p>
               <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase">
                  Goal: Infinity Scale <ArrowRight size={12} />
               </div>
            </div>
         </div>
      </section>

      {/* 3. Action & Strategic Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <section className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="p-4 bg-orange-50 rounded-2xl text-[#d97757] inline-block">
                  <Zap size={32} />
               </div>
               <h3 className="text-2xl font-bold">Ready to earn your badge?</h3>
               <p className="text-slate-500 max-w-md">Selecting this path initializes the {strategist.modelRecommendation.name} environment with pre-cached logic for {masteryRoadmap.badge} excellence.</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
               <button 
                onClick={onCreateAction}
                className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-[#d97757] transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                  Deploy Skill <Sparkles size={18} />
               </button>
               <button onClick={onDashboard} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest py-2">
                  Decline Roadmap
               </button>
            </div>
         </section>

         <section className="lg:col-span-4 bg-[#fbfaf8] p-12 rounded-[3.5rem] border border-slate-100 space-y-8">
            <div className="space-y-2">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Strategy</div>
               <div className="flex items-center justify-between">
                  <span className="font-serif text-xl">{strategist.modelRecommendation.name}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">3.5</div>
               </div>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed italic p-4 bg-white rounded-2xl border border-slate-50">
               "{strategist.modelRecommendation.reason}"
            </div>
         </section>
      </div>

      {/* Expert Logic Context */}
      <AnimatePresence>
        {showExpertDetails && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden"
          >
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logical Stress Test</h4>
                <div className="space-y-2">
                   {simulation.stabilityHeatmap.map((s, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="text-[9px] font-black text-slate-300 w-24 uppercase">{s.step}</div>
                        <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
                           <div className="h-full bg-slate-200" style={{ width: `${s.successProbability}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structural Reasoning</h4>
                <div className="text-[11px] text-slate-500 leading-relaxed italic space-y-2">
                   {analysis.triage?.reasoningTrace.slice(0, 3).map((r, i) => (
                     <p key={i}>"{r}"</p>
                   ))}
                </div>
             </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DecisionCockpit;
