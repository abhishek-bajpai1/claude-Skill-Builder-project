"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Lightbulb } from 'lucide-react';

import DailyUtilityGallery from '@/components/DailyUtilityGallery';

interface TaskInputViewProps {
  onSubmit: (task: string) => void;
  onBack: () => void;
}

const TaskInputView: React.FC<TaskInputViewProps> = ({ onSubmit, onBack }) => {
  const [task, setTask] = useState("");
  
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="space-y-4">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-black transition-colors">← Back to home</button>
        <h2 className="text-4xl font-serif text-[#1a1a1a]">What should Claude help you with?</h2>
        <p className="text-gray-500">Describe the task in detail. We'll analyze whether a simple prompt, a skill, or a full workflow is best.</p>
      </div>

      <div className="relative">
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g., Every Monday, I need to process these 5 CSVs and generate a summary report..."
          className="w-full h-48 p-8 bg-white border-2 border-transparent focus:border-[#d97757] rounded-3xl shadow-sm text-lg resize-none outline-none transition-all placeholder:text-gray-300"
        />
        <div className="absolute top-4 right-4 text-gray-300">
           <MessageSquare className="w-6 h-6" />
        </div>

        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => onSubmit(task)}
            disabled={!task.trim()}
            className="px-8 py-4 bg-[#d97757] disabled:bg-gray-200 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Analyze Task
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <DailyUtilityGallery onSelect={(intent) => onSubmit(intent)} />
    </div>
  );
};

export default TaskInputView;
