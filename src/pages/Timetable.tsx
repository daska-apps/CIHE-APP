import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter, Shield, BookOpen, Sun, CloudSun, SunDim, Moon, ArrowLeftRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';
import { TIMETABLE_A, TIMETABLE_B, UNIT_TITLES, Day, SlotId, getMasterSchedule, type ClassSession } from '../lib/timetableData';

const DAYS_MAP: Record<string, string> = {
  'Monday': 'Mon',
  'Tuesday': 'Tue',
  'Wednesday': 'Wed',
  'Thursday': 'Thu',
  'Friday': 'Fri'
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CAMPUSES = [
  { id: 'NSW', name: 'NSW Campus' },
  { id: 'ACT', name: 'ACT Campus' },
  { id: 'WA', name: 'WA Campus' }
];

const VENUES = [
  { id: 'MILLER', name: 'Miller St' },
  { id: 'PITT', name: 'Pitt St' },
  { id: 'CIVIC', name: 'Civic Center' }
];

const SLOTS = [
  { id: 'm', name: 'Morning', range: '08:15 - 11:15', icon: Sun },
  { id: 'n', name: 'Noon', range: '11:45 - 14:45', icon: CloudSun },
  { id: 'a', name: 'Afternoon', range: '15:15 - 18:15', icon: SunDim },
  { id: 'e', name: 'Evening', range: '18:30 - 21:30', icon: Moon }
];

export default function Timetable() {
  const { user, timetableVersion, setTimetableVersion } = useAuthStore();
  
  // Get current day, default to Monday if weekend
  const todayIndex = new Date().getDay();
  const defaultDay = todayIndex === 0 || todayIndex === 6 ? 'Monday' : DAY_NAMES[todayIndex - 1];
  
  const [activeDay, setActiveDay] = React.useState(defaultDay);
  const [viewMode, setViewMode] = React.useState<'personal' | 'master'>(user?.role === 'student' ? 'personal' : 'master');
  const [selectedCampus, setSelectedCampus] = React.useState('NSW');
  const [selectedVenue, setSelectedVenue] = React.useState('MILLER');

  const currentTimetable = timetableVersion === 'A' ? TIMETABLE_A : TIMETABLE_B;
  
  // Logical filtering
  const sessions = React.useMemo(() => {
    let rawSessions: ClassSession[] = [];
    if (viewMode === 'personal' && user?.role === 'student') {
      const studentData = currentTimetable.find(s => s.id.toUpperCase() === user?.id?.toUpperCase());
      rawSessions = studentData?.sessions || [];
    } else {
      rawSessions = getMasterSchedule(timetableVersion);
    }

    // Filter by Venue Room Prefix
    return rawSessions.filter(s => {
      if (selectedVenue === 'MILLER') return s.room.startsWith('M');
      if (selectedVenue === 'PITT') return s.room.startsWith('P');
      if (selectedVenue === 'CIVIC') return s.room.startsWith('C');
      return true;
    });
  }, [viewMode, user?.id, user?.role, currentTimetable, timetableVersion, selectedVenue]);

  const isStaff = ['staff', 'lecturer', 'admin', 'global_admin'].includes(user?.role || '');

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#003B95] font-black text-[10px] uppercase tracking-[0.2em]">
            <Calendar className="w-3 h-3" />
            {viewMode === 'master' ? 'Institutional Master Schedule' : 'Academic Timetable'}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tighter">
            {viewMode === 'master' ? 'Full Schedule' : 'Your Schedule'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
             {isStaff && (
               <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                 <button 
                  onClick={() => setViewMode('personal')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === 'personal' ? "bg-white text-[#003B95] shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                 >
                  Personal
                 </button>
                 <button 
                  onClick={() => setViewMode('master')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === 'master' ? "bg-white text-[#003B95] shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                 >
                  Master
                 </button>
               </div>
             )}
             
             {viewMode === 'master' && (
               <div className="flex items-center gap-3">
                  <select 
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-slate-600 focus:outline-none focus:border-[#003B95]/30 shadow-sm uppercase tracking-widest"
                  >
                    {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select 
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-slate-600 focus:outline-none focus:border-[#003B95]/30 shadow-sm uppercase tracking-widest"
                  >
                    {VENUES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           {/* Timetable Version Switcher */}
           <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             <button 
              onClick={() => setTimetableVersion('A')}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                timetableVersion === 'A' ? "bg-[#003B95] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              )}
             >
               Trimester 1
             </button>
             <button 
              onClick={() => setTimetableVersion('B')}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                timetableVersion === 'B' ? "bg-[#003B95] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              )}
             >
               Trimester 2
             </button>
           </div>

           <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
            <span className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-800 whitespace-nowrap">Current Week</span>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>
      </header>

      {/* Modern Day Selector */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 pt-2">
        {DAY_NAMES.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 shadow-sm",
              activeDay === day 
                ? "bg-brand-indigo border-brand-indigo text-white shadow-xl shadow-indigo-100" 
                : "bg-white text-slate-400 border-slate-100 hover:border-brand-indigo/30"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {SLOTS.map((slot, index) => {
          const dayCode = DAYS_MAP[activeDay];
          const slotSessions = sessions.filter(s => s.day === dayCode && s.slot === slot.id);
          
          const slotColors = [
            'bg-amber-50/50 dark:bg-amber-500/5',
            'bg-blue-50/50 dark:bg-blue-500/5',
            'bg-indigo-50/50 dark:bg-indigo-500/5',
            'bg-violet-50/50 dark:bg-violet-500/5'
          ];

          const borderColors = [
            'border-l-amber-500',
            'border-l-blue-500',
            'border-l-indigo-500',
            'border-l-violet-500'
          ];
          
          return (
            <div 
              key={slot.id} 
              className={cn(
                "space-y-4 p-5 rounded-[3rem] transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800",
                slotColors[index % slotColors.length]
              )}
            >
              <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-md",
                        index % 4 === 0 ? "bg-amber-100 text-amber-600" :
                        index % 4 === 1 ? "bg-blue-100 text-blue-600" :
                        index % 4 === 2 ? "bg-indigo-100 text-indigo-600" :
                        "bg-violet-100 text-violet-600"
                      )}>
                          <slot.icon className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] leading-none mb-1">{slot.name}</h4>
                          <p className="text-[9px] font-bold text-slate-400">{slot.range}</p>
                      </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 bg-white dark:bg-slate-900 w-6 h-6 rounded-lg flex items-center justify-center shadow-sm">{slotSessions.length}</span>
              </div>

              <div className="space-y-4">
                  {slotSessions.length > 0 ? slotSessions.map((item, i) => {
                    const info = UNIT_TITLES[item.unitCode] || { code: item.unitCode, title: 'Unknown Unit', tutor: 'Unknown Staff' };
                    return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className={cn(
                            "p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-l-[12px] shadow-sm relative overflow-hidden group transition-all",
                            borderColors[index % borderColors.length]
                          )}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={cn(
                                  "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded transition-colors",
                                  viewMode === 'master' ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-[#003B95] group-hover:text-white"
                                )}>
                                    {viewMode === 'master' ? 'INSTITUTIONAL' : 'PERSONAL'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">{info.code}</span>
                                </div>
                            </div>
                            
                            <h5 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2 leading-tight">
                                {info.title}
                            </h5>

                            <div className="space-y-2 mt-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                    <MapPin className="w-3.5 h-3.5 text-[#003B95] dark:text-indigo-400" /> 
                                    <span className="text-slate-800 dark:text-slate-200">{item.room}</span> • {selectedCampus} CIHE
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                    <User className="w-3.5 h-3.5" /> {info.tutor}
                                </div>
                            </div>

                          {/* Decoration */}
                          <div className="absolute -bottom-4 -right-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
                              <BookOpen className="w-24 h-24" />
                          </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="aspect-[4/5] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center text-slate-300 dark:text-slate-700">
                        <Clock className="w-8 h-8 mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest leading-tight">No Sessions</p>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length === 0 && viewMode === 'personal' && user?.role === 'student' && (
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white text-center space-y-4">
          <Shield className="w-12 h-12 text-slate-200 mx-auto" />
          <div className="space-y-1">
             <h3 className="text-xl font-display font-black text-slate-800">No Timetable Found</h3>
             <p className="text-slate-500 font-medium max-w-md mx-auto">We couldn't find a personalized schedule for your ID. You might need to contact student services or log in with a valid Student ID alias.</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
             <div className="p-4 bg-slate-50 rounded-2xl text-left">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Try these Aliases</span>
               <div className="flex gap-2">
                 <code className="bg-white px-2 py-1 rounded text-xs font-bold border border-slate-200 tracking-tight">CIHE21351</code>
                 <code className="bg-white px-2 py-1 rounded text-xs font-bold border border-slate-200 tracking-tight">CIHE21544</code>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="pt-8 flex flex-wrap gap-8 border-t border-slate-50">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand-indigo rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Session</span>
              </div>
          </div>
          <p className="text-[10px] font-medium text-slate-400 ml-auto italic">
            * Schedules are subject to change. Please verify with Meshed Portal for official confirmation.
          </p>
      </div>
    </div>
  );
}
