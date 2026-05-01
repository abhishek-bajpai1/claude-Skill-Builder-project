"use client";

import React, { ReactNode } from 'react';

interface TerminalCanvasProps {
  children: ReactNode;
}

const TerminalCanvas: React.FC<TerminalCanvasProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1117] p-4 text-[#c9d1d9] font-mono">
      <div className="w-full max-w-4xl bg-[#010409] border border-[#30363d] rounded-lg shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Terminal Header */}
        <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex-1 text-center text-xs text-[#8b949e]">
            claude — dev@macbook: ~/projects/webapp
          </div>
        </div>
        
        {/* Terminal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TerminalCanvas;
