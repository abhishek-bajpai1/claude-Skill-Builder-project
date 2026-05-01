"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart3, Clock, Zap, Target, Plus, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { AnalysisResult } from '@/lib/api';

const CAPABILITY_LABELS: Record<string, { label: string; color: string; icon: string; sub: string }> = {
  workflow: { label: 'Claude Workflow', color: '#64748b', icon: '📝', sub: 'Free' },
  skill: { label: 'Deterministic Skill', color: '#22c55e', icon: '⚡', sub: 'Pro' },
  agent: { label: 'Autonomous Agent', color: '#8b5cf6', icon: '🤖', sub: 'Max' },
};

interface Props {
  task: string;
  analysis: AnalysisResult;
  onCreateSkill: () => void;
  onDashboard: () => void;
}

const DynamicRecommendationView: React.FC<Props> = ({ task, analysis, onCreateSkill, onDashboard }) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    (analysis.frequencyHint as any) || 'weekly'
  );

  const cap = CAPABILITY_LABELS[analysis.recommendation] || CAPABILITY_LABELS.workflow;

  const calculateSavings = () => {
    const mult = { daily: 20, weekly: 4, monthly: 1 };
    return mult[frequency];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      {/* Header Recommendation Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center"
      >
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl flex-shrink-0 bg-slate-50">
          {cap.icon}
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black text-white"
            >
              Subscription: {analysis.subscription}
            </span>
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 text-slate-400"
            >
              {analysis.confidence}% Confidence
            </span>
            {analysis.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight">
            Recommended: <br className="hidden md:block"/>
            <span className="flex items-center gap-3">
              <span style={{ color: cap.color }}>{cap.label}</span>
              <span className="text-xs font-black uppercase tracking-tighter bg-slate-50 text-slate-300 px-2 py-1 rounded border border-slate-100 italic">
                {cap.sub} Tier
              </span>
            </span>
          </h1>
          <p className="text-slate-500 max-w-xl leading-relaxed">{analysis.reason}</p>
          {analysis.tokenSavings > 0 && (
            <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <CheckCircle2 size={14} />
              ~{analysis.tokenSavings}% token savings vs. simple prompt
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 min-w-[180px]">
          {analysis.recommendation !== 'workflow' && (
            <button onClick={onCreateSkill} className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d97757] transition-all shadow-sm">
              Create Skill <Plus size={16} />
            </button>
          )}
          <button onClick={onDashboard} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
            Dashboard <ChevronRight size={16} />
          </button>
        </div>
      </motion.section>

      {/* Comparison Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-center">Capability Alternatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {analysis.alternatives.map((alt) => (
            <div
              key={alt.type}
              className={`p-7 rounded-[2rem] border-2 transition-all ${
                alt.isRecommended
                  ? 'border-[#d97757] shadow-xl scale-105 bg-white z-10'
                  : 'border-slate-100 bg-slate-50/60'
              }`}
            >
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-bold text-slate-900 text-sm">{alt.label}</h3>
                {alt.isRecommended && <Sparkles size={14} className="text-[#d97757]" />}
              </div>
              <div className="space-y-3 text-xs font-bold">
                {[
                  { k: 'Time', v: alt.time },
                  { k: 'Requirement', v: (alt as any).sub + ' Tier' },
                  { k: 'Quality', v: alt.quality },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">{k}</span>
                    <span className={alt.isRecommended ? 'text-[#d97757]' : 'text-slate-900'}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prediction + ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Prediction Panel */}
        <section className="bg-[#1a1a1a] p-8 md:p-10 rounded-[2rem] text-white space-y-8">
          <div>
            <h2 className="text-2xl font-serif text-[#d97757]">Token & Latency Prediction</h2>
            <p className="text-slate-400 text-sm mt-1">Based on your specific task content.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: <Zap size={18} className="text-amber-400" />, label: 'Tokens', val: analysis.predictions.tokens, sub: 'Est. per run' },
              { icon: <Clock size={18} className="text-[#d97757]" />, label: 'Latency', val: analysis.predictions.latency, sub: 'Avg response' },
              { icon: <Target size={18} className="text-blue-400" />, label: 'Quality', val: analysis.predictions.quality, sub: 'Output grade' },
              { icon: <BarChart3 size={18} className="text-green-400" />, label: 'Cost', val: analysis.predictions.cost, sub: 'Cost tier' },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  {s.icon} {s.label}
                </div>
                <div className="text-3xl font-bold text-white">{s.val}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ROI Meter */}
        <section className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 space-y-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-serif">Skill ROI Meter</h2>
            <p className="text-slate-500 text-sm mt-1">Estimate your value over time.</p>
          </div>
          <div className="space-y-5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task Frequency</div>
            <div className="flex gap-3">
              {(['daily', 'weekly', 'monthly'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                    frequency === f ? 'bg-black text-white border-black shadow' : 'border-transparent bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <div>
                <div className="text-4xl font-bold text-[#d97757] font-serif">~{calculateSavings()} hrs</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly Savings</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 flex items-center gap-2">High ROI <ShieldCheck size={18} className="text-green-500" /></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reuse Value</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DynamicRecommendationView;
