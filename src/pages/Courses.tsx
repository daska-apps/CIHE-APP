import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Clock, ArrowRight, Layers, FileText, PlayCircle, Sparkles, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import UnitSummaryModal from '../components/ui/UnitSummaryModal';

const COURSES = [
  {
    id: 'ICT104',
    title: 'Programming Fundamentals',
    program: 'Bachelor of Information Technology',
    progress: 65,
    lastAccessed: '2 hours ago',
    instructor: 'Qurat',
    color: 'bg-indigo-600',
    modules: 12,
    completed: 8,
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=104',
  },
  {
    id: 'ICT940',
    title: 'Data Analytics & Visualization',
    program: 'Master of Information Technology',
    progress: 30,
    lastAccessed: 'Yesterday',
    instructor: 'Madhumita',
    color: 'bg-emerald-600',
    modules: 10,
    completed: 3,
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=940',
  },
  {
    id: 'ICT945',
    title: 'Cyber Security Operations',
    program: 'Bachelor of Information Technology',
    progress: 85,
    lastAccessed: '3 days ago',
    instructor: 'Barak',
    color: 'bg-rose-600',
    modules: 8,
    completed: 7,
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=945',
  },
  {
    id: 'ACC101',
    title: 'Financial Accounting',
    program: 'Bachelor of Accounting',
    progress: 100,
    lastAccessed: '1 week ago',
    instructor: 'Dr. Amina',
    color: 'bg-amber-600',
    modules: 6,
    completed: 6,
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=101',
  },
  {
    id: 'BUS206',
    title: 'Management Principles',
    program: 'Bachelor of Business',
    progress: 50,
    lastAccessed: '4 hours ago',
    instructor: 'Dr. Amina',
    color: 'bg-purple-600',
    modules: 9,
    completed: 4,
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=206',
  },
  {
    id: 'ICT932',
    title: 'IT Infrastructure & Networking',
    program: 'Master of Information Technology',
    progress: 20,
    lastAccessed: '2 days ago',
    instructor: 'Mutaz',
    color: 'bg-sky-600',
    modules: 11,
    completed: 2,
    moodleUrl: 'https://moodle.cihe.edu.au/course/view.php?id=932',
  },
];

// Real CIHE program catalogue
const PROGRAMS = [
  {
    name: 'Bachelor of Information Technology',
    level: 'Undergraduate',
    duration: '3 years FT',
    color: 'from-indigo-600 to-blue-700',
    accreditation: 'ACS Accredited',
    accreditationLogo: 'https://www.cihe.edu.au/wp-content/uploads/2023/07/IPA.png',
    specialisations: ['Software Development', 'Cyber Security'],
    url: 'https://www.cihe.edu.au/courses/bachelor-of-information-technology/',
  },
  {
    name: 'Bachelor of Accounting',
    level: 'Undergraduate',
    duration: '3 years FT',
    color: 'from-amber-600 to-orange-600',
    accreditation: 'CA ANZ · CPA · IPA',
    specialisations: ['Financial Accounting', 'Management Accounting', 'Auditing'],
    url: 'https://www.cihe.edu.au/courses/bachelor-accounting/',
  },
  {
    name: 'Bachelor of Business',
    level: 'Undergraduate',
    duration: '3 years FT',
    color: 'from-emerald-600 to-teal-700',
    accreditation: 'TEQSA Approved',
    specialisations: ['Entrepreneurship & Innovation', 'Information Systems', 'Hospitality Management'],
    url: 'https://www.cihe.edu.au/courses/bachelor-of-business/',
  },
  {
    name: 'Master of Information Technology',
    level: 'Postgraduate',
    duration: '2 years FT',
    color: 'from-slate-700 to-slate-900',
    accreditation: 'ACS Accredited',
    specialisations: ['Cybersecurity', 'Software Development'],
    url: 'https://www.cihe.edu.au/courses/master-of-information-technology/',
  },
  {
    name: 'Master of Business Administration (Advanced)',
    level: 'Postgraduate',
    duration: '2 years FT',
    color: 'from-rose-600 to-pink-700',
    accreditation: 'TEQSA Approved',
    specialisations: ['Hospitality Management', 'Project Management', 'Information Systems'],
    url: 'https://www.cihe.edu.au/courses/master-of-business-administration/',
  },
  {
    name: 'Bachelor of Education (Early Childhood)',
    level: 'Undergraduate',
    duration: '4 years FT',
    color: 'from-purple-600 to-violet-700',
    accreditation: 'ACECQA Approved',
    specialisations: ['Birth to Five Years', 'Early Childhood Leadership'],
    url: 'https://www.cihe.edu.au/courses/bachelor-of-education-early-childhood/',
  },
];

export default function Courses() {
  const [selectedUnit, setSelectedUnit] = useState<{ id: string, title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'units' | 'programs'>('units');

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
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Your enrolled units and the full CIHE program catalogue.</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1 self-start">
          {(['units', 'programs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab
                  ? "bg-white dark:bg-slate-700 text-brand-indigo dark:text-indigo-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {tab === 'units' ? 'My Units' : 'Programs'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'units' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-indigo/30 dark:hover:border-indigo-500/30 transition-all flex flex-col shadow-sm"
              >
                <div className={cn("h-32 p-8 relative overflow-hidden", course.color)}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-24 h-24 text-white" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-sm self-start">
                      {course.id}
                    </span>
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-tight">{course.program}</span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-display font-black text-slate-800 dark:text-slate-100 mb-1 group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                    {course.instructor}
                  </p>

                  <div className="space-y-1.5 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress</span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
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
                    <a
                      href={course.moodleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#003B95] dark:hover:bg-indigo-500 transition-all shadow-lg shadow-black/5"
                    >
                      Open in Moodle <ArrowRight className="w-3 h-3" />
                    </a>
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
              { label: 'Lecture Reels', icon: PlayCircle, desc: 'Recorded sessions for Semester 1, 2026.' },
              { label: 'Cloud Resources', icon: Layers, desc: 'SharePoint drives for project collaboration.' },
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
        </>
      )}

      {activeTab === 'programs' && (
        <div className="space-y-8">
          {/* Accreditation strip */}
          <div className="flex flex-wrap items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Accredited By</p>
            {[
              { name: 'CA ANZ', src: 'https://www.cihe.edu.au/wp-content/uploads/2023/07/CAANZ_logo.jpg' },
              { name: 'CPA Australia', src: 'https://www.cihe.edu.au/wp-content/uploads/2023/07/CPA-LOGO.jpg' },
              { name: 'IPA', src: 'https://www.cihe.edu.au/wp-content/uploads/2023/07/IPA.png' },
            ].map(a => (
              <img
                key={a.name}
                src={a.src}
                alt={a.name}
                className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
            <div className="ml-auto flex gap-2">
              {['ACS Accredited', 'ACECQA Approved', 'TEQSA PRV14301'].map(badge => (
                <span key={badge} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMS.map((prog, i) => (
              <motion.a
                key={prog.name}
                href={prog.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-brand-indigo/30 dark:hover:border-indigo-500/30 transition-all shadow-sm flex flex-col"
              >
                <div className={cn("h-28 bg-gradient-to-br p-8 relative overflow-hidden", prog.color)}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="w-24 h-24 text-white" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1.5 bg-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-sm">
                      {prog.level}
                    </span>
                    <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-display font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors">
                      {prog.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {prog.duration}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 flex items-center gap-1">
                        <Award className="w-3 h-3" /> {prog.accreditation}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {prog.specialisations.map(s => (
                      <span key={s} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <p className="text-center text-xs font-bold text-slate-400">
            Intake dates: 20 July &amp; 23 November 2026 &nbsp;·&nbsp; Enquiries: admissions@cihe.edu.au &nbsp;·&nbsp; 1300 171 094
          </p>
        </div>
      )}
    </div>
  );
}
