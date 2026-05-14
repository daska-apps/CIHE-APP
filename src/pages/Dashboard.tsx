import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { TILES, MESHED_PORTAL_BASE_URL } from '../lib/constants';
import { TIMETABLE_A, TIMETABLE_B, UNIT_TITLES, Day, getMasterSchedule } from '../lib/timetableData';
import FeaturedTile from '../components/home/FeaturedTile';
import Noticeboard from '../components/home/Noticeboard';
import VivaEngage from '../components/home/VivaEngage';
import CourseSnapshot from '../components/home/CourseSnapshot';
import SurveySection from '../components/home/SurveySection';
import SyncCenter from '../components/home/SyncCenter';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Sparkles, Bell, Clock, MapPin, BookOpen, Mail, MessageSquare, Files, ArrowUpRight, Globe, TrendingUp, Calendar, ChevronRight, ClipboardList, HelpCircle, Search } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'W1', value: 65 },
  { name: 'W2', value: 72 },
  { name: 'W3', value: 68 },
  { name: 'W4', value: 85 },
];

const SLOT_TIMES: Record<string, string> = {
  m: '08:15 - 11:15',
  n: '11:45 - 14:45',
  a: '15:15 - 18:15',
  e: '18:30 - 21:30',
};

const DAY_CODES: Record<number, Day> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Fri', // Sat -> Fri for mock
  0: 'Mon', // Sun -> Mon for mock
};

export default function Dashboard() {
  const { user, timetableVersion } = useAuthStore();
  const navigate = useNavigate();
  
  if (!user) return null;

  const currentTimetable = timetableVersion === 'A' ? TIMETABLE_A : TIMETABLE_B;
  const studentData = currentTimetable.find(s => s.id === user.id);
  
  // Get today's sessions
  const today = new Date().getDay();
  const dayCode = DAY_CODES[today] || 'Mon';
  
  const isStaff = ['staff', 'lecturer', 'admin', 'global_admin'].includes(user.role);
  
  const todaySessions = React.useMemo(() => {
    if (isStaff) {
      // Show master schedule for today
      return getMasterSchedule(timetableVersion).filter(s => s.day === dayCode).slice(0, 5);
    }
    return studentData?.sessions.filter(s => s.day === dayCode) || [];
  }, [isStaff, timetableVersion, dayCode, studentData]);

  const tiles = TILES[user.role] || [];
  const roleDisplay = user.role.replace('_', ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  // Strategic slice for Bento Grid
  const heroTiles = tiles.filter(t => ['moodle', 'outlook', 'teams', 'moodle_admin', 'attendance'].includes(t.id));
  const otherTiles = tiles.filter(t => !heroTiles.find(h => h.id === t.id));

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-brand-indigo dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest"
          >
            <div className="w-1.5 h-1.5 bg-brand-indigo dark:bg-indigo-400 rounded-full animate-pulse" />
            {roleDisplay} Active Environment
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight"
          >
            Welcome, {user.name.split(' ')[0]}
          </motion.h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
              <Clock className="w-4 h-4 text-brand-indigo dark:text-indigo-400" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Week 4 • <span className="text-slate-800 dark:text-slate-200">Census Period</span>
              </div>
           </div>
        </div>
      </header>

      {/* Quick Links Bar */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {[
            { id: 'moodle', name: 'Moodle LMS', icon: BookOpen, color: 'text-[#f47b20] bg-orange-50 dark:bg-orange-500/10', href: 'https://moodle.cihe.edu.au' },
            { id: 'meshed', name: 'Meshed Portal', icon: Globe, color: 'text-[#f47b20] bg-orange-50 dark:bg-orange-500/10', href: MESHED_PORTAL_BASE_URL },
            { id: 'jira', name: 'Helpdesk (Jira)', icon: HelpCircle, color: 'text-[#f47b20] bg-orange-50 dark:bg-orange-500/10', href: 'https://cihe.atlassian.net/servicedesk' },
            { id: 'surveys', name: 'Student Voice', icon: ClipboardList, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10', href: 'https://www.surveymonkey.com/r/cihe-student-feedback' },
            { id: 'viva', name: 'Viva Engage', icon: MessageSquare, color: 'text-[#0078d4] bg-blue-50 dark:bg-blue-500/10', href: 'https://www.office.com/launch/vivaengage' },
            { id: 'lost-found', name: 'Lost & Found', icon: Search, color: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10', href: '/support#lost-found', local: true },
            { id: 'outlook', name: 'Outlook', icon: Mail, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10', href: 'https://outlook.office.com' },
            { id: 'teams', name: 'Teams', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10', href: 'https://teams.microsoft.com' },
        ].map((link) => (
            <motion.a
                key={link.id}
                href={link.href}
                onClick={link.local ? (e) => { e.preventDefault(); navigate(link.href); } : undefined}
                target={link.local ? undefined : "_blank"}
                rel={link.local ? undefined : "noopener noreferrer"}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm min-w-[200px] group transition-all hover:border-brand-indigo/30 hover:shadow-xl dark:hover:border-indigo-500/30",
                    "flex-shrink-0 cursor-pointer"
                )}
            >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", link.color)}>
                    <link.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none mb-1">{link.name}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{link.local ? 'Navigate' : 'Launch'}</p>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-200 dark:text-slate-700 ml-auto group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors" />
            </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Primary Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 auto-rows-[220px] gap-8">
            
            {/* Campus Feed (Tall) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01 }}
              className="md:col-span-2 lg:col-span-3 row-span-2 bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl flex flex-col relative overflow-hidden group"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Campus Feed</h3>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-8 flex-1">
                  {[
                    { type: 'Urgent', title: 'Moodle Maintenance', time: 'Tonight 10PM', color: 'bg-amber-400' },
                    { type: 'Event', title: 'CIHE Career Fair', time: 'Tomorrow 11AM', color: 'bg-indigo-400' },
                    { type: 'Update', title: 'New Level 4 Lounge', time: 'Just Launched', color: 'bg-emerald-400' }
                  ].map((item, i) => (
                    <div key={i} className="group/item cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", item.color)} />
                          <span className="text-[10px] font-black uppercase tracking-wider text-white/30">{item.type}</span>
                      </div>
                      <h4 className="font-bold text-base group-hover/item:text-brand-indigo transition-colors leading-tight">{item.title}</h4>
                      <p className="text-[10px] text-white/40 font-bold mt-1 uppercase tracking-widest">{item.time}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Broadcast Archive
                </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
            </motion.div>

            {/* AI Assistant (Wide) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01 }}
              className="md:col-span-4 lg:col-span-5 row-span-1 bg-brand-indigo rounded-[3.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-100" />
                  <h3 className="text-white font-black tracking-tight text-2xl uppercase">Intelligence</h3>
                </div>
                <p className="text-indigo-100/90 text-sm mb-6 leading-relaxed font-bold">
                  "Hi {user.name.split(' ')[0]}, portal systems are optimal. I've prepared your attendance summary for the week."
                </p>
                <div className="flex items-center gap-3">
                   <button className="px-8 py-4 bg-white text-brand-indigo text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95">
                       Open Assistant
                   </button>
                   <div className="px-4 py-4 text-white/40 text-[9px] font-black uppercase tracking-widest border border-white/10 rounded-2xl">
                      v2.4.0 Live
                   </div>
                </div>
              </div>
              <div className="shrink-0 relative hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/10 backdrop-blur-md group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Analytics Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01 }}
              className="md:col-span-4 lg:col-span-5 row-span-1 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm flex flex-col relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Academic Momentum</p>
                  <h4 className="font-black text-slate-800 dark:text-white text-xl">Daily Engagement</h4>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 min-h-[140px] h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Service Grid Slices */}
            {heroTiles.slice(0, 4).map((tile, i) => (
              <FeaturedTile 
                key={tile.id} 
                config={tile} 
                index={i} 
                className="md:col-span-1 lg:col-span-2 row-span-1"
              />
            ))}
          </div>

          <CourseSnapshot />
          <SurveySection />
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               whileHover={{ y: -4 }}
               className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-indigo dark:text-indigo-400" />
                        Today's Agenda
                    </h3>
                    <button className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 uppercase tracking-widest hover:underline">Full View</button>
                </div>
                <div className="space-y-8">
                    {todaySessions.length > 0 ? todaySessions.map((item, i) => {
                        const info = UNIT_TITLES[item.unitCode] || { code: item.unitCode, title: 'Unknown Unit' };
                        return (
                            <div key={i} className="flex gap-6 group cursor-pointer">
                                <div className="w-1.5 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-brand-indigo dark:group-hover:bg-indigo-400 transition-colors" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{SLOT_TIMES[item.slot]}</span>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            i === 0 ? "text-brand-indigo dark:text-indigo-400" : "text-slate-300"
                                        )}>
                                            {i === 0 ? 'Upcoming' : 'Scheduled'}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors">{info.code}: {info.title}</h4>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Room {item.room} • {item.room.startsWith('M') ? 'Miller St' : item.room.startsWith('P') ? 'Pitt St' : 'Civic Center'}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="py-12 text-center bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">No Classes Today</p>
                             <p className="text-[9px] font-medium text-slate-300">Enjoy your free time!</p>
                        </div>
                    )}
                    {user.role === 'global_admin' && (
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Health</span>
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             </div>
                             <div className="flex justify-between items-end">
                                <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">99.9%</span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Optimal State</span>
                             </div>
                        </div>
                    )}
                </div>
            </motion.div>

            <Noticeboard />

            <SyncCenter />
        </div>
      </div>
    </div>
  );
}
