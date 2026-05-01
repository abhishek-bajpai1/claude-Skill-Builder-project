import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Database, Server, Cpu, Star, Lock, CheckCircle2, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type SkillStatus = 'locked' | 'available' | 'in-progress' | 'mastered';

interface SkillNode {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: SkillStatus;
  progress: number; // 0-100
  level: number;
  prerequisites: string[];
}

const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 'core-react',
    title: 'React Fundamentals',
    description: 'Component lifecycle, hooks, and state management.',
    icon: Code,
    status: 'mastered',
    progress: 100,
    level: 5,
    prerequisites: [],
  },
  {
    id: 'adv-hooks',
    title: 'Advanced Hooks',
    description: 'Custom hooks, useMemo, useCallback, and context.',
    icon: Brain,
    status: 'in-progress',
    progress: 65,
    level: 3,
    prerequisites: ['core-react'],
  },
  {
    id: 'nextjs-app',
    title: 'Next.js App Router',
    description: 'Server components, layouts, and data fetching.',
    icon: Server,
    status: 'available',
    progress: 0,
    level: 1,
    prerequisites: ['core-react'],
  },
  {
    id: 'db-modeling',
    title: 'Data Modeling',
    description: 'Mongoose schemas, aggregation pipelines, indexing.',
    icon: Database,
    status: 'locked',
    progress: 0,
    level: 1,
    prerequisites: ['nextjs-app'],
  },
  {
    id: 'sys-design',
    title: 'System Architecture',
    description: 'Microservices, event-driven design, scalability.',
    icon: Cpu,
    status: 'locked',
    progress: 0,
    level: 1,
    prerequisites: ['db-modeling', 'adv-hooks'],
  }
];

export default function SkillTreeView() {
  const [skills, setSkills] = useState<SkillNode[]>(INITIAL_SKILLS);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status: SkillStatus) => {
    switch (status) {
      case 'mastered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'available': return 'bg-white/5 text-slate-300 border-white/10 hover:border-blue-500/30';
      case 'locked': return 'bg-slate-900/50 text-slate-600 border-slate-800';
    }
  };

  return (
    <div className="w-full min-h-[600px] bg-slate-950 rounded-2xl border border-slate-800 p-8 text-white flex flex-col md:flex-row gap-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Tree Area */}
      <div className="flex-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
            <TrendingUp className="text-blue-400 w-8 h-8" />
            Mastery Tree
          </h2>
          <p className="text-slate-400 mt-2">Level up your capabilities through applied project experience.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10"
        >
          {skills.map((skill) => {
            const Icon = skill.icon;
            const isSelected = selectedSkill?.id === skill.id;

            return (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                onClick={() => setSkills(skills.map(s => s.id === skill.id ? skill : s))} // placeholder for logic
                onHoverStart={() => setSelectedSkill(skill)}
                className={cn(
                  "relative p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300",
                  getStatusColor(skill.status),
                  isSelected && skill.status !== 'locked' && "scale-[1.02] shadow-lg shadow-blue-500/20",
                  skill.status === 'locked' && "cursor-not-allowed"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-black/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  {skill.status === 'mastered' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {skill.status === 'locked' && <Lock className="w-5 h-5 text-slate-600" />}
                  {skill.status === 'in-progress' && <span className="text-xs font-semibold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">Lvl {skill.level}</span>}
                  {skill.status === 'available' && <span className="text-xs font-semibold px-2 py-1 bg-white/10 rounded-full">Lvl 1</span>}
                </div>
                
                <h3 className="font-semibold text-lg mb-1">{skill.title}</h3>
                
                {skill.status !== 'locked' && (
                  <div className="w-full bg-black/40 h-2 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        skill.status === 'mastered' ? 'bg-emerald-500' : 'bg-blue-500'
                      )}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Side Panel Details */}
      <motion.div 
        className="w-full md:w-80 bg-slate-900/50 rounded-xl border border-slate-800 p-6 backdrop-blur-md relative z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {selectedSkill ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-3 rounded-xl", getStatusColor(selectedSkill.status).split(' ')[0])}>
                <selectedSkill.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">{selectedSkill.title}</h3>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {selectedSkill.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {selectedSkill.description}
            </p>

            {selectedSkill.status === 'locked' ? (
              <div className="mt-auto bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Prerequisites needed:</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  {selectedSkill.prerequisites.map(reqId => {
                    const req = skills.find(s => s.id === reqId);
                    return (
                      <li key={reqId} className="flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        {req?.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-300">Current Progress</span>
                  <span className="text-sm font-bold text-blue-400">{selectedSkill.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${selectedSkill.progress}%` }}
                  />
                </div>
                <button 
                  className={cn(
                    "w-full py-3 rounded-lg font-semibold transition-all",
                    selectedSkill.status === 'mastered' 
                      ? "bg-slate-800 text-slate-400 cursor-default"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  )}
                  disabled={selectedSkill.status === 'mastered'}
                >
                  {selectedSkill.status === 'mastered' ? 'Mastered' : 'Generate Practice Task'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Star className="w-12 h-12 mb-4 text-slate-600" />
            <p className="text-slate-400">Hover over a node to view skill details and progression paths.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
