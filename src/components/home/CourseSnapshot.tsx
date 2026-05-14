import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Circle, Trophy, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { TIMETABLE_A, TIMETABLE_B, UNIT_TITLES } from '../../lib/timetableData';

export default function CourseSnapshot() {
  const { user, timetableVersion } = useAuthStore();
  
  const currentTimetable = timetableVersion === 'A' ? TIMETABLE_A : TIMETABLE_B;
  const studentData = currentTimetable.find(s => s.id === user?.id);
  
  // Extract unique unit codes from sessions
  const currentUnitCodes = [...new Set(studentData?.sessions.map(s => s.unitCode) || [])];
  
  const currentUnits = currentUnitCodes.map(code => ({
    code,
    name: UNIT_TITLES[code]?.title || 'Enrolled Unit',
    status: 'current' as const
  }));

  // Mock some completed units if it's a student to fill the UI
  const completedUnits = user?.role === 'student' ? [
    { code: 'ICT101', name: 'Discrete Mathematics', status: 'completed' as const, grade: 'DI' },
    { code: 'ICT104', name: 'Programming Fundamentals', status: 'completed' as const, grade: 'HD' },
  ] : [];

  const displayUnits = [...currentUnits, ...completedUnits].slice(0, 4);

  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8"
    >
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
              <h3 className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Course Progress
              </h3>
              <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Bachelor of Info Tech</p>
          </div>
          <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Star className="w-3 h-3 text-brand-indigo dark:text-indigo-400 fill-brand-indigo dark:fill-indigo-400" />
                    </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              <span>Semester 4 Progression</span>
              <span className="text-brand-indigo dark:text-indigo-400">50% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 1, ease: 'circOut' }}
                className="h-full bg-brand-indigo dark:bg-indigo-500" 
              />
          </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayUnits.map((unit, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02] transition-all border border-transparent dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        unit.status === 'completed' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      )}>
                          {unit.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 animate-pulse" />}
                      </div>
                      <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{unit.code}</h4>
                          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{unit.name}</p>
                      </div>
                  </div>
                  {unit.status === 'completed' && (
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-md">{(unit as any).grade}</span>
                  )}
              </div>
          ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
          <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-brand-indigo dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
              View Academic Transcript on Meshed <Trophy className="w-3 h-3" />
          </button>
      </div>
    </motion.div>
  );
}
