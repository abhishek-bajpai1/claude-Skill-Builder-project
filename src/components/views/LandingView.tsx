"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onStart: (mode?: string) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#d97757] rounded-2xl flex items-center justify-center shadow-2xl">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-serif text-[#1a1a1a] leading-tight">
          Unlock the Power of <br />
          <span className="text-[#d97757]">Interactive Skills</span>
        </h1>
        
        <p className="text-xl text-[#666] leading-relaxed">
          Claude is evolving. Stop guessing and start automating. 
          Skill Advisor analyzes your tasks to find the most efficient path—saving tokens, reducing latency, and maximizing quality.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => onStart()}
        className="group relative px-8 py-4 bg-black text-white rounded-full font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 shadow-xl"
      >
        Enterprise Strategy Hub
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* NEW: General Public Quick Assist Section */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="w-full max-w-4xl"
      >
         <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Quick Neural Assist</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
               { id: 'council_job', title: 'Career Pivot', icon: '💼', text: 'Instant career trajectory audit.' },
               { id: 'council_business', title: 'Business Fix', icon: '🚀', text: 'Solve founder bottlenecks now.' },
               { id: 'council_health', title: 'Health Hack', icon: '🧠', text: 'Optimize neural performance.' }
            ].map((item) => (
               <button 
                  key={item.id}
                  onClick={() => onStart(item.id)}
                  className="bg-white border border-slate-100 p-6 rounded-[2rem] text-left hover:border-[#d97757] hover:shadow-xl transition-all group"
               >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-black text-sm uppercase tracking-wider mb-2 group-hover:text-[#d97757]">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
               </button>
            ))}
         </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl pt-12">
        {[
          { icon: <Sparkles className="w-5 h-5" />, title: "Precision", text: "Optimal intent mapping" },
          { icon: <BrainCircuit className="w-5 h-5" />, title: "Analytics", text: "Token & latency predictions" },
          { icon: <ArrowRight className="w-5 h-5" />, title: "ROI", text: "Measured time savings" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 opacity-60">
            <div className="text-[#d97757]">{item.icon}</div>
            <div className="font-bold text-sm text-black">{item.title}</div>
            <div className="text-xs text-gray-500">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingView;
