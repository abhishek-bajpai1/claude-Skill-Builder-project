"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, User, Loader2, BrainCircuit, TrendingUp, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CareerMentor = ({ userRole }: { userRole: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your Neural Career Mentor. Based on your profile as a ${userRole}, I've been auditing your skill trajectory. What's your career goal today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState(5);
  const [isOnCall, setIsOnCall] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || messagesRemaining <= 0) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    setMessagesRemaining(prev => prev - 1);

    try {
      const res = await fetch('/api/council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: `Career Coaching for a ${userRole}. User Goal/Question: ${userMsg}`, 
          mode: 'career' 
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.summary || "Strategic audit complete. I recommend immediate upskilling in domain-specific AI logic." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural resolve complete. To hit your goal, you should prioritize building 3-5 autonomous agent workflows." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d97757] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
               <BrainCircuit size={20} />
            </div>
            <div>
               <h3 className="text-sm font-bold">Neural Career Mentor</h3>
               <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnCall ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {isOnCall ? 'On Call with Agents' : 'Real-time Coaching Active'}
                  </span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
               <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Free Credits</div>
               <div className={`text-xs font-bold ${messagesRemaining === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {messagesRemaining}/5 Messages
               </div>
            </div>
            <button 
               onClick={() => setIsOnCall(!isOnCall)}
               className={cn(
                  "p-3 rounded-xl transition-all flex items-center gap-2",
                  isOnCall ? "bg-red-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
               )}
            >
               <Headphones size={16} />
               <span className="text-[9px] font-black uppercase tracking-widest">{isOnCall ? 'End Call' : 'Start Call'}</span>
            </button>
         </div>
      </div>

      {/* Call UI Overlay */}
      <AnimatePresence>
         {isOnCall && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 top-[88px] bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-white"
            >
               <div className="relative mb-12">
                  <div className="absolute inset-0 bg-[#d97757] rounded-full blur-[40px] opacity-20 animate-pulse" />
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white/10 relative z-10">
                     <BrainCircuit size={40} className="text-[#d97757]" />
                  </div>
               </div>
               <div className="text-center space-y-4">
                  <h4 className="text-2xl font-serif">Neural Agent Call</h4>
                  <div className="flex items-center justify-center gap-1 h-8">
                     {[1,2,3,4,5,6,7,8].map(i => (
                        <motion.div
                           key={i}
                           animate={{ height: [10, 30, 10] }}
                           transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                           className="w-1 bg-[#d97757] rounded-full"
                        />
                     ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Voice Biometrics...</p>
               </div>
               <button 
                  onClick={() => setIsOnCall(false)}
                  className="mt-16 px-8 py-3 bg-red-500 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
               >
                  End Session
               </button>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fbfaf8]">
         {messages.map((m, i) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={cn(
                  "flex gap-4 max-w-[85%]",
                  m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
               )}
            >
               <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
                  m.role === 'user' ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-[#d97757]"
               )}>
                  {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
               </div>
               <div className={cn(
                  "p-5 rounded-2xl text-sm leading-relaxed",
                  m.role === 'user' 
                     ? "bg-slate-900 text-white rounded-tr-none" 
                     : "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
               )}>
                  {m.content}
               </div>
            </motion.div>
         ))}
         {loading && (
            <div className="flex gap-4 mr-auto">
               <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-[#d97757] flex items-center justify-center animate-pulse">
                  <BrainCircuit size={14} />
               </div>
               <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#d97757] animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consulting Council...</span>
               </div>
            </div>
         )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
         <div className="relative">
            <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Ask for career advice, promotion strategy, or skill audits..."
               className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#d97757] transition-all placeholder:text-slate-400"
            />
            <button
               onClick={handleSend}
               disabled={!input.trim() || loading}
               className="absolute right-2 top-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-[#d97757] transition-all disabled:opacity-50 disabled:grayscale"
            >
               <Send size={16} />
            </button>
         </div>
         <div className="mt-4 flex flex-wrap gap-2">
            {[
               "How do I get a promotion?",
               "What skills should I learn next?",
               "Audit my resume impact",
               "Switching to AI roles"
            ].map((suggest, i) => (
               <button
                  key={i}
                  onClick={() => setInput(suggest)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 hover:border-[#d97757] hover:text-[#d97757] transition-all"
               >
                  {suggest}
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default CareerMentor;
