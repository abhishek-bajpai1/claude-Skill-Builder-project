"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Coins, AlertTriangle, FileCode, CheckCircle2 } from 'lucide-react';

interface BlueprintCardProps {
  isVisible: boolean;
}

const BlueprintCard: React.FC<BlueprintCardProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-6 border border-[#30363d] rounded-lg bg-[#0d1117] p-6 border-l-4 border-l-[#d97757] space-y-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#d97757]" />
          Agent Execution Blueprint
        </h3>
        <span className="text-[10px] bg-[#1f2428] text-[#8b949e] px-2 py-1 rounded border border-[#30363d] font-mono">
          CLAUDE-3.5-SONNET
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-white mb-2">Target Trajectory</h4>
        <div className="space-y-1 text-sm font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#30363d]">├──</span>
            <FileCode className="w-4 h-4 text-[#79c0ff]" />
            <span className="text-[#a5d6ff]">src/middleware/auth.ts</span>
            <span className="text-[#e3b341] text-xs">[modify]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#30363d]">├──</span>
            <FileCode className="w-4 h-4 text-[#79c0ff]" />
            <span className="text-[#a5d6ff]">src/routes/api.ts</span>
            <span className="text-[#e3b341] text-xs">[modify]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#30363d]">├──</span>
            <FileCode className="w-4 h-4 text-[#79c0ff]" />
            <span className="text-[#a5d6ff]">package.json</span>
            <span className="text-[#e3b341] text-xs">[modify]</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#30363d]">└──</span>
            <FileCode className="w-4 h-4 text-[#79c0ff]" />
            <span className="text-[#a5d6ff]">src/tests/auth.test.ts</span>
            <span className="text-[#e3b341] text-xs">[modify]</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#30363d]">
        <div className="space-y-1">
          <div className="text-xs text-[#8b949e]">Estimated Cost</div>
          <div className="text-sm font-bold text-[#a5d6ff] flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#e3b341]" />
            ~28,000 tokens ($0.08)
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#8b949e]">Risk Assessment</div>
          <div className="text-sm font-bold text-[#ff7b72] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Medium (Middleware)
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlueprintCard;
