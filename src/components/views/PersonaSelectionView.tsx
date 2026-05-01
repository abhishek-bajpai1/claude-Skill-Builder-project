"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Sparkles, ArrowRight } from 'lucide-react';

interface PersonaSelectionViewProps {
  onSelect: (persona: string) => void;
  onBack: () => void;
}

const PersonaSelectionView: React.FC<PersonaSelectionViewProps> = ({ onSelect, onBack }) => {
  const personas = [
    {
      id: "The Strategic Architect",
      label: "Strategic Architect",
      desc: "Focused on high-fidelity logic, deterministic structures, and architectural stability.",
      icon: <Target className="w-8 h-8" />,
      color: "#8b5cf6",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
    {
      id: "The Creative Visionary",
      label: "Creative Visionary",
      desc: "Focused on human-centric voice, creative scale, and stylistic consistency.",
      icon: <Sparkles className="w-8 h-8" />,
      color: "#d97757",
      bg: "bg-orange-50",
      border: "border-orange-100"
    },
    {
      id: "The Efficiency Specialist",
      label: "Efficiency Specialist",
      desc: "Focused on daily productivity, time-saved, and sub-cent operational cost.",
      icon: <ShieldCheck className="w-8 h-8" />,
      color: "#10b981",
      bg: "bg-green-50",
      border: "border-green-100"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-serif text-slate-900">Define Your Strategic Identity</h2>
        <p className="text-xl text-slate-500">Select a persona to tailor your architectural recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {personas.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(p.id)}
            className={`flex flex-col text-left p-8 rounded-[2.5rem] border-2 bg-white ${p.border} hover:shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden`}
          >
            <div className={`w-16 h-16 ${p.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`} style={{ color: p.color }}>
              {p.icon}
            </div>
            
            <h3 className="text-2xl font-serif text-slate-900 mb-4">{p.label}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">{p.desc}</p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: p.color }}>
              Select Path <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>

            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity`} style={{ backgroundColor: p.color }} />
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onBack}
          className="text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest"
        >
          &larr; Back to Brief
        </button>
      </div>
    </div>
  );
};

export default PersonaSelectionView;
