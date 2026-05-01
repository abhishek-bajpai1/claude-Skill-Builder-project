"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  FileCode,
  Target,
  Plus,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

interface RecommendationViewProps {
  task: string;
  onCreateSkill: () => void;
  onDashboard: () => void;
}

const RecommendationView: React.FC<RecommendationViewProps> = ({ task, onCreateSkill, onDashboard }) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const calculateSavings = () => {
    const multipliers = { daily: 20, weekly: 4, monthly: 1 };
    const baseHours = 1; // 1 hour saved per execution
    return baseHours * multipliers[frequency];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      {/* 1. Recommendation Header */}
      <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-12 h-12 text-green-600" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full px-3">92% CONFIDENCE</span>
             <h2 className="text-xl font-bold text-gray-400">Recommended Path</h2>
          </div>
          <h1 className="text-4xl font-serif text-[#1a1a1a]">Use Existing Skill: <span className="text-[#d97757]">Sales Summarizer</span></h1>
          <p className="text-gray-500 max-w-xl">
            Task <strong>&quot;{task}&quot;</strong> is highly structured and repetitive. Leveraging a dedicated Skill will ensure consistent output while reducing token overhead by 35%.
          </p>
        </div>
        <div className="flex flex-col gap-3">
           <button onClick={onCreateSkill} className="px-6 py-3 bg-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-md">
             Create New Skill <Plus className="w-4 h-4" />
           </button>
           <button onClick={onDashboard} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2 transition-all">
             View Dashboard <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </section>

      {/* 2. Comparison Cards Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif">Capability Comparison</h2>
          <p className="text-gray-500 mt-2">Trade-offs for your specific task intensity</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Simple Prompt", time: "2 min", tokens: "4k", quality: "Med", reuse: "Low", diff: "Easy" },
            { title: "Existing Skill", time: "10 sec", tokens: "2.5k", quality: "High", reuse: "High", diff: "Easy", highlight: true },
            { title: "New Skill", time: "10 sec", tokens: "2k", quality: "v. High", reuse: "v. High", diff: "Med" },
            { title: "Combined Skills", time: "15 sec", tokens: "6k", quality: "Max", reuse: "v. High", diff: "Hard" },
          ].map((card, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-3xl border-2 transition-all ${card.highlight ? 'border-[#d97757] bg-white shadow-xl scale-105 z-10' : 'border-gray-100 bg-[#f9f9f7]'}`}
            >
              <h3 className="font-bold text-lg mb-6">{card.title}</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Time</span> <span className="font-bold">{card.time}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Tokens</span> <span className="font-bold">{card.tokens}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Quality</span> <span className="font-bold">{card.quality}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Reusability</span> <span className="font-bold">{card.reuse}</span>
                </div>
                <div className="flex justify-between font-bold text-[#d97757] pt-2">
                  <span>Complexity</span> <span>{card.diff}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 3. Prediction Panel */}
        <section className="bg-[#1a1a1a] p-8 md:p-12 rounded-[2rem] text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <BarChart3 className="w-32 h-32" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#d97757]">Prediction Panel</h2>
            <p className="text-gray-400">Projected performance using Recommended Skill</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 relative z-10">
            {[
              { icon: <Layers className="w-5 h-5" />, label: "Tokens", val: "2,500", detail: "Per run" },
              { icon: <Clock className="w-5 h-5" />, label: "Latency", val: "12 sec", detail: "Avg" },
              { icon: <Target className="w-5 h-5" />, label: "Quality", val: "High", detail: "98% Acc" },
              { icon: <Zap className="w-5 h-5" />, label: "Cost", val: "Medium", detail: "~$0.02" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {stat.icon} {stat.label}
                </div>
                <div className="text-3xl font-bold">{stat.val}</div>
                <div className="text-xs text-[#d97757] font-medium">{stat.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ROI Meter */}
        <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 space-y-8 shadow-sm">
           <div className="space-y-2">
             <h2 className="text-2xl font-serif">Skill ROI Meter</h2>
             <p className="text-gray-500">Calculate value over time</p>
           </div>
           
           <div className="space-y-6">
             <div className="text-sm font-bold text-gray-400">HOW OFTEN DO YOU DO THIS TASK?</div>
             <div className="flex gap-4">
               {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                 <button
                   key={freq}
                   onClick={() => setFrequency(freq)}
                   className={`flex-1 py-3 rounded-2xl font-bold transition-all border ${frequency === freq ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-[#f9f9f7] text-gray-500 border-transparent hover:border-gray-200'}`}
                 >
                   {freq.charAt(0).toUpperCase() + freq.slice(1)}
                 </button>
               ))}
             </div>
             
             <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <div className="text-4xl font-serif text-[#d97757] font-bold">~{calculateSavings()} Hours</div>
                  <div className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-wider">Estimated Monthly Savings</div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-xl font-bold text-black flex items-center gap-2">High <BarChart3 className="w-5 h-5 text-green-500" /></div>
                  <div className="text-sm text-gray-500 mt-1 uppercase font-bold tracking-wider">Estimated Reuse Value</div>
                </div>
             </div>
           </div>
        </section>
      </div>

      {/* 5. Skill Templates Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif">Suggested Skill Templates</h2>
          <button className="text-sm font-bold text-[#d97757] flex items-center gap-1">View All Templates <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Sales Report", icon: <BarChart3 className="w-5 h-5" /> },
            { name: "Hiring Outreach", icon: <BrainCircuit className="w-5 h-5" /> },
            { name: "Meeting Notes", icon: <FileCode className="w-5 h-5" /> },
            { name: "Email Multi-Reply", icon: <Zap className="w-5 h-5" /> },
            { name: "Content Planner", icon: <Sparkles className="w-5 h-5" /> },
          ].map((tmpl, i) => (
             <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-[#f3f3ee] rounded-xl flex items-center justify-center group-hover:bg-[#d97757] group-hover:text-white transition-colors">
                  {tmpl.icon}
                </div>
                <div className="text-sm font-bold text-gray-800">{tmpl.name}</div>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RecommendationView;
