"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, PlusCircle, Trash2, TrendingUp, 
  UserCircle, Target, Sparkles, Clock, ArrowRight 
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'skill_created' | 'skill_deleted' | 'rice_run' | 'level_up' | 'role_switch';
  description: string;
  timestamp: string;
  meta?: any;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const res = await fetch('/api/activity');
      const data = await res.json();
      setActivities(data.activity || []);
    } catch (e) {
      console.error('Failed to load activity feed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    // Refresh every 30 seconds for "dynamic" feel
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    skill_created: { icon: <PlusCircle size={14} />, color: '#22c55e', bg: 'bg-green-50' },
    skill_deleted: { icon: <Trash2 size={14} />, color: '#ef4444', bg: 'bg-red-50' },
    rice_run:      { icon: <Target size={14} />, color: '#3b82f6', bg: 'bg-blue-50' },
    level_up:      { icon: <Sparkles size={14} />, color: '#f59e0b', bg: 'bg-amber-50' },
    role_switch:   { icon: <UserCircle size={14} />, color: '#8b5cf6', bg: 'bg-purple-50' },
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-[#d97757]" />
          <h2 className="text-xl font-serif text-slate-900">Live Activity</h2>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-2 bg-slate-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-4xl">🕒</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity yet</p>
            <p className="text-xs text-slate-400">Start creating skills or analyzing tasks to see updates here.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-2 bottom-0 left-[15px] w-0.5 bg-slate-50" />
            
            <div className="space-y-8">
              <AnimatePresence initial={false}>
                {activities.map((event, i) => {
                  const cfg = TYPE_CONFIG[event.type] || { icon: <Sparkles size={14} />, color: '#94a3b8', bg: 'bg-slate-50' };
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative pl-10 flex flex-col gap-1"
                    >
                      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center border-2 border-white shadow-sm`} style={{ color: cfg.color }}>
                        {cfg.icon}
                      </div>
                      <p className="text-sm text-slate-700 leading-snug">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Clock size={10} /> {formatTime(event.timestamp)}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-50">
        <button 
          onClick={fetchActivity}
          className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
        >
          Refresh Feed <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
