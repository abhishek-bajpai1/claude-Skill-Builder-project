"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react';

const PricingPlans = () => {
  const plans = [
    {
      name: 'Neural Starter',
      price: 'Free',
      desc: 'Perfect for general troubleshooting.',
      features: ['3 One-Tap Fixes per day', 'Standard Response Time', 'Community Support'],
      cta: 'Current Plan',
      popular: false,
      color: 'border-slate-100 bg-white'
    },
    {
      name: 'Professional',
      price: '$29',
      desc: 'For high-impact strategic growth.',
      features: ['Unlimited Neural Audits', 'Deep-Dive Council Access', 'Exportable PDF Reports', 'Priority Support Link'],
      cta: 'Upgrade to Pro',
      popular: true,
      color: 'border-[#d97757] bg-white shadow-xl ring-4 ring-orange-50'
    },
    {
      name: 'Enterprise',
      price: '$499',
      desc: 'For organizations & startups.',
      features: ['Custom Agent Personas', 'Stakeholder Alignment Tools', 'Bulk Workflow Debugging', 'Dedicated Neural Architect'],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-slate-900 bg-slate-900 text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
      {plans.map((plan, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`p-10 rounded-[2.5rem] border-2 flex flex-col justify-between relative overflow-hidden ${plan.color}`}
        >
          {plan.popular && (
            <div className="absolute top-6 right-6 px-3 py-1 bg-[#d97757] text-white text-[8px] font-black uppercase tracking-widest rounded-full">
              Most Popular
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-2 mb-6">
               {plan.name === 'Enterprise' ? <Crown size={16} className="text-orange-400" /> : <Zap size={16} className="text-[#d97757]" />}
               <h3 className="text-lg font-bold">{plan.name}</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
               <span className="text-4xl font-bold">{plan.price}</span>
               {plan.price !== 'Free' && <span className="text-sm font-bold text-slate-400">/mo</span>}
            </div>
            <p className={`text-xs mb-8 ${plan.name === 'Enterprise' ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
            
            <ul className="space-y-4 mb-10">
               {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs font-medium">
                     <Check size={14} className={plan.name === 'Enterprise' ? 'text-emerald-400' : 'text-[#d97757]'} />
                     {f}
                  </li>
               ))}
            </ul>
          </div>

          <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            plan.name === 'Enterprise' 
            ? 'bg-white text-black hover:bg-slate-200' 
            : plan.popular 
               ? 'bg-[#d97757] text-white hover:scale-105 shadow-lg shadow-orange-500/20' 
               : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}>
             {plan.cta}
             {plan.name !== 'Neural Starter' && <ArrowRight size={12} />}
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingPlans;
