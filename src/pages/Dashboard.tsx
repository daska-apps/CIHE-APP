import React, { useEffect, useState } from 'react';
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
import { Bell, Clock, BookOpen, Mail, MessageSquare, ArrowUpRight, Globe, TrendingUp, Calendar, ChevronRight, ClipboardList, HelpCircle, Search } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const TYPE_DOT: Record<string, string> = {
  urgent: 'bg-rose-500',
  event: 'bg-indigo-400',
  update: 'bg-emerald-400',
  info: 'bg-amber-400',
};

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
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => setAnnouncements(data.slice(0, 4)))
      .catch(() => {});
  }, []);

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
                Semester 1, 2026 • <span className="text-slate-800 dark:text-slate-200">Next intake: 20 Jul</span>
              </div>
           </div>
        </div>
      </header>

      {/* ── Announcements Banner (full width, top priority) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Campus Announcements</h3>
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            </div>
            <button
              onClick={() => navigate('/announcements')}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {announcements.length === 0 ? (
            <p className="text-white/30 text-xs font-bold">No announcements yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="group/item cursor-pointer bg-white/5 hover:bg-white/10 rounded-2xl p-5 transition-all"
                  onClick={() => navigate('/announcements')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", TYPE_DOT[item.type] || 'bg-slate-400')} />
                    <span className="text-[9px] font-black uppercase tracking-wider text-white/30">{item.type}</span>
                    {item.pinned && <span className="ml-auto text-[9px] font-black text-amber-400/60 uppercase tracking-widest">Pinned</span>}
                  </div>
                  <h4 className="font-bold text-sm group-hover/item:text-indigo-300 transition-colors leading-snug">{item.title}</h4>
                  {item.time && <p className="text-[9px] text-white/30 font-bold mt-2 uppercase tracking-widest">{item.time}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />
      </motion.div>

      {/* ── Quick Links Bar ── */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {[
            { id: 'moodle',     name: 'Moodle LMS',    icon: BookOpen,    color: 'text-[#f47b20] bg-orange-50 dark:bg-orange-500/10', href: 'https://moodle.cihe.edu.au' },
            { id: 'outlook',    name: 'Outlook',       icon: Mail,        color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',      href: 'https://outlook.office.com' },
            { id: 'teams',      name: 'Teams',         icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10', href: 'https://teams.microsoft.com' },
            { id: 'meshed',     name: 'Meshed Portal', icon: Globe,       color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10', href: MESHED_PORTAL_BASE_URL },
            { id: 'jira',       name: 'Helpdesk',      icon: HelpCircle,  color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',      href: 'https://cihe.atlassian.net/servicedesk' },
            { id: 'surveys',    name: 'Student Voice', icon: ClipboardList, color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10',   href: 'https://www.surveymonkey.com/r/cihe-student-feedback' },
            { id: 'viva',       name: 'Viva Engage',   icon: MessageSquare, color: 'text-[#0078d4] bg-blue-50 dark:bg-blue-500/10', href: 'https://www.office.com/launch/vivaengage' },
            { id: 'lost-found', name: 'Lost & Found',  icon: Search,      color: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10',  href: '/support#lost-found', local: true },
        ].map((link) => (
            <motion.a
                key={link.id}
                href={link.href}
                onClick={link.local ? (e) => { e.preventDefault(); navigate(link.href); } : undefined}
                target={link.local ? undefined : "_blank"}
                rel={link.local ? undefined : "noopener noreferrer"}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm min-w-[180px] group transition-all hover:border-brand-indigo/30 hover:shadow-xl dark:hover:border-indigo-500/30 flex-shrink-0 cursor-pointer"
            >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", link.color)}>
                    <link.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none mb-1">{link.name}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{link.local ? 'Navigate' : 'Launch'}</p>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-200 dark:text-slate-700 ml-auto group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors" />
            </motion.a>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Hero App Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {heroTiles.slice(0, 4).map((tile, i) => (
              <FeaturedTile
                key={tile.id}
                config={tile}
                index={i}
                className=""
              />
            ))}
          </div>

          {/* Analytics + Today split row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academic Momentum chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col"
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
              <div className="flex-1 min-h-[120px]">
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

            {/* Today's classes (compact) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-indigo dark:text-indigo-400" />
                  Today
                </h3>
                <button onClick={() => navigate('/timetable')} className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 uppercase tracking-widest hover:underline">Full View</button>
              </div>
              <div className="space-y-5 flex-1 overflow-hidden">
                {todaySessions.length > 0 ? todaySessions.slice(0, 3).map((item, i) => {
                  const info = UNIT_TITLES[item.unitCode] || { code: item.unitCode, title: 'Unknown Unit' };
                  return (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="w-1 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-brand-indigo dark:group-hover:bg-indigo-400 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{SLOT_TIMES[item.slot]}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-indigo transition-colors truncate">{info.code}: {info.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold">Room {item.room}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-8 text-center bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Classes Today</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <CourseSnapshot />
          <SurveySection />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
            <Noticeboard />
            <SyncCenter />
        </div>
      </div>
    </div>
  );
}
