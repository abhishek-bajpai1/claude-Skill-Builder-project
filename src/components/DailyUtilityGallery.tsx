/**
 * DailyUtilityGallery.tsx
 * 
 * A simplified gallery for 'Day-to-day' AI utility.
 * Focuses on immediate outcomes for common corporate/creative tasks.
 */
import React from 'react';
import { Mail, FileText, CheckCircle, Code, Layout, MessageSquare } from 'lucide-react';

interface QuickSkill {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  outcome: string;
  intent: string;
}

const DAILY_SKILLS: QuickSkill[] = [
  {
    id: 'email-audit',
    label: 'Email Outreach Auditor',
    description: 'Ensure your emails hit the perfect tone and compliance.',
    icon: <Mail className="text-blue-500" />,
    outcome: 'Saves 45 mins/day',
    intent: 'Audit my email outreach for tone, clarity, and enterprise compliance.'
  },
  {
    id: 'meeting-scribe',
    label: 'The Meeting Scribe',
    description: 'Turn messy transcripts into perfect, actionable standup notes.',
    icon: <MessageSquare className="text-purple-500" />,
    outcome: '98% accuracy floor',
    intent: 'Create a structured summary and action items from this meeting transcript.'
  },
  {
    id: 'code-review',
    label: 'PR Logic Guard',
    description: 'Autonomous logic review for your daily pull requests.',
    icon: <Code className="text-amber-600" />,
    outcome: 'Detects 85% of logic drift',
    intent: 'Refactor this code for stability and identify any potential regression bugs.'
  },
  {
    id: 'data-format',
    label: 'Data Architect',
    description: 'Standardize messy CSV/JSON data into enterprise schemas.',
    icon: <Layout className="text-green-600" />,
    outcome: 'Zero manual formatting',
    intent: 'Transform this raw data into a structured reporting template with validation.'
  }
];

interface Props {
  onSelect: (intent: string) => void;
}

const DailyUtilityGallery: React.FC<Props> = ({ onSelect }) => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif text-slate-900">Experience Daily Utility</h2>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-black text-[10px]">Zero-Prompt Deployment</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Recommended for you
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DAILY_SKILLS.map((skill) => (
          <button
            key={skill.id}
            onClick={() => onSelect(skill.intent)}
            className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="mb-4 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {skill.icon}
            </div>
            
            <h3 className="font-bold text-slate-900 mb-2">{skill.label}</h3>
            <p className="text-[11px] leading-relaxed text-slate-500 mb-6">
              {skill.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[9px] font-black text-[#d97757] uppercase tracking-tighter">
                {skill.outcome}
              </span>
              <CheckCircle size={14} className="text-slate-200 group-hover:text-green-500 transition-colors" />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default DailyUtilityGallery;
