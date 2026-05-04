import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, LayoutDashboard, Sparkles, Database, Shield, TrendingUp, Briefcase, Zap, Users, HelpCircle, FlaskConical } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type FlowStep = 'landing' | 'profiler' | 'input' | 'analyzing' | 'recommendation' | 'create' | 'dashboard' | 'benchmark' | 'library' | 'privacy' | 'growth' | 'pm_center' | 'council' | 'skill_lab';

interface SidebarProps {
  currentStep: FlowStep;
  onNavigate: (step: FlowStep) => void;
  xp: number;
  level: number;
}

export default function Sidebar({ currentStep, onNavigate, xp, level }: SidebarProps) {
  const navLinks: { label: string; step: FlowStep; icon: React.ElementType }[] = [
    { label: 'Neural Career Mentor', step: 'growth', icon: Briefcase },
    { label: 'Neural Skill Lab', step: 'skill_lab', icon: FlaskConical },
    { label: 'Strategic Support Hub', step: 'pm_center', icon: HelpCircle },
    { label: 'Agent Council', step: 'council', icon: Users },
    { label: 'Neural Dashboard', step: 'dashboard', icon: LayoutDashboard },
    { label: 'Model Benchmark', step: 'benchmark', icon: Zap },
    { label: 'Privacy Inspector', step: 'privacy', icon: Shield },
    { label: 'Team Library', step: 'library', icon: Database },
  ];

  const progress = Math.min((xp / (level * 100)) * 100, 100);

  return (
    <div className="w-72 h-screen fixed top-0 left-0 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col pt-8 pb-6 shadow-2xl z-50">
      <div 
        className="px-6 flex items-center gap-3 cursor-pointer group mb-10"
        onClick={() => onNavigate('landing')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-[#d97757] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
          <BrainCircuit size={20} color="white" />
        </div>
        <span className="font-serif font-bold text-xl tracking-tight text-white">Skill Advisor</span>
      </div>

      <div className="px-4 flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = currentStep === link.step;
          const Icon = link.icon;
          return (
            <button
              key={link.step}
              onClick={() => onNavigate(link.step)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm relative",
                isActive 
                  ? "bg-slate-800 text-white shadow-inner"
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon size={18} className={isActive ? "text-[#d97757]" : "text-slate-500"} />
              {link.label}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-8 bg-[#d97757] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-6 space-y-4">
        {/* NEW: Neural System Health Dashboard */}
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Link Status</span>
              <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i*200}ms` }} />)}
              </div>
           </div>
           {[
              { label: 'Coherence', val: 94 },
              { label: 'Entropy', val: 12 },
              { label: 'Buffer', val: 88 }
           ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                 <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                    <span>{stat.label}</span>
                    <span>{stat.val}%</span>
                 </div>
                 <div className="w-full bg-slate-950 h-0.5 rounded-full overflow-hidden">
                    <div 
                       className={cn("h-full rounded-full transition-all duration-1000", stat.label === 'Entropy' ? "bg-rose-500" : "bg-emerald-500")} 
                       style={{ width: `${stat.val}%` }} 
                    />
                 </div>
              </div>
           ))}
        </div>

        {/* Daily Retention Hook */}
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl p-4 border border-orange-500/20 relative overflow-hidden group hover:border-orange-500/40 transition-colors cursor-default">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                 <Zap size={16} color="white" fill="white" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-black text-white uppercase tracking-tighter">7 Day Streak</span>
                 <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Mastery Multiplier x1.2</span>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d97757]/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Level {level}</span>
            <span className="text-xs font-bold text-[#d97757]">{xp} XP</span>
          </div>
          
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 to-[#d97757] rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
            </motion.div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-medium">
            Next Support Milestone in {level * 100 - xp} XP
          </p>
        </div>
      </div>
    </div>
  );
}
