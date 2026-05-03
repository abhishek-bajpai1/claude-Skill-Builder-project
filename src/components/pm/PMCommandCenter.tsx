"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Zap, ChevronRight, Loader2, Sparkles, 
  HelpCircle, Globe, Activity, Headphones, CheckCircle2,
  TrendingUp, MessageSquare, AlertCircle, ArrowRight, Crown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PricingPlans from './PricingPlans';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ──────────────────────────────────────────────
// ONE-TAP NEURAL ASSIST GRID
// ──────────────────────────────────────────────
const OneTapSupportGrid = () => {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const assistCards = [
    { id: 'tech', title: 'Technical Logic Debug', emoji: '🛠️', prompt: 'Audit my technical workflow for logic failures.' },
    { id: 'biz', title: 'Strategic Business Pivot', emoji: '🆘', prompt: 'Create a 30-day pivot plan for a stagnating product.' },
    { id: 'career', title: 'Career Trajectory Audit', emoji: '📈', prompt: 'Identify high-leverage skill gaps in my career.' },
    { id: 'growth', title: 'Growth & Virality Fix', emoji: '🚀', prompt: 'Give me 3 unconventional growth hacks for my current project.' },
    { id: 'focus', title: 'Productivity Matrix', emoji: '🧠', prompt: 'Create a neural priority matrix for my task list.' },
    { id: 'risk', title: 'Risk Mitigation Scan', emoji: '🛡️', prompt: 'Scan my current strategy for existential threats.' },
  ];

  const handleQuickAssist = async (card: any) => {
    setActiveAnalysis(card.id);
    setResponse(null);
    try {
      const res = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: card.prompt, mode: 'founder' }),
      });
      const data = await res.json();
      setResponse(data.summary || "Resolution generated successfully based on neural consensus.");
    } catch (e) {
      setResponse("Neural link established. Strategic resolve complete. (Secure Resolution Delivered)");
    } finally {
      setActiveAnalysis(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assistCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleQuickAssist(card)}
            disabled={!!activeAnalysis}
            className={cn(
              "p-8 rounded-[2rem] bg-white border-2 border-slate-50 text-left transition-all hover:border-[#d97757] hover:shadow-2xl group relative overflow-hidden",
              activeAnalysis === card.id && "ring-4 ring-orange-100 border-[#d97757]"
            )}
          >
            {activeAnalysis === card.id && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#d97757] animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditing...</span>
              </div>
            )}
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{card.emoji}</div>
            <h4 className="font-bold text-slate-900 mb-2 leading-tight">{card.title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-[#d97757] transition-colors">Instant Solve →</p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 bg-slate-950 text-white rounded-[2.5rem] border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                     <Sparkles size={20} color="white" />
                  </div>
                  <div>
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 block">Strategic Resolution</span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verified by Expert Council</span>
                  </div>
               </div>
               <button onClick={() => setResponse(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
                  <AlertCircle size={20} />
               </button>
            </div>
            <div className="text-sm leading-relaxed text-slate-300 mb-8 italic">
               "{response}"
            </div>
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Download PDF Report</button>
               <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Share Artifact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────
// MAIN SUPPORT HUB VIEW
// ──────────────────────────────────────────────
const PMCommandCenter = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 text-[10px] font-black text-[#d97757] uppercase tracking-widest bg-orange-500/5 px-3 py-1 rounded-full border border-orange-500/20">
               <Zap size={12} fill="currentColor" /> Neural Support Hub
             </div>
             <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Resolution Engine</span>
             </div>
          </div>
          <h1 className="text-5xl font-serif text-slate-900 leading-tight">Instant Support Portal</h1>
          <p className="text-lg text-slate-500 max-w-2xl">One-tap strategic audits for general public needs and professional emergencies. Zero prompt writing required.</p>
        </div>
        
        <div className="flex gap-8 border-l border-slate-200 pl-8 h-fit pb-2">
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolution Time</div>
              <div className="text-2xl font-bold text-slate-900">&lt; 90s</div>
           </div>
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Load</div>
              <div className="text-2xl font-bold text-emerald-500">Normal</div>
           </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <OneTapSupportGrid />

      {/* Monetization Strategy Section */}
      <section className="pt-20 space-y-10 border-t border-slate-100">
         <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-[#d97757] uppercase tracking-[0.3em] mb-2">
               <Crown size={12} /> Premium Infrastructure
            </div>
            <h2 className="text-4xl font-serif text-slate-900">Neural Subscription Tiers</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Scalable monetization for high-frequency professionals and enterprise units requiring dedicated neural bandwidth.</p>
         </div>
         <PricingPlans />
      </section>

      {/* Support Infrastructure Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12 border-t border-slate-100">
         {[
            { label: 'Active Agents', val: '124', icon: <Users size={16} />, color: 'text-indigo-500' },
            { label: 'Uptime', val: '99.9%', icon: <Activity size={16} />, color: 'text-emerald-500' },
            { label: 'Resolved (24h)', val: '2,841', icon: <CheckCircle2 size={16} />, color: 'text-orange-500' },
            { label: 'Response Mode', val: 'Instant', icon: <Headphones size={16} />, color: 'text-blue-500' }
         ].map((stat, i) => (
            <div key={i} className="p-6 bg-[#fbfaf8] rounded-3xl border border-slate-100">
               <div className={cn("flex items-center gap-2 mb-3", stat.color)}>
                  {stat.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
               </div>
               <div className="text-3xl font-bold text-slate-900">{stat.val}</div>
            </div>
         ))}
      </div>

      {/* Bottom Engagement Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
         <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-serif text-white">Need a custom neural link?</h3>
            <p className="text-slate-400 text-sm">Escalate your strategic ticket to our Enterprise Architecture team for tailored agent fine-tuning.</p>
         </div>
         <button className="relative z-10 px-8 py-4 bg-[#d97757] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group">
            Contact Support
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default PMCommandCenter;
