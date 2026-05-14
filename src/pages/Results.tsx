import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, TrendingUp, ChevronRight, FileText, Download, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

const ACADEMIC_HISTORY = [
  { term: 'Trimester 3, 2025', units: [
    { code: 'BIT101', name: 'Network Security Fundamentals', grade: 'DI', mark: 78, credit: 6 },
    { code: 'BIT102', name: 'Software Design Patterns', grade: 'HD', mark: 86, credit: 6 },
    { code: 'BIT103', name: 'Systems Analysis', grade: 'CR', mark: 68, credit: 6 },
  ]},
  { term: 'Trimester 2, 2025', units: [
    { code: 'COR101', name: 'Academic Integrity', grade: 'PS', mark: 55, credit: 2 },
    { code: 'BIT104', name: 'Data Structures', grade: 'DI', mark: 72, credit: 6 },
    { code: 'BIT105', name: 'Professional Communication', grade: 'HD', mark: 92, credit: 6 },
  ]}
];

export default function Results() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest">
            <GraduationCap className="w-3 h-3" />
            Scholarship
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">Academic Record</h1>
          <p className="text-slate-500 font-medium max-w-md">Official unit results, GPA calculation, and trimester performance history.</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-brand-indigo transition-all shadow-sm">
          <Download className="w-4 h-4" /> Download Transcript
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
              { label: 'Cumulative GPA', value: '3.42', icon: Star, color: 'bg-brand-indigo' },
              { label: 'Current WAM', value: '78.5', icon: TrendingUp, color: 'bg-rose-500' },
              { label: 'Credits Earned', value: '32', icon: Award, color: 'bg-emerald-600' },
              { label: 'Standing', value: 'Good', icon: GraduationCap, color: 'bg-slate-900' },
          ].map((stat, i) => (
              <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-indigo/30 transition-all text-left"
              >
                  <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-display font-black text-slate-800">{stat.value}</p>
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
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                      {term.term} <div className="h-px flex-1 bg-slate-100" />
                  </h3>
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="px-8 py-4 border-b border-slate-100">Unit Code</th>
                                  <th className="px-8 py-4 border-b border-slate-100">Unit Name</th>
                                  <th className="px-8 py-4 border-b border-slate-100 text-center">Grade</th>
                                  <th className="px-8 py-4 border-b border-slate-100 text-right">Mark</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {term.units.map((unit, j) => (
                                  <tr key={j} className="hover:bg-slate-50/50 transition-colors group">
                                      <td className="px-8 py-5 font-mono text-[11px] font-black text-slate-400 uppercase">{unit.code}</td>
                                      <td className="px-8 py-5 text-sm font-bold text-slate-700">{unit.name}</td>
                                      <td className="px-8 py-5 text-center">
                                          <span className={cn(
                                              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                                              unit.mark >= 85 ? "bg-indigo-50 text-brand-indigo" :
                                              unit.mark >= 75 ? "bg-emerald-50 text-emerald-700" :
                                              unit.mark >= 65 ? "bg-amber-50 text-amber-700" :
                                              "bg-slate-100 text-slate-600"
                                          )}>
                                              {unit.grade}
                                          </span>
                                      </td>
                                      <td className="px-8 py-5 text-right font-display font-black text-slate-800">{unit.mark}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          ))}
      </div>

      {/* Grading Legend */}
      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 flex flex-col md:flex-row gap-12">
          <div className="max-w-xs">
              <h4 className="text-xl font-display font-black text-slate-800 mb-4">Grading Key</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  The CIHE grading schema follows official AQF standards for higher education accreditation in Australia.
              </p>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                  { k: 'HD', v: '85-100', d: 'High Distinction' },
                  { k: 'DI', v: '75-84', d: 'Distinction' },
                  { k: 'CR', v: '65-74', d: 'Credit' },
                  { k: 'PS', v: '50-64', d: 'Pass' },
              ].map((item, i) => (
                  <div key={i}>
                      <div className="text-[10px] font-black text-brand-indigo mb-1">{item.k}</div>
                      <div className="text-sm font-black text-slate-800">{item.v}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.d}</div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
