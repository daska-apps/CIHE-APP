import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, TrendingUp, ChevronRight, FileText, Download, Star, Link2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

const ACADEMIC_HISTORY = [
  { term: 'Trimester 3, 2025', units: [
    { code: 'BIT101', name: 'Network Security Fundamentals', grade: 'DI', mark: 78, credit: 6 },
    { code: 'BIT102', name: 'Software Design Patterns',      grade: 'HD', mark: 86, credit: 6 },
    { code: 'BIT103', name: 'Systems Analysis',              grade: 'CR', mark: 68, credit: 6 },
  ]},
  { term: 'Trimester 2, 2025', units: [
    { code: 'COR101', name: 'Academic Integrity',            grade: 'PS', mark: 55, credit: 2 },
    { code: 'BIT104', name: 'Data Structures',               grade: 'DI', mark: 72, credit: 6 },
    { code: 'BIT105', name: 'Professional Communication',    grade: 'HD', mark: 92, credit: 6 },
  ]},
];

function gradeColor(mark: number) {
  if (mark >= 85) return 'bg-indigo-100 dark:bg-indigo-500/20 text-brand-indigo dark:text-indigo-300';
  if (mark >= 75) return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
  if (mark >= 65) return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300';
  return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
}

export default function Results() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            <GraduationCap className="w-3 h-3" />
            Scholarship
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight">Academic Record</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Official unit results, GPA calculation, and trimester performance history.</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://moodle.cihe.edu.au"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#f47b20] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-sm"
          >
            <Link2 className="w-4 h-4" /> Open in Moodle
          </a>
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-brand-indigo dark:hover:border-indigo-500 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Download Transcript
          </button>
        </div>
      </header>

      {/* Moodle link notice */}
      <div className="flex items-center gap-4 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
          Live grades are pulled from <strong>Moodle LMS</strong>. Connect your Microsoft account in Settings to enable real-time sync. Data shown below is cached.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Cumulative GPA', value: '3.42', icon: Star,         color: 'bg-brand-indigo' },
          { label: 'Current WAM',    value: '78.5', icon: TrendingUp,   color: 'bg-rose-500'     },
          { label: 'Credits Earned', value: '32',   icon: Award,        color: 'bg-emerald-600'  },
          { label: 'Standing',       value: 'Good', icon: GraduationCap, color: 'bg-slate-700 dark:bg-slate-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-brand-indigo/30 dark:hover:border-indigo-500/30 transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-black text-slate-800 dark:text-white">{stat.value}</p>
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Historical Results */}
      <div className="space-y-8">
        {ACADEMIC_HISTORY.map((term, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
              {term.term}
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Unit Code</th>
                    <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Unit Name</th>
                    <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 text-center">Grade</th>
                    <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 text-right">Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {term.units.map((unit, j) => (
                    <tr key={j} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-8 py-5 font-mono text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase">{unit.code}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-700 dark:text-slate-200">{unit.name}</td>
                      <td className="px-8 py-5 text-center">
                        <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider", gradeColor(unit.mark))}>
                          {unit.grade}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-display font-black text-slate-800 dark:text-white">{unit.mark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Grading Legend */}
      <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-12">
        <div className="max-w-xs">
          <h4 className="text-xl font-display font-black text-slate-800 dark:text-white mb-4">Grading Key</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
            The CIHE grading schema follows official AQF standards for higher education accreditation in Australia.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { k: 'HD', v: '85–100', d: 'High Distinction' },
            { k: 'DI', v: '75–84',  d: 'Distinction'      },
            { k: 'CR', v: '65–74',  d: 'Credit'           },
            { k: 'PS', v: '50–64',  d: 'Pass'             },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 mb-1">{item.k}</div>
              <div className="text-sm font-black text-slate-800 dark:text-white">{item.v}</div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
