"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Star, Loader2 } from 'lucide-react';
import { fetchBenchmark } from '@/lib/api';

const Bar = ({ value, color }: { value: number; color: string }) => (
  <div className="w-full bg-slate-100 rounded-full h-2">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="h-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  </div>
);

interface Props { task?: string; }

const ModelBenchmarkCard: React.FC<Props> = ({ task = '' }) => {
  const [models, setModels] = useState<any[]>([]);
  const [smartChoice, setSmartChoice] = useState('sonnet');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBenchmark(task)
      .then(data => {
        setModels(data.models);
        setSmartChoice(data.smartChoice);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [task]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
      <Loader2 className="animate-spin" size={20} />
      <span className="font-bold text-sm">Running benchmark simulation...</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {models.map((m: any) => {
        const isSmartChoice = m.id === smartChoice;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-7 rounded-3xl border-2 space-y-6 transition-all ${
              m.highlight || isSmartChoice
                ? 'border-[#d97757] shadow-xl scale-105 bg-white z-10 ring-4 ring-orange-50'
                : 'border-slate-100 bg-slate-50/60'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900">{m.name}</h3>
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                style={{ backgroundColor: `${m.color}20`, color: m.color }}
              >
                {isSmartChoice ? '⚡ Smart Choice' : m.badge}
              </span>
            </div>

            <div className="space-y-4 text-xs font-bold">
              {[
                { icon: <Clock size={10} />, label: 'Speed', value: m.speed },
                { icon: <Star size={10} />, label: 'Quality', value: m.quality },
                { icon: <Zap size={10} />, label: 'Cost Index', value: m.costIndex },
              ].map(({ icon, label, value }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center gap-1">{icon} {label}</span>
                    <span>{value}%</span>
                  </div>
                  <Bar value={value} color={m.color} />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Latency</span><span className="text-slate-900">{m.latency}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Est. Tokens</span><span className="text-slate-900">{m.tokens}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Cost/Run</span><span className="text-slate-900">{m.costPerRun}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">{m.bestFor}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ModelBenchmarkCard;
