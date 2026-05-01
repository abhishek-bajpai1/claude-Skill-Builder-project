"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Clapperboard, BookOpen, Clock, Zap, TrendingUp, Star, ChevronRight, Plus, Loader2, Trash2 } from 'lucide-react';
import { deleteSkill, type Skill } from '@/lib/api';
import ActivityFeed from './ActivityFeed';

interface Props {
  skills: Skill[];
  onNewTask: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const weekData = [
  { name: 'Mon', usage: 12, saved: 2.4 },
  { name: 'Tue', usage: 19, saved: 3.1 },
  { name: 'Wed', usage: 8, saved: 1.6 },
  { name: 'Thu', usage: 27, saved: 4.8 },
  { name: 'Fri', usage: 22, saved: 3.9 },
  { name: 'Sat', usage: 5, saved: 0.9 },
  { name: 'Sun', usage: 9, saved: 1.8 },
];

const DashboardView: React.FC<Props> = ({ skills, onNewTask, onRefresh, loading }) => {
  const totalUses = skills.reduce((acc, s) => acc + s.uses, 0);
  const totalStars = skills.reduce((acc, s) => acc + s.stars, 0);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill permanently?')) return;
    try {
      await deleteSkill(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const [role, setRole] = useState('Professional');
  const [learningData, setLearningData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(profile => {
        const userRole = profile.role || 'Professional';
        setRole(userRole);
        return fetch('/api/growth/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: userRole }),
        });
      })
      .then(res => res.json())
      .then(data => setLearningData(data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-slate-900">Skill Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your capabilities and track efficiency.</p>
        </div>
        <button
          onClick={onNewTask}
          className="px-6 py-3 bg-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#d97757] transition-all shadow-sm"
        >
          New Analysis <Plus size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Skills', val: loading ? '...' : String(skills.length), icon: <Star size={16} />, trend: '+' + skills.length },
          { label: 'Total Uses', val: loading ? '...' : String(totalUses), icon: <TrendingUp size={16} />, trend: 'All time' },
          { label: 'Stars Earned', val: loading ? '...' : String(totalStars), icon: <Zap size={16} />, trend: 'Community' },
          { label: 'Time Saved', val: loading ? '...' : `${Math.round(totalUses * 0.08)} hrs`, icon: <Clock size={16} />, trend: 'Est.' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="p-2 bg-[#f3f3ee] rounded-lg text-[#d97757]">{s.icon}</div>
              <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.trend}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
              <div className="text-3xl font-bold text-slate-900">{s.val}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Learning Pathway */}
      {learningData && (
        <div className="bg-[#1a1a1a] p-8 rounded-[2rem] shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[#d97757] uppercase tracking-[0.2em]">
              <BookOpen size={14} /> Current Learning Path: {role}
            </div>
            <h2 className="text-3xl font-serif">Master {learningData.milestone.target}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              You are currently working on: <span className="text-white font-bold">{learningData.learningPath[0]?.title || 'Applying advanced logic.'}</span>. Keep building skills to unlock your next professional badge.
            </p>
          </div>
          <div className="flex-1 w-full bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-3">
              <span>Mastery Progress</span>
              <span className="text-white">{Math.round(learningData.milestone.progress)}%</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${learningData.milestone.progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#d97757]"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{learningData.milestone.condition}</p>
          </div>
        </div>
      )}

      {/* Charts + Skill List + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Usage Chart */}
          <div className="bg-[#1a1a1a] p-8 rounded-[2rem] shadow-xl text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif flex items-center gap-2">
                <TrendingUp size={16} className="text-[#d97757]" /> Usage History
              </h2>
              <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-full">Last 7 Days</span>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97757" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d97757" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#d97757' }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#d97757" strokeWidth={2.5} fillOpacity={1} fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Saved Skills */}
          <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif flex items-center gap-2">
                <Star size={16} className="text-amber-400" /> Saved Skills
              </h2>
              {loading && <Loader2 size={14} className="animate-spin text-slate-400" />}
            </div>

            {skills.length === 0 && !loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <div className="text-3xl mb-2">📭</div>
                No skills yet. Start a new analysis!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.slice(0, 6).map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-all bg-[#fbfaf8] hover:bg-white p-4 rounded-2xl border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl text-sm font-bold text-slate-600 group-hover:bg-[#d97757] group-hover:text-white transition-colors flex-shrink-0 shadow-sm">
                        {skill.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">{skill.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{skill.frequency} · {skill.uses} uses</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {skills.length > 6 && (
              <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                <button className="text-xs font-bold text-slate-400 hover:text-[#d97757] transition-colors uppercase tracking-widest">
                  View All {skills.length} Skills
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 h-[600px] lg:h-auto">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
