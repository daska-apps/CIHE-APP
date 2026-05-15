import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Circle, Trophy, Star, FileText, Bell, MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { TIMETABLE_A, TIMETABLE_B, UNIT_TITLES } from '../../lib/timetableData';

// Mock activity counts per unit
const UNIT_ACTIVITY: Record<string, { assignments: number; announcements: number; discussions: number }> = {
  'ICT301': { assignments: 2, announcements: 1, discussions: 0 },
  'ICT302': { assignments: 1, announcements: 3, discussions: 2 },
  'ICT303': { assignments: 0, announcements: 1, discussions: 1 },
  'BIT201': { assignments: 1, announcements: 0, discussions: 0 },
};

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
          {displayUnits.map((unit, i) => {
            const activity = UNIT_ACTIVITY[unit.code] || { assignments: 0, announcements: 0, discussions: 0 };
            const totalActivity = activity.assignments + activity.announcements + activity.discussions;
            return (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02] transition-all border border-transparent dark:border-slate-800/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center relative",
                      unit.status === 'completed' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    )}>
                      {unit.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 animate-pulse" />}
                      {totalActivity > 0 && unit.status !== 'completed' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                          {totalActivity}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{unit.code}</h4>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 max-w-[120px] truncate">{unit.name}</p>
                    </div>
                  </div>
                  {unit.status === 'completed' ? (
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-md">{(unit as any).grade}</span>
                  ) : (
                    <a href="https://moodle.cihe.edu.au" target="_blank" rel="noopener noreferrer"
                      className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-brand-indigo dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                {/* Quick-action row for active units */}
                {unit.status !== 'completed' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button className="relative flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      <FileText className="w-3 h-3" />
                      Tasks
                      {activity.assignments > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">{activity.assignments}</span>
                      )}
                    </button>
                    <button className="relative flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      <Bell className="w-3 h-3" />
                      News
                      {activity.announcements > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">{activity.announcements}</span>
                      )}
                    </button>
                    <button className="relative flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      <MessageSquare className="w-3 h-3" />
                      Chat
                      {activity.discussions > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">{activity.discussions}</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-8 flex items-center justify-center">
          <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-brand-indigo dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
              View Academic Transcript on Meshed <Trophy className="w-3 h-3" />
          </button>
      </div>
    </motion.div>
  );
}
