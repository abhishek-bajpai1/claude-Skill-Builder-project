"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingView from '@/components/views/LandingView';
import TaskInputView from '@/components/views/TaskInputView';
import CreateSkillForm from '@/components/views/CreateSkillForm';
import DashboardView from '@/components/views/DashboardView';
import TeamLibraryView from '@/components/views/TeamLibraryView';
import PrivacyInspector from '@/components/views/PrivacyInspector';
import ModelBenchmarkCard from '@/components/views/ModelBenchmarkCard';
import DecisionCockpit from '@/components/views/DecisionCockpit';
import GrowthHubView from '@/components/views/GrowthHubView';
import PMCommandCenter from '@/components/pm/PMCommandCenter';
import UserProfileView from '@/components/views/UserProfileView';
import AgentCouncilView from '@/components/views/AgentCouncilView';
import Sidebar from '@/components/Sidebar';
import { triggerConfetti } from '@/lib/celebrate';
import { analyzeTask, fetchSkills, createSkill, type AnalysisResult, type Skill } from '@/lib/api';
import { BrainCircuit, Loader2 } from 'lucide-react';

type FlowStep = 'landing' | 'profiler' | 'input' | 'analyzing' | 'recommendation' | 'create' | 'dashboard' | 'benchmark' | 'library' | 'privacy' | 'growth' | 'pm_center' | 'council';

export default function Home() {
  const [step, setStep] = useState<FlowStep>('landing');
  const [profile, setProfile] = useState<{ persona: string; goal: string; experience: string } | null>(null);
  const [task, setTask] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    // Check for previous session state if needed
  }, []);

  const loadSkills = useCallback(async () => {
    setLoadingSkills(true);
    try {
      const data = await fetchSkills();
      setSkills(data);
    } catch (e) {
      console.error('Failed to load skills', e);
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const handleTaskSubmit = async (newTask: string) => {
    setTask(newTask);
    setStep('analyzing');
    try {
      const result = await analyzeTask(newTask, profile?.persona || undefined);
      setAnalysis(result);
      setStep('recommendation');
    } catch (e) {
      alert('Analysis failed. Please try again.');
      setStep('input');
    }
  };

  const handleSaveSkill = async (formData: any) => {
    try {
      const newSkill = await createSkill({
        name: formData.name,
        instructions: formData.instructions,
        output: formData.output,
        frequency: formData.frequency,
        capability: analysis?.capability || 'workflow',
        subscription: analysis?.subscription || 'Free',
        team: 'My Workspace',
        tags: [formData.model.toUpperCase()], // Tagging with the chosen model
      });
      setSkills(prev => [newSkill, ...prev]);
      triggerConfetti(); // 🎉 Celebrate success
      setStep('dashboard');
    } catch (e) {
      alert('Failed to save skill. Please try again.');
    }
  };

  const navLinks: { label: string; step: FlowStep }[] = [];

  const levelCfg = skills.length >= 10 ? '#8b5cf6' : skills.length >= 5 ? '#d97757' : '#3b82f6';

  const Stepper = () => {
    const steps = [
      { id: 'input', label: 'Define Task' },
      { id: 'analyzing', label: 'Stress Test' },
      { id: 'recommendation', label: 'Strategic Roadmap' },
      { id: 'create', label: 'Deploy' },
    ];
    const currentIndex = steps.findIndex(s => s.id === (step === 'recommendation' ? 'recommendation' : step));
    if (currentIndex === -1 && step !== 'recommendation' && step !== 'create') return null;

    return (
      <div className="max-w-xl mx-auto mb-12 flex items-center justify-between relative px-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-4 ${
              i < currentIndex ? 'bg-green-500 border-green-50 text-white' :
              i === currentIndex ? 'bg-black border-slate-50 text-white scale-110 shadow-lg' :
              'bg-white border-slate-50 text-slate-300'
            }`}>
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${i === currentIndex ? 'text-black' : 'text-slate-300'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      {step !== 'landing' && step !== 'profiler' && (
        <Sidebar 
          currentStep={step} 
          onNavigate={(s) => setStep(s)} 
          xp={skills.length * 45} 
          level={Math.floor((skills.length * 45) / 100) + 1}
        />
      )}

      <div className={step !== 'landing' && step !== 'profiler' ? "pl-72" : ""}>
        <div className="py-8 px-4 md:px-12 max-w-7xl mx-auto">

      <Stepper />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {step === 'landing' && (
            <LandingView 
              onStart={(mode) => {
                if (mode?.startsWith('council_')) {
                  const subMode = mode.split('_')[1];
                  // Set pre-defined tasks for instant help
                  if (subMode === 'job') setTask('Career pivot analysis: Give me a 90-day trajectory audit.');
                  if (subMode === 'business') setTask('Business bottleneck fix: Analyze my current scaling issues.');
                  if (subMode === 'health') setTask('Health optimization: Create a neural performance blueprint.');
                  setStep('council');
                } else {
                  setStep('profiler');
                }
              }} 
            />
          )}
          
          {step === 'profiler' && (
            <UserProfileView 
              onSubmit={(p) => { setProfile(p); setStep('input'); }} 
              onBack={() => setStep('landing')} 
            />
          )}

          {step === 'input' && <TaskInputView onSubmit={handleTaskSubmit} onBack={() => setStep('profiler')} />}

          {/* Analyzing Loading State */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
              <Loader2 size={48} className="animate-spin text-[#d97757]" />
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-slate-900">Stress testing task architecture...</h2>
                <p className="text-slate-500">Simulating failure modes, drift risk, and tier-specific stability.</p>
              </div>
              <div className="flex gap-2 text-xs font-bold text-slate-300">
                {['Archetype Matching', 'Drift Simulation', 'Capability Validation'].map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.4 }}
                    className="px-3 py-1 bg-white border border-slate-100 rounded-full"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {step === 'recommendation' && analysis && (
            <DecisionCockpit
              task={task}
              analysis={analysis}
              onCreateAction={() => setStep('create')}
              onDashboard={() => setStep('dashboard')}
            />
          )}

          {step === 'create' && (
            <CreateSkillForm 
              onSave={handleSaveSkill} 
              onCancel={() => setStep('recommendation')} 
              analysis={analysis} 
            />
          )}

          {step === 'dashboard' && (
            <DashboardView
              skills={skills}
              onNewTask={() => setStep('input')}
              onRefresh={loadSkills}
              loading={loadingSkills}
            />
          )}

          {step === 'benchmark' && (
            <div className="max-w-5xl mx-auto py-12 space-y-8">
              <div>
                <h1 className="text-4xl font-serif text-slate-900">Model Benchmarking</h1>
                <p className="text-slate-500 mt-2">Compare Claude models for your specific task.</p>
                {task && <p className="text-xs text-[#d97757] font-bold mt-1 uppercase tracking-wider">Based on: "{task.slice(0, 60)}{task.length > 60 ? '…' : ''}"</p>}
              </div>
              <ModelBenchmarkCard task={task} />
            </div>
          )}

          {step === 'library' && (
            <div className="max-w-5xl mx-auto py-12">
              <TeamLibraryView skills={skills} onRefresh={loadSkills} />
            </div>
          )}

          {step === 'privacy' && (
            <div className="max-w-4xl mx-auto py-12 space-y-8">
              <div>
                <h1 className="text-4xl font-serif text-slate-900">Privacy & Security Inspector</h1>
                <p className="text-slate-500 mt-2">Enterprise compliance analysis for active capabilities.</p>
              </div>
              <PrivacyInspector />
            </div>
          )}

          {step === 'growth' && (
            <GrowthHubView onNavigate={(s) => setStep(s as FlowStep)} />
          )}

          {step === 'pm_center' && (
            <PMCommandCenter />
          )}

          {step === 'council' && (
            <AgentCouncilView initialTask={task} />
          )}
        </motion.div>
      </AnimatePresence>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          <div>Skill Advisor © 2026</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Methodology</a>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
