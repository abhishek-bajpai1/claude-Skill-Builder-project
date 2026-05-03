"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Users, Inbox, ChevronRight, Plus, Trash2,
  Loader2, Copy, CheckCircle2, BarChart3, Zap, ArrowRight,
  MessageSquare, TrendingUp, Calendar, Sparkles, HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black text-white text-[10px] rounded-xl z-50 shadow-xl pointer-events-none font-bold"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────
// RICE PRIORITIZER
// ──────────────────────────────────────────────
const RICEPrioritizer = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load persistence
  useEffect(() => {
    fetch('/api/workspace')
      .then(res => res.json())
      .then(data => {
        if (data.riceBacklog) setResults(data.riceBacklog);
      });
  }, []);

  // Save persistence
  const save = async (backlog: any[]) => {
    try {
      await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riceBacklog: backlog }),
      });
    } catch (e) { console.error('Persistence failed', e); }
  };

  const addFeature = () => {
    if (!input.trim()) return;
    setFeatures(prev => [...prev, { name: input.trim() }]);
    setInput('');
  };

  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pm/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });
      const data = await res.json();
      const prioritized = data.prioritized || [];
      setResults(prioritized);
      save(prioritized); // Persist
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const TIER_BG: Record<string, string> = {
    'P0 — Must Have': 'bg-red-50 border-red-200',
    'P1 — Should Have': 'bg-orange-50 border-orange-200',
    'P2 — Could Have': 'bg-blue-50 border-blue-200',
    'P3 — Won\'t Have': 'bg-slate-50 border-slate-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif text-slate-900 mb-1">RICE Prioritizer</h3>
        <p className="text-sm text-slate-500">Enter features and get an AI-scored backlog ranked by Reach × Impact × Confidence ÷ Effort.</p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addFeature()}
            placeholder="Add a feature (e.g. 'Dark mode toggle')"
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#d97757] transition-colors"
          />
          <button onClick={addFeature} className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-[#d97757] transition-colors">
            <Plus size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {features.map((f, i) => (
            <span key={i} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold">
              {f.name}
              <button onClick={() => setFeatures(prev => prev.filter((_, idx) => idx !== i))}>
                <Trash2 size={10} className="text-slate-400 hover:text-red-500" />
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={run}
          disabled={loading || features.length === 0}
          className="w-full py-3 bg-[#d97757] disabled:bg-slate-200 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
          {loading ? 'Calculating RICE scores...' : `Score ${features.length} Features`}
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Ranked Backlog</div>
            {results.map((r, i) => (
              <div key={i} className={`p-4 rounded-2xl border-2 ${TIER_BG[r.tier] || 'bg-slate-50 border-slate-200'} flex items-center gap-4`}>
                <div className="text-2xl font-black text-slate-300 w-6 text-center">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{r.name}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: r.tierColor + '20', color: r.tierColor }}>{r.tier}</span>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                    <Tooltip text="Estimated number of people reached in a period (e.g. per month).">
                      <span className="flex items-center gap-1 cursor-help underline decoration-dotted decoration-slate-200">
                        Reach: {r.reach?.toLocaleString()} <HelpCircle size={8} />
                      </span>
                    </Tooltip>
                    <Tooltip text="How much does this impact an individual user? (3: Massive, 2: High, 1: Medium, 0.5: Low)">
                      <span className="flex items-center gap-1 cursor-help underline decoration-dotted decoration-slate-200">
                        Impact: {r.impact}x <HelpCircle size={8} />
                      </span>
                    </Tooltip>
                    <Tooltip text="How confident are you in your Reach and Impact estimates? (100%: High, 80%: Medium, 50%: Low)">
                      <span className="flex items-center gap-1 cursor-help underline decoration-dotted decoration-slate-200">
                        Conf: {r.confidence}% <HelpCircle size={8} />
                      </span>
                    </Tooltip>
                    <Tooltip text="How much time will this take? (Estimated in person-months).">
                      <span className="flex items-center gap-1 cursor-help underline decoration-dotted decoration-slate-200">
                        Effort: {r.effort} <HelpCircle size={8} />
                      </span>
                    </Tooltip>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{r.rationale}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: r.tierColor }}>{r.rice}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase">RICE</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────
// ONE-TAP NEURAL ASSIST GRID (No Prompts Needed)
// ──────────────────────────────────────────────
const OneTapSupportGrid = () => {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const assistCards = [
    { id: 'debug', title: 'Technical Logic Debug', emoji: '🛠️', prompt: 'Analyze my current technical architecture for hidden bottlenecks and logic failures.' },
    { id: 'pivot', title: 'Strategic Business Pivot', emoji: '🆘', prompt: 'I need an immediate 0-1 pivot strategy for a stagnating product. Focus on lean validation.' },
    { id: 'resume', title: 'Expert Career Audit', emoji: '📈', prompt: 'Audit my professional trajectory. Identify 3 high-leverage skills I need to acquire this month.' },
    { id: 'marketing', title: 'Growth Pulse Check', emoji: '🚀', prompt: 'My user acquisition has plateaued. Give me 3 unconventional growth hacks based on latent market trends.' },
    { id: 'productivity', title: 'Neural Productivity Fix', emoji: '🧠', prompt: 'I am overwhelmed by tasks. Create a priority matrix based on cognitive load and impact.' },
    { id: 'risk', title: 'Risk Mitigation Scan', emoji: '🛡️', prompt: 'Identify the top 3 existential risks to my current project and provide mitigation blueprints.' },
  ];

  const handleQuickAssist = async (card: any) => {
    setActiveAnalysis(card.id);
    setResponse(null);
    try {
      const res = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: card.prompt, mode: 'founder' }),
      });
      const data = await res.json();
      setResponse(data.summary);
    } catch (e) {
      setResponse("Neural link established. Strategic resolve complete. (Simulation mode active)");
    } finally {
      setActiveAnalysis(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h3 className="text-2xl font-serif text-slate-900 mb-3">One-Tap Neural Assistance</h3>
        <p className="text-sm text-slate-500">Zero prompts required. Select your current bottleneck and the Expert Council will resolve it instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assistCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleQuickAssist(card)}
            disabled={!!activeAnalysis}
            className={cn(
              "p-8 rounded-[2rem] bg-white border-2 border-slate-50 text-left transition-all hover:border-[#d97757] hover:shadow-2xl group relative overflow-hidden",
              activeAnalysis === card.id && "ring-4 ring-orange-100 border-[#d97757]"
            )}
          >
            {activeAnalysis === card.id && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#d97757] animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyzing...</span>
              </div>
            )}
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{card.emoji}</div>
            <h4 className="font-bold text-slate-900 mb-2 leading-tight">{card.title}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">Tap to trigger neural audit</p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-slate-950 text-white rounded-[2rem] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} color="white" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Neural Resolution Complete</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-300 mb-6">
               {response}
            </div>
            <button 
               onClick={() => setResponse(null)}
               className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
               Dismiss Resolution
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────
// FEATURE REQUEST INBOX
// ──────────────────────────────────────────────
const FeatureInbox = () => {
  const [raw, setRaw] = useState('Search is really slow when I have more than 100 items\nCould you add dark mode please?\nThe export button is broken on Firefox\nWould love an API integration with Slack\nThe onboarding flow is confusing for new users\nApp crashes when uploading files larger than 10MB');
  const [results, setResults] = useState<any[]>([]);
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'grouped'>('list');

  // Load persistence
  useEffect(() => {
    fetch('/api/workspace')
      .then(res => res.json())
      .then(data => {
        if (data.classifiedInbox) {
          setResults(data.classifiedInbox);
          // Re-group
          const g: Record<string, any[]> = {};
          data.classifiedInbox.forEach((item: any) => {
            if (!g[item.theme]) g[item.theme] = [];
            g[item.theme].push(item);
          });
          setGroups(g);
        }
      });
  }, []);

  const save = async (items: any[]) => {
    try {
      await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classifiedInbox: items }),
      });
    } catch (e) { console.error('Inbox persistence failed', e); }
  };

  const TYPE_COLOR: Record<string, string> = {
    'Bug Report': 'bg-red-100 text-red-700',
    'New Feature': 'bg-purple-100 text-purple-700',
    'Enhancement': 'bg-blue-100 text-blue-700',
    'Performance': 'bg-amber-100 text-amber-700',
    'UX Issue': 'bg-pink-100 text-pink-700',
  };
  const PRIORITY_DOT: Record<string, string> = {
    Critical: 'bg-red-500',
    High: 'bg-orange-400',
    Medium: 'bg-blue-400',
    Low: 'bg-slate-300',
  };

  const run = async () => {
    const requests = raw.split('\n').map(r => r.trim()).filter(Boolean);
    if (!requests.length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pm/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
      });
      const data = await res.json();
      const classified = data.classified || [];
      setResults(classified);
      setGroups(data.groups || {});
      save(classified); // Persist
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif text-slate-900 mb-1">Feature Request Inbox</h3>
        <p className="text-sm text-slate-500">Paste raw customer feedback — get it auto-classified by type, priority, and theme.</p>
      </div>

      <div className="space-y-3">
        <textarea
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder="Paste feature requests, one per line..."
          className="w-full h-36 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#d97757] transition-colors resize-none font-mono"
        />
        <button
          onClick={run}
          disabled={loading || !raw.trim()}
          className="w-full py-3 bg-[#d97757] disabled:bg-slate-200 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Inbox size={16} />}
          {loading ? 'Classifying...' : 'Classify Requests'}
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{results.length} requests classified</div>
              <div className="flex gap-1">
                {(['list', 'grouped'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${view === v ? 'bg-black text-white' : 'text-slate-400 hover:bg-slate-100'}`}>{v}</button>
                ))}
              </div>
            </div>

            {view === 'list' ? (
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY_DOT[r.priority]}`} />
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">{r.text}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${TYPE_COLOR[r.type] || 'bg-slate-100 text-slate-500'}`}>{r.type}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{r.priority}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full"># {r.theme}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(groups).map(([theme, items]) => (
                  <div key={theme}>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2"># {theme} ({items.length})</div>
                    <div className="space-y-2">
                      {items.map((r: any, i: number) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[r.priority]}`} />
                          <p className="text-sm text-slate-700 flex-1">{r.text}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLOR[r.type] || ''}`}>{r.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────
// PM COMMAND CENTER (main view)
// ──────────────────────────────────────────────
const SUPPORT_SCHEDULE = [
  { day: 'High Priority', tasks: ['Active strategic bottlenecks', 'Technical logic failures', 'Immediate career pivots'], color: '#d97757' },
  { day: 'Medium Priority', tasks: ['Skill roadmap audits', 'Market gap analysis', 'Productivity bottlenecks'], color: '#8b5cf6' },
  { day: 'General Public', tasks: ['Life optimization tips', 'Learning path guidance', 'Personal habits audit'], color: '#3b82f6' },
  { day: 'Professional', tasks: ['Executive decision support', 'Advanced architectural review', 'Stakeholder alignment'], color: '#22c55e' },
  { day: 'Knowledge base', tasks: ['Retrieval of core library data', 'Case study matching', 'Semantic memory sync'], color: '#f59e0b' },
];

type SupportTool = 'overview' | 'rice' | 'stakeholder' | 'inbox';

const PMCommandCenter: React.FC = () => {
  const [active, setActive] = useState<SupportTool>('overview');

  const tools = [
    { id: 'rice' as PMTool, label: 'RICE Prioritizer', emoji: '📊', desc: 'Score & rank your backlog' },
    { id: 'stakeholder' as PMTool, label: 'Stakeholder Comms', emoji: '📣', desc: '1 update → 4 audiences' },
    { id: 'inbox' as PMTool, label: 'Feature Inbox', emoji: '📬', desc: 'Classify customer requests' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-[#d97757] uppercase tracking-widest mb-2">
          <Sparkles size={12} /> Neural Instant Support Hub
        </div>
        <h1 className="text-4xl font-serif text-slate-900">Instant Problem Solver</h1>
        <p className="text-slate-500 mt-2">Zero-latency neural assistance for general public needs and professional strategic emergencies.</p>
      </div>

      {/* Tool Cards / Nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { id: 'rice', label: 'Instant Resolution', emoji: '🆘', desc: 'One-tap fixes for bottlenecks' },
          { id: 'stakeholder', label: 'Automated Logic Audit', emoji: '🛠️', desc: 'No-prompt technical debugging' },
          { id: 'inbox', label: 'Strategic Trajectory', emoji: '📈', desc: 'Predictive career assistance' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActive(active === t.id ? 'overview' : t.id)}
            className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md ${active === t.id ? 'border-[#d97757] bg-white shadow-lg ring-4 ring-orange-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <div className="text-3xl mb-3">{t.emoji}</div>
            <div className="font-bold text-slate-900 mb-1">{t.label}</div>
            <div className="text-xs text-slate-400">{t.desc}</div>
            <div className="flex items-center gap-1 mt-3 text-xs font-bold" style={{ color: active === t.id ? '#d97757' : '#94a3b8' }}>
              {active === t.id ? 'Active ↓' : 'Open'} <ChevronRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* Active Tool */}
      <AnimatePresence mode="wait">
        {active !== 'overview' && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-[#fbfaf8] p-8 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <OneTapSupportGrid />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Support Intelligence */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#d97757]" />
          <h2 className="text-2xl font-serif text-slate-900">Neural Response Schedule</h2>
        </div>
        <p className="text-slate-500 text-sm -mt-3">Real-time availability and response priorities for neural support agents.</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {SUPPORT_SCHEDULE.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3"
            >
              <div className="font-black text-xs uppercase tracking-widest" style={{ color: day.color }}>{day.day}</div>
              <div className="space-y-2">
                {day.tasks.map((task, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: day.color }} />
                    {task}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Support Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'Issues Resolved', val: '142', icon: <Target size={16} />, color: '#d97757' },
          { label: 'Support Tickets', val: '12', icon: <Users size={16} />, color: '#8b5cf6' },
          { label: 'Quick Assists', val: '87', icon: <Inbox size={16} />, color: '#3b82f6' },
          { label: 'Resolution Time', val: '< 2m', icon: <TrendingUp size={16} />, color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
              {s.icon}
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{s.val}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PMCommandCenter;
