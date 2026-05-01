"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, User, Clock, ChevronRight, Briefcase, GraduationCap } from 'lucide-react';

interface UserProfile {
  persona: string;
  goal: string;
  experience: string;
}

interface UserProfileViewProps {
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ onSubmit, onBack }) => {
  const [profile, setProfile] = useState<UserProfile>({
    persona: "The Strategic Architect",
    goal: "Build & Deploy",
    experience: "Intermediate"
  });

  const personas = [
    { id: "The Strategic Architect", label: "Architecture", icon: <Briefcase size={18} /> },
    { id: "The Creative Visionary", label: "Creative", icon: <Target size={18} /> },
    { id: "The Efficiency Specialist", label: "Productivity", icon: <Clock size={18} /> }
  ];

  const goals = ["Build & Deploy", "Deep Learning", "Team Scalability", "Prototype Fast"];
  const expLevels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif text-slate-900 leading-tight">Secure Your Identity</h2>
        <p className="text-xl text-slate-500">We tailor the roadmap based on who you are and where you're going.</p>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <User size={200} />
        </div>

        {/* 1. Primary Persona (The "Role") */}
        <section className="space-y-6 relative z-10">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="w-4 h-px bg-slate-200" /> Professional Discipline
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfile({ ...profile, persona: p.id })}
                  className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                    profile.persona === p.id 
                    ? 'bg-black text-white border-black shadow-xl scale-105' 
                    : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                   <div className={`${profile.persona === p.id ? 'text-[#d97757]' : 'text-slate-300'}`}>
                      {p.icon}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none">{p.label}</span>
                </button>
              ))}
           </div>
        </section>

        {/* 2. Ambition (The "Goal") */}
        <section className="space-y-6 relative z-10">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="w-4 h-px bg-slate-200" /> Strategic Ambition
           </div>
           <div className="flex flex-wrap gap-2 text-center items-center justify-center">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setProfile({ ...profile, goal: g })}
                  className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    profile.goal === g 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
           </div>
        </section>

        {/* 3. Mastery Baseline (Experience) */}
        <section className="space-y-6 relative z-10">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="w-4 h-px bg-slate-200" /> Mastery Baseline
           </div>
           <div className="grid grid-cols-3 gap-4">
              {expLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setProfile({ ...profile, experience: lvl })}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    profile.experience === lvl 
                    ? 'bg-orange-50 border-[#d97757] text-[#d97757] font-black' 
                    : 'bg-slate-50 border-slate-50 text-slate-400 font-bold'
                  } uppercase text-[10px] tracking-widest`}
                >
                  {lvl}
                </button>
              ))}
           </div>
        </section>

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
           <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-slate-900 px-4 py-2">
              Back to Landing
           </button>
           <button 
            onClick={() => onSubmit(profile)}
            className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-[#d97757] transition-all flex items-center gap-2 active:scale-95"
           >
              Continue to Brief <ChevronRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
