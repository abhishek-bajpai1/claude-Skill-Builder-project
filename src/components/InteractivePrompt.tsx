"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal } from 'lucide-react';

interface InteractivePromptProps {
  isVisible: boolean;
  onAction: (action: string) => void;
  status: 'initial' | 'planning' | 'planned' | 'sandboxing' | 'complete';
}

const InteractivePrompt: React.FC<InteractivePromptProps> = ({ isVisible, onAction, status }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pt-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-[#d97757] font-bold">?</span>
        <span className="text-[#c9d1d9] text-sm font-semibold">Action required:</span>
      </div>

      <div className="flex flex-wrap gap-6 pl-6">
        {[
          { key: 'A', label: 'Approve Full Run', action: 'approve' },
          { key: 'S', label: 'Sandbox Run (1 file)', action: 'sandbox' },
          { key: 'M', label: 'Modify Plan', action: 'modify' },
          { key: 'C', label: 'Cancel', action: 'cancel' },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => onAction(opt.action)}
            disabled={status === 'sandboxing' || status === 'complete'}
            className={`flex items-center gap-1.5 px-0 py-1 text-sm font-medium transition-all
              ${opt.action === 'sandbox' && status === 'planned'
                ? 'opacity-100 ring-offset-4 ring-1 ring-[#d97757] rounded px-2'
                : 'opacity-70 hover:opacity-100'
              }
              ${(status === 'sandboxing' || status === 'complete') ? 'opacity-30 cursor-not-allowed' : ''}
            `}
          >
            <span className="text-[#d97757] font-bold">{opt.key}</span>
            <span className="text-[#c9d1d9]">{opt.label}</span>
          </button>
        ))}
      </div>
      
      {status === 'planned' && (
        <div className="pl-6 pt-4 text-xs text-[#8b949e] flex items-center gap-2 font-mono">
          <span className="text-[#d97757]">›</span>
          Press Enter to initiate sandbox execution...
        </div>
      )}
    </motion.div>
  );
};

export default InteractivePrompt;
