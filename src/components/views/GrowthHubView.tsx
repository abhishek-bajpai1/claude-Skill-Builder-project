"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Zap, Target, Trophy, ChevronRight,
  AlertCircle, CheckCircle2, Star, ArrowRight, Loader2, User,
  BarChart3, Sparkles, Lock, Plus, Clock, Map, MessageSquare
} from 'lucide-react';
import { triggerConfetti } from '@/lib/celebrate';
import { createSkill } from '@/lib/api';
import SkillTreeView from './SkillTreeView';

const ROLES = ['Professional', 'Product Manager', 'Developer', 'Marketer', 'Recruiter', 'Operations'];

const LEVEL_CONFIG: Record<string, { color: string; bg: string; icon: string; badge: string }> = {
  Beginner:     { color: '#64748b', bg: 'bg-slate-100',  icon: '🌱', badge: 'Workflow Specialist (Free)' },
  Intermediate: { color: '#3b82f6', bg: 'bg-blue-50',    icon: '⚡', badge: 'Skill Architect (Pro)' },
  Advanced:     { color: '#d97757', bg: 'bg-orange-50',  icon: '🚀', badge: 'Strategy Expert (Pro)' },
  Expert:       { color: '#8b5cf6', bg: 'bg-purple-50',  icon: '💎', badge: 'Agent Orchestrator (Max)' },
};

const PRIORITY_COLOR: Record<string, string> = {
  High: 'text-red-600 bg-red-50 border-red-100',
  Medium: 'text-amber-600 bg-amber-50 border-amber-100',
  Low: 'text-green-600 bg-green-50 border-green-100',
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  quick_win:  <Zap size={16} className="text-amber-500" />,
  skill_gap:  <AlertCircle size={16} className="text-blue-500" />,
  workflow:   <Sparkles size={16} className="text-purple-500" />,
  benchmark:  <BarChart3 size={16} className="text-[#d97757]" />,
  share:      <Star size={16} className="text-green-500" />,
};

interface GrowthData {
  level: string;
  topTags: string[];
  gaps: string[];
  totalSkills: number;
  mostUsed: string[];
  recommendations: any[];
  learningPath: any[];
  milestone: any;
  skillTemplates: any[];
}

interface Props {
  onNavigate: (step: string) => void;
}

const GrowthHubView: React.FC<Props> = ({ onNavigate }) => {
  const [role, setRole] = useState('Professional');
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [addedTemplates, setAddedTemplates] = useState<Set<string>>(new Set());
  const [addingTemplate, setAddingTemplate] = useState<string | null>(null);

  const fetchGrowth = async (selectedRole: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/growth/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      });
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load profile on mount
    fetch('/api/profile')
      .then(res => res.json())
      .then(profile => {
        if (profile.role) setRole(profile.role);
        if (profile.completedSteps) setCompletedSteps(new Set(profile.completedSteps));
      });
  }, []);

  const saveProfile = async (updates: any) => {
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  useEffect(() => { 
    fetchGrowth(role);
    saveProfile({ role }); // Persist role selection
  }, [role]);

  const handleAddTemplate = async (template: any) => {
    if (addedTemplates.has(template.name)) return;
    setAddingTemplate(template.name);
    try {
      await createSkill({
        name: template.name,
        instructions: template.instructions,
        output: template.output || 'Structured output',
        frequency: template.frequency,
        capability: 'skill',
        subscription: 'Pro',
        team: role,
        tags: template.tags || [],
      });
      setAddedTemplates(prev => new Set(prev).add(template.name));
    } catch (e) {
      console.error(e);
    } finally {
      setAddingTemplate(null);
    }
  };

  const ROADMAPS: Record<string, any[]> = {
    'Product Manager': [
      { step: 'Workflow', icon: <Target size={14} />, task: 'Categorize feedback (Free)' },
      { step: 'Skill', icon: <Zap size={14} />, task: 'RICE Prioritization (Pro)' },
      { step: 'Agent', icon: <MessageSquare size={14} />, task: 'Stakeholder Comms (Max)' }
    ],
    'Developer': [
      { step: 'Workflow', icon: <Target size={14} />, task: 'Audit PR security (Free)' },
      { step: 'Skill', icon: <Zap size={14} />, task: 'Generate unit tests (Pro)' },
      { step: 'Agent', icon: <MessageSquare size={14} />, task: 'Autonomous Debugger (Max)' }
    ],
    'Professional': [
      { step: 'Workflow', icon: <Target size={14} />, task: 'Triage daily inbox (Free)' },
      { step: 'Skill', icon: <Zap size={14} />, task: 'Draft meeting agenda (Pro)' },
      { step: 'Agent', icon: <MessageSquare size={14} />, task: 'Digital Assistant (Max)' }
    ]
  };

  const levelCfg = data ? (LEVEL_CONFIG[data.level] || LEVEL_CONFIG.Beginner) : LEVEL_CONFIG.Beginner;

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-14">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-slate-900">Professional Growth Hub</h1>
          <p className="text-slate-500 mt-2">Personalized recommendations to elevate your Claude proficiency and career impact.</p>
        </div>
        <div className="flex items-center gap-2">
          <User size={14} className="text-slate-400" />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#d97757] transition-colors cursor-pointer"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={22} />
          <span className="font-bold">Analyzing your growth profile...</span>
        </div>
      ) : data ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-14"
          >
            {/* Level Card */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Level */}
              <div className={`p-8 rounded-[2rem] ${levelCfg.bg} border border-opacity-20 col-span-1 space-y-4`}>
                <div className="text-5xl">{levelCfg.icon}</div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Level</div>
                  <h2 className="text-3xl font-bold" style={{ color: levelCfg.color }}>{data.level}</h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">{levelCfg.badge}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Progress to {data.milestone.target}</span>
                    <span>{Math.round(data.milestone.progress)}%</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.milestone.progress}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: levelCfg.color }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{data.milestone.condition}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="col-span-2 grid grid-cols-2 gap-5">
                {[
                  { label: 'Active Skills', val: data.totalSkills, icon: <Sparkles size={14} />, color: '#d97757' },
                  { label: 'Top Tags', val: data.topTags.slice(0, 2).join(', ') || 'None yet', icon: <Target size={14} />, color: '#3b82f6' },
                  { label: 'Skill Gaps Detected', val: data.gaps.length, icon: <AlertCircle size={14} />, color: '#ef4444' },
                  { label: 'Most Used', val: data.mostUsed[0] || 'N/A', icon: <Trophy size={14} />, color: '#8b5cf6' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-2" style={{ color: s.color }}>
                      {s.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 truncate">{s.val}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skill Gap Pills */}
            {data.gaps.length > 0 && (
              <section className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 space-y-4">
                <h2 className="text-xl font-serif text-amber-900 flex items-center gap-2">
                  <AlertCircle size={20} /> Skill Gap Analysis for <span className="text-[#d97757]">{role}</span>
                </h2>
                <p className="text-sm text-amber-700">These capability areas are common among top {role}s but missing from your library:</p>
                <div className="flex flex-wrap gap-3">
                  {data.gaps.map((gap, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-amber-200 rounded-full text-sm font-bold text-amber-800 flex items-center gap-2">
                      <Lock size={12} /> {gap}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Personalized Recommendations */}
            <section className="space-y-6">
              <h2 className="text-2xl font-serif text-slate-900">Personalized Recommendations</h2>
              <div className="space-y-4">
                {data.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-5 items-start hover:shadow-md transition-shadow"
                  >
                    <div className="p-3 bg-slate-50 rounded-xl flex-shrink-0">
                      {TYPE_ICON[rec.type] || <Sparkles size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{rec.title}</h3>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[rec.priority]}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{rec.impact}</span>
                        <button
                          onClick={() => {
                            if (rec.action === 'Create Skill') onNavigate('create');
                            else if (rec.action === 'Run Benchmark') onNavigate('benchmark');
                            else if (rec.action === 'Publish Skills') onNavigate('library');
                          }}
                          className="text-xs font-bold text-[#d97757] flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          {rec.action} <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Profession Skill Pack */}
            {data.skillTemplates && data.skillTemplates.length > 0 && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-slate-900">
                      {role} Skill Pack
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {data.skillTemplates.length} pre-built Skills curated for {role}s — add them to your library instantly.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d97757] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                    Curated for You
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {data.skillTemplates.map((tmpl: any, i: number) => {
                    const isAdded = addedTemplates.has(tmpl.name);
                    const isAdding = addingTemplate === tmpl.name;
                    const IMPACT_COLOR: Record<string, string> = {
                      High: 'text-red-600 bg-red-50',
                      Medium: 'text-amber-500 bg-amber-50',
                      Low: 'text-green-600 bg-green-50',
                    };
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`bg-white p-6 rounded-2xl border-2 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md ${
                          isAdded ? 'border-green-300 bg-green-50/30' : 'border-slate-100 hover:border-[#d97757]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{tmpl.emoji}</span>
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">{tmpl.name}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(tmpl.tags || []).map((tag: string) => (
                                  <span key={tag} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${IMPACT_COLOR[tmpl.impact] || 'text-slate-400 bg-slate-100'}`}>
                            {tmpl.impact}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed flex-1">{tmpl.instructions}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1"><Clock size={9} /> {tmpl.frequency}</span>
                            <span className="flex items-center gap-1"><Zap size={9} /> {tmpl.tokens}</span>
                          </div>
                          <button
                            onClick={() => handleAddTemplate(tmpl)}
                            disabled={isAdded || isAdding}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isAdded
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-black text-white hover:bg-[#d97757] active:scale-95'
                            }`}
                          >
                            {isAdding ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : isAdded ? (
                              <><CheckCircle2 size={12} /> Added</>
                            ) : (
                              <><Plus size={12} /> Add to Library</>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Persona Roadmap */}
            <section className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Map size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-slate-900">Mastery Roadmap for {role}s</h2>
                  <p className="text-xs text-slate-500">A proven 3-step path to master Claude for your role.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10" />
                
                {(ROADMAPS[role] || ROADMAPS['Professional']).map((j, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center text-[#d97757] relative">
                      {j.icon}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#d97757]">{j.step}</div>
                      <div className="text-sm font-bold text-slate-900">{j.task}</div>
                    </div>
                    <button 
                      onClick={() => {
                        onNavigate('input');
                        triggerConfetti();
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-black flex items-center gap-1 transition-colors"
                    >
                      Start Task <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Path */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-[#1a1a1a] p-8 rounded-[2rem] text-white space-y-8">
                <div>
                  <h2 className="text-2xl font-serif text-[#d97757]">Your Learning Path</h2>
                  <p className="text-slate-400 text-sm mt-1">Next steps to reach {data.milestone.target} level.</p>
                </div>
                <div className="space-y-6">
                  {data.learningPath.map((step, i) => (
                    <div key={i} className="flex items-center gap-5">
                      <button
                        onClick={() => {
                          setCompletedSteps(prev => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i); else next.add(i);
                            saveProfile({ completedSteps: Array.from(next) }); // Persist progress
                            return next;
                          });
                        }}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          completedSteps.has(i)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-slate-600 text-slate-600 hover:border-[#d97757]'
                        }`}
                      >
                        {completedSteps.has(i) ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${completedSteps.has(i) ? 'line-through text-slate-500' : 'text-white'}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{step.est}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div>
                  <h2 className="text-2xl font-serif text-slate-900">Achievements</h2>
                  <p className="text-slate-500 text-sm mt-1">Milestones on your mastery roadmap.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: '🌱', title: 'First Skill Created', unlocked: data.totalSkills >= 1 },
                    { icon: '⚡', title: 'Power Analyst — 5+ Skills', unlocked: data.totalSkills >= 5 },
                    { icon: '🚀', title: 'Workflow Builder', unlocked: false },
                    { icon: '🤝', title: 'Team Contributor', unlocked: false },
                    { icon: '💎', title: 'Claude Expert', unlocked: data.level === 'Expert' },
                  ].map((a, i) => (
                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${a.unlocked ? 'bg-[#f3f3ee]' : 'opacity-40 grayscale'}`}>
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{a.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{a.unlocked ? '✓ Unlocked' : 'Locked'}</p>
                      </div>
                      {a.unlocked && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Skill Tree Mastery */}
            <section className="mt-12 space-y-6">
              <SkillTreeView />
            </section>
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  );
};

export default GrowthHubView;
