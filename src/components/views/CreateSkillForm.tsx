"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Info, Zap, Clock, Star, Share2, Target } from 'lucide-react';
import type { AnalysisResult } from '@/lib/api';

interface CreateSkillFormProps {
  onSave: (skill: any) => void;
  onCancel: () => void;
  analysis?: AnalysisResult | null;
}

const CreateSkillForm: React.FC<CreateSkillFormProps> = ({ onSave, onCancel, analysis }) => {
  const [formData, setFormData] = useState({
    name: analysis?.skillName || "",
    instructions: analysis?.refactoredPrompt?.instructions || "",
    output: "",
    frequency: analysis?.frequencyHint || "weekly",
    model: analysis?.strategist.modelRecommendation.id || 'sonnet'
  });

  const models = [
    { id: 'haiku', name: 'Claude 3 Haiku', desc: 'Speed & Cost', color: '#10b981' },
    { id: 'sonnet', name: 'Claude 3.5 Sonnet', desc: 'Expert Balance', color: '#d97757' },
    { id: 'opus', name: 'Claude 3 Opus', desc: 'Deep Reasoning', color: '#8b5cf6' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-4xl font-serif text-[#1a1a1a]">
            {analysis?.strategist.collaborativeAdvice.type === 'fork' ? 'Fork Skill' : 'Create Skill'}
          </h2>
          <p className="text-gray-500">
            {analysis?.strategist.collaborativeAdvice.type === 'fork' 
              ? `Customizing from '${analysis.strategist.collaborativeAdvice.match}' based on your intent.`
              : 'Define your custom capability for team-wide reuse.'}
          </p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Weekly Sales Summarizer"
              className="w-full px-6 py-4 bg-[#f9f9f7] border-2 border-transparent focus:border-[#d97757] rounded-2xl outline-none transition-all placeholder:text-gray-300 font-bold"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-baseline px-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Instructions</label>
              <span className="text-xs text-[#d97757] flex items-center gap-1 font-bold"><Info className="w-3 h-3" /> System Prompt</span>
            </div>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Describe exactly what this skill does and how it should behave..."
              className="w-full h-64 px-6 py-4 bg-[#f9f9f7] border-2 border-transparent focus:border-[#d97757] rounded-2xl outline-none transition-all placeholder:text-gray-300 resize-none font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Expected Output Format</label>
            <input
              type="text"
              value={formData.output}
              onChange={(e) => setFormData({ ...formData, output: e.target.value })}
              placeholder="e.g., Markdown table with a 2-paragraph summary"
              className="w-full px-6 py-4 bg-[#f9f9f7] border-2 border-transparent focus:border-[#d97757] rounded-2xl outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Model Strategist Section */}
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#d97757] text-[10px] font-black uppercase tracking-widest">
              <Zap size={14} /> AI Model Strategist
            </div>
            
            <div className="space-y-3">
              {models.map(m => {
                const isRecommended = analysis?.strategist.modelRecommendation.id === m.id;
                const isSelected = formData.model === m.id;
                
                return (
                  <button
                    key={m.id}
                    onClick={() => setFormData({ ...formData, model: m.id })}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${isSelected ? 'border-[#d97757] bg-white/10' : 'border-white/5 bg-transparent hover:border-white/20'}`}
                  >
                    {isRecommended && (
                       <div className="absolute top-0 right-0 bg-[#d97757] text-[8px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-tighter">
                         Smart Choice
                       </div>
                    )}
                    <div className="font-bold text-sm" style={{ color: isSelected ? '#fff' : '#94a3b8' }}>{m.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{m.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-[10px] text-slate-400 italic leading-relaxed">
              {analysis?.strategist.modelRecommendation.reason || "Select a model to see its architectural fit for your intent."}
            </div>
          </div>

          {/* Mastery Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learnability</div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#d97757]">
                   <Target size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{analysis?.strategist.learningCurve.level || 'Intermediate'}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Difficulty Level</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                   <Clock size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{analysis?.strategist.learningCurve.estimate || '15 mins'}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Mastery Estimate</div>
                </div>
              </div>
            </div>

            {analysis?.strategist.collaborativeAdvice.type === 'fork' && (
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                 <Share2 size={16} className="text-orange-500 shrink-0 mt-1" />
                 <p className="text-[10px] text-orange-700 leading-relaxed font-bold italic">
                   "You are forking an existing pattern. This bypasses structural setup, focus on the instructions."
                 </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button 
              disabled={!formData.name}
              onClick={() => onSave(formData)}
              className="w-full py-5 bg-[#d97757] disabled:bg-slate-200 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-[#c66a4a] transition-all flex items-center justify-center gap-2"
            >
              Finalize Skill <Save size={20} />
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSkillForm;
