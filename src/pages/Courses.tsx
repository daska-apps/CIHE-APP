import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Clock, ArrowRight, Layers, FileText, PlayCircle, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import UnitSummaryModal from '../components/ui/UnitSummaryModal';

const COURSES = [
  {
    id: 'BIT101',
    title: 'Network Security Fundamentals',
    progress: 65,
    lastAccessed: '2 hours ago',
    instructor: 'Dr. Sarah Chen',
    color: 'bg-indigo-600',
    modules: 12,
    completed: 8
  },
  {
    id: 'BIT204',
    title: 'Database Cloud Systems',
    progress: 30,
    lastAccessed: 'Yesterday',
    instructor: 'Prof. Mark Wilson',
    color: 'bg-emerald-600',
    modules: 10,
    completed: 3
  },
  {
    id: 'BIT302',
    title: 'Artificial Intelligence Ethics',
    progress: 85,
    lastAccessed: '3 days ago',
    instructor: 'Dr. Sarah Chen',
    color: 'bg-rose-600',
    modules: 8,
    completed: 7
  },
  {
    id: 'BIT105',
    title: 'Professional Communication',
    progress: 100,
    lastAccessed: '1 week ago',
    instructor: 'Jenna Smith',
    color: 'bg-amber-600',
    modules: 6,
    completed: 6
  }
];

export default function Courses() {
  const [selectedUnit, setSelectedUnit] = useState<{ id: string, title: string } | null>(null);

  return (
    <div className="space-y-12 pb-20">
      <UnitSummaryModal 
        unitId={selectedUnit?.id || ''} 
        unitTitle={selectedUnit?.title || ''} 
        isOpen={!!selectedUnit} 
        onClose={() => setSelectedUnit(null)} 
      />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            Learning Management
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight">Units & Guides</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Your active unit enrollment and course materials via Moodle integrations.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-indigo/30 dark:hover:border-indigo-500/30 transition-all flex flex-col shadow-sm"
          >
            <div className={cn("h-32 p-8 relative overflow-hidden", course.color)}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-sm">
                        {course.id}
                    </span>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-display font-black text-slate-800 dark:text-slate-100 mb-2 group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {course.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                Instructor: {course.instructor}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        className={cn("h-full", course.color)}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Modules</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{course.completed}/{course.modules}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Last Sync</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{course.lastAccessed}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button className="flex-1 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#003B95] dark:hover:bg-indigo-500 transition-all shadow-lg shadow-black/5">
                  Go to Moodle <ArrowRight className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setSelectedUnit({ id: course.id, title: course.title })}
                  className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-brand-indigo dark:text-indigo-400 rounded-2xl flex items-center justify-center hover:bg-brand-indigo dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all group/ai"
                  title="AI Summary"
                >
                  <Sparkles className="w-5 h-5 group-hover/ai:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resources Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: 'Unit Guides', icon: FileText, desc: 'Official PDF guides and assessment briefs.' },
            { label: 'Lecture Reels', icon: PlayCircle, desc: 'Recorded sessions for trimester 1.' },
            { label: 'Cloud Resources', icon: Layers, desc: 'Shared drives for project collaboration.' },
        ].map((item, i) => (
            <button key={i} className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-indigo/30 dark:hover:border-indigo-500/30 transition-all text-left shadow-sm group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-brand-indigo dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight">{item.label}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.desc}</p>
                </div>
            </button>
        ))}
      </div>
    </div>
  );
}
