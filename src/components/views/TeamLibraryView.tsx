"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitFork, Users, Star, Search, BarChart3, Zap, Trash2, Loader2 } from 'lucide-react';
import { starSkill, deleteSkill, type Skill } from '@/lib/api';

interface Props {
  skills: Skill[];
  onRefresh: () => void;
}

const TeamLibraryView: React.FC<Props> = ({ skills, onRefresh }) => {
  const [query, setQuery] = useState('');
  const [forked, setForked] = useState<Set<string>>(new Set());
  const [starring, setStarring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = skills.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.team || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleStar = async (id: string) => {
    setStarring(id);
    try {
      await starSkill(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setStarring(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    setDeleting(id);
    try {
      await deleteSkill(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900">Team Capability Library</h2>
          <p className="text-slate-500 text-sm mt-1">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} · Discover and fork capabilities built by your org.
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or team..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#d97757] transition-colors w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-bold">No skills found. Create one from the Dashboard!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 mr-4">
                  <h3 className="font-bold text-slate-900">{skill.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Users size={10} />{skill.team || 'My Workspace'}
                    <span>·</span>
                    <span className="capitalize">{skill.frequency}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const next = new Set(forked);
                      if (next.has(skill.id)) next.delete(skill.id); else next.add(skill.id);
                      setForked(next);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      forked.has(skill.id)
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-[#d97757] hover:text-white'
                    }`}
                  >
                    <GitFork size={12} />
                    {forked.has(skill.id) ? 'Forked' : 'Fork'}
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    {deleting === skill.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {skill.instructions && (
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{skill.instructions}</p>
              )}

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-bold">
                <div className="text-center">
                  <div className="text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                    <BarChart3 size={9} /> Uses
                  </div>
                  <div className="text-slate-900">{skill.uses}</div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleStar(skill.id)}
                    disabled={starring === skill.id}
                    className="w-full group"
                  >
                    <div className="text-slate-400 mb-0.5 flex items-center justify-center gap-1 group-hover:text-amber-400 transition-colors">
                      {starring === skill.id ? <Loader2 size={9} className="animate-spin" /> : <Star size={9} />} Stars
                    </div>
                    <div className="text-slate-900 group-hover:text-amber-500 transition-colors">{skill.stars}</div>
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                    <Zap size={9} /> Tokens
                  </div>
                  <div className="text-slate-900">{skill.tokens}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamLibraryView;
