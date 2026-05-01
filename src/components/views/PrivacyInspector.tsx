"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Eye, Lock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const checks = [
  { label: "PII Detection", status: "pass", detail: "Email addresses detected & auto-redacted (3 instances)", icon: <Eye size={14} /> },
  { label: "Data Residency", status: "pass", detail: "All processing within EU-West-1 region", icon: <Lock size={14} /> },
  { label: "GDPR Alignment", status: "pass", detail: "No persistent user data stored after skill execution", icon: <ShieldCheck size={14} /> },
  { label: "SOC2 Compliance", status: "warning", detail: "Audit logging is recommended for this data volume", icon: <AlertTriangle size={14} /> },
  { label: "Output Sanitization", status: "pass", detail: "Structured output validated against expected schema", icon: <CheckCircle2 size={14} /> },
];

const PrivacyInspector = () => {
  const [open, setOpen] = useState(false);
  const passed = checks.filter(c => c.status === "pass").length;
  const score = Math.round((passed / checks.length) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f172a] text-white p-8 rounded-[2rem] space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white">Privacy & Security Inspector</h2>
          <p className="text-slate-400 text-sm mt-1">Enterprise compliance report for your active Skill.</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold" style={{ color: score >= 80 ? "#4ade80" : "#fb923c" }}>{score}%</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Trust Score</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Checks Passed", val: `${passed}/${checks.length}`, color: "#4ade80" },
          { label: "PII Redacted", val: "3 fields", color: "#60a5fa" },
          { label: "Data Region", val: "EU-West", color: "#d97757" },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{s.label}</div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {open ? "Hide" : "View"} Detailed Report
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {checks.map((c, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${c.status === 'pass' ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                <div className={c.status === 'pass' ? 'text-green-400' : 'text-amber-400'}>{c.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${c.status === 'pass' ? 'text-green-300' : 'text-amber-300'}`}>{c.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.detail}</div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.status === 'pass' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {c.status === 'pass' ? 'PASS' : 'WARN'}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default PrivacyInspector;
