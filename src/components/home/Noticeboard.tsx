import React from 'react';
import { motion } from 'motion/react';
import { Megaphone, Calendar, ChevronRight, Clock, Star, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const NOTICES = [
  { id: 1, type: 'News', title: 'CIHE Australia opens in Perth', date: 'May 10', priority: 'high', description: 'Expanding our footprint to Western Australia with new state-of-the-art facilities.' },
  { id: 2, type: 'Academic', title: 'KU-CIHE IT Double Degree 2026', date: 'May 08', priority: 'normal', description: 'New partnership offering international double degree pathways for BIT students.' },
  { id: 3, type: 'Accreditation', title: 'ACS Accredited Programs', date: 'May 05', priority: 'normal', description: 'Our BIT and MIT programs are officially accredited by the Australian Computer Society.' },
  { id: 4, type: 'Event', title: 'CIHE Graduation Ceremony', date: 'Apr 28', priority: 'high', description: 'Celebrating the achievements of our latest cohort of graduates!' },
];

export default function Noticeboard() {
  return (
    <motion.div 
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8"
    >
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Megaphone className="w-3.5 h-3.5 text-brand-indigo dark:text-indigo-400" />
                  Daily Bulletin
              </h3>
              <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Institutional Notices</p>
          </div>
          <button className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 uppercase tracking-widest hover:underline">Archive</button>
      </div>

      <div className="space-y-6">
          {NOTICES.map((notice, i) => (
              <motion.div 
                key={notice.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                  <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-1 h-12 rounded-full",
                        notice.priority === 'urgent' ? "bg-rose-500" :
                        notice.priority === 'high' ? "bg-amber-500" :
                        "bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-indigo dark:group-hover:bg-indigo-400 transition-colors"
                      )} />
                      <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                notice.priority === 'urgent' ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                              )}>
                                {notice.type}
                              </span>
                              <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {notice.date}
                              </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors leading-tight">
                            {notice.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1 group-hover:text-slate-500 transition-colors">
                            {notice.description}
                          </p>
                      </div>
                  </div>
              </motion.div>
          ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex items-center gap-3 group/tip cursor-pointer">
              <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-indigo dark:text-indigo-400 shadow-sm group-hover/tip:rotate-12 transition-transform">
                  <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Portal Hint</p>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Check 'Academic Record' for Trimester results.</p>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 group-hover/tip:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors" />
          </div>
      </div>
    </motion.div>
  );
}
