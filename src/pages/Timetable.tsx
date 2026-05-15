import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Shield, BookOpen, Sun, CloudSun, SunDim, Moon, LayoutGrid, Table2, Download, CalendarPlus } from 'lucide-react';
import { downloadIcal } from '../lib/calendarExport';
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

type CampusId = 'NSW' | 'ACT' | 'WA';

interface Venue { id: string; name: string; prefix: string | null }

const CAMPUS_VENUES: Record<CampusId, Venue[]> = {
  NSW: [
    { id: 'NSW_ALL',  name: 'NSW>>All Venues',              prefix: null  },
    { id: 'NSW_NS',   name: 'NSW>>North Syd: Main Campus',  prefix: 'NS'  },
    { id: 'NSW_M',    name: 'NSW>>213 Miller:',             prefix: 'M'   },
    { id: 'NSW_P',    name: 'NSW>>307 Pitt S:',             prefix: 'P'   },
    { id: 'NSW_H',    name: 'NSW>>Hurstville:',             prefix: 'H'   },
  ],
  ACT: [
    { id: 'ACT_ALL',  name: 'ACT>>All Venues',              prefix: null  },
    { id: 'ACT_A1',   name: 'ACT>>ACT01: Gungahlin',        prefix: 'A1'  },
    { id: 'ACT_A2',   name: 'ACT>>ACT02: Belconnen',        prefix: 'A2'  },
    { id: 'ACT_A3',   name: 'ACT>>ACT03: Mitchell Campus',  prefix: 'A3'  },
  ],
  WA: [
    { id: 'WA_ALL',   name: 'WA>>All Venues',               prefix: null  },
    { id: 'WA_P',     name: 'WA>>Perth:',                   prefix: 'W'   },
  ],
};

// Which room prefixes belong to each campus (for campus-level filtering)
const CAMPUS_PREFIXES: Record<CampusId, string[]> = {
  NSW: ['M', 'P', 'C', 'H', 'NS'],
  ACT: ['A1', 'A2', 'A3'],
  WA:  ['W'],
};

const CAMPUSES: { id: CampusId; name: string }[] = [
  { id: 'NSW', name: 'NSW Campus' },
  { id: 'ACT', name: 'ACT Campus' },
  { id: 'WA',  name: 'WA Campus'  },
];

const SLOTS = [
  { id: 'm', name: 'Morning',   range: '08:15–11:15', icon: Sun,      gradient: 'from-amber-400 to-orange-400',   bg: 'bg-amber-50 dark:bg-amber-950/30',   text: 'text-amber-600 dark:text-amber-400',   ring: 'ring-amber-200 dark:ring-amber-800'  },
  { id: 'n', name: 'Noon',      range: '11:45–14:45', icon: CloudSun, gradient: 'from-sky-400 to-blue-500',       bg: 'bg-sky-50 dark:bg-sky-950/30',       text: 'text-sky-600 dark:text-sky-400',       ring: 'ring-sky-200 dark:ring-sky-800'      },
  { id: 'a', name: 'Afternoon', range: '15:15–18:15', icon: SunDim,   gradient: 'from-indigo-500 to-violet-500',  bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-200 dark:ring-indigo-800'},
  { id: 'e', name: 'Evening',   range: '18:30–21:30', icon: Moon,     gradient: 'from-slate-700 to-slate-900',    bg: 'bg-slate-100 dark:bg-slate-900/60',  text: 'text-slate-600 dark:text-slate-300',   ring: 'ring-slate-200 dark:ring-slate-700'  },
];

// Colour cards by subject prefix
function unitColor(code: string) {
  if (code.startsWith('ICT') || code.startsWith('GDE')) return { pill: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300', border: 'border-l-indigo-500', dot: 'bg-indigo-500' };
  if (code.startsWith('BUS') || code.startsWith('MGT')) return { pill: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', border: 'border-l-emerald-500', dot: 'bg-emerald-500' };
  if (code.startsWith('ACC') || code.startsWith('FIN')) return { pill: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',   border: 'border-l-amber-500',   dot: 'bg-amber-500'   };
  if (code.startsWith('ECE'))                            return { pill: 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300',       border: 'border-l-pink-500',    dot: 'bg-pink-500'    };
  return                                                        { pill: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',     border: 'border-l-slate-400',   dot: 'bg-slate-400'   };
}

export default function Timetable() {
  const { user, timetableVersion, setTimetableVersion } = useAuthStore();

  const todayIndex = new Date().getDay();
  const defaultDay = todayIndex === 0 || todayIndex === 6 ? 'Monday' : DAY_NAMES[todayIndex - 1];

  const [activeDay, setActiveDay] = React.useState(defaultDay);
  const [viewMode, setViewMode] = React.useState<'personal' | 'master'>(user?.role === 'student' ? 'personal' : 'master');
  const [displayMode, setDisplayMode] = React.useState<'cards' | 'grid'>('cards');
  const [selectedCampus, setSelectedCampus] = React.useState<CampusId>('NSW');
  const [selectedVenue, setSelectedVenue] = React.useState<string>('NSW_ALL');

  const currentTimetable = timetableVersion === 'A' ? TIMETABLE_A : TIMETABLE_B;

  const currentVenues = CAMPUS_VENUES[selectedCampus];

  function handleCampusChange(campus: CampusId) {
    setSelectedCampus(campus);
    setSelectedVenue(CAMPUS_VENUES[campus][0].id); // reset to "All" for new campus
  }

  const sessions = React.useMemo(() => {
    let rawSessions: ClassSession[] = [];
    if (viewMode === 'personal' && user?.role === 'student') {
      const studentData = currentTimetable.find(s => s.id.toUpperCase() === user?.id?.toUpperCase());
      rawSessions = studentData?.sessions || [];
    } else {
      rawSessions = getMasterSchedule(timetableVersion);
    }

    const campusPrefixes = CAMPUS_PREFIXES[selectedCampus];
    const venuePrefix = currentVenues.find(v => v.id === selectedVenue)?.prefix ?? null;

    return rawSessions.filter(s => {
      // First filter by campus (any prefix that matches this campus)
      const inCampus = campusPrefixes.some(p => s.room.startsWith(p));
      if (!inCampus) return false;
      // Then filter by specific venue if one is selected
      if (venuePrefix) return s.room.startsWith(venuePrefix);
      return true;
    });
  }, [viewMode, user?.id, user?.role, currentTimetable, timetableVersion, selectedCampus, selectedVenue, currentVenues]);

  const isStaff = ['staff', 'lecturer', 'admin', 'global_admin'].includes(user?.role || '');

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#003B95] dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <Calendar className="w-3 h-3" />
            {viewMode === 'master' ? 'Institutional Master Schedule' : 'Academic Timetable'}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tighter">
            {viewMode === 'master' ? 'Full Schedule' : 'Your Schedule'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
             {isStaff && (
               <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                 <button
                  onClick={() => setViewMode('personal')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === 'personal'
                      ? "bg-white dark:bg-slate-700 text-[#003B95] dark:text-indigo-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                 >
                  Personal
                 </button>
                 <button
                  onClick={() => setViewMode('master')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === 'master'
                      ? "bg-white dark:bg-slate-700 text-[#003B95] dark:text-indigo-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                 >
                  Master
                 </button>
               </div>
             )}

             {viewMode === 'master' && (
               <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={selectedCampus}
                    onChange={(e) => handleCampusChange(e.target.value as CampusId)}
                    className="bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-black text-slate-600 focus:outline-none focus:border-[#003B95]/30 shadow-sm"
                  >
                    {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-black text-slate-600 focus:outline-none focus:border-[#003B95]/30 shadow-sm min-w-[220px]"
                  >
                    {currentVenues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <button
              onClick={() => setTimetableVersion('A')}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                timetableVersion === 'A' ? "bg-[#003B95] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
             >
               Trimester 1
             </button>
             <button
              onClick={() => setTimetableVersion('B')}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                timetableVersion === 'B' ? "bg-[#003B95] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
             >
               Trimester 2
             </button>
           </div>

           <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
            <span className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 whitespace-nowrap">Current Week</span>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
          </div>

          {/* Export to calendar */}
          <button
            onClick={() => downloadIcal(sessions)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-brand-indigo dark:hover:border-indigo-500 hover:text-brand-indigo dark:hover:text-indigo-400 transition-all shadow-sm"
            title="Download as .ics file — works with Apple Calendar, Google Calendar, Outlook"
          >
            <CalendarPlus className="w-4 h-4" />
            Sync Calendar
          </button>

          {/* Display mode toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setDisplayMode('cards')}
              className={cn("p-2 rounded-xl transition-all", displayMode === 'cards' ? "bg-brand-indigo text-white shadow" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}
              title="Card view"
            ><LayoutGrid className="w-4 h-4" /></button>
            <button
              onClick={() => setDisplayMode('grid')}
              className={cn("p-2 rounded-xl transition-all", displayMode === 'grid' ? "bg-brand-indigo text-white shadow" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}
              title="Room grid view"
            ><Table2 className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Day Selector */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 pt-2">
        {DAY_NAMES.map((day, i) => {
          const isToday = day === defaultDay;
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-8 py-4 rounded-[1.5rem] transition-all whitespace-nowrap border-2 shadow-sm min-w-[100px]",
                isActive
                  ? "bg-brand-indigo border-brand-indigo text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/30"
                  : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-brand-indigo/30 dark:hover:border-indigo-500/30"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{day.slice(0, 3)}</span>
              {isToday && (
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                  isActive ? "bg-white/20 text-white" : "bg-brand-indigo/10 text-brand-indigo dark:bg-indigo-500/20 dark:text-indigo-400"
                )}>Today</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Card View ── */}
      {displayMode === 'cards' && <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {SLOTS.map((slot) => {
          const dayCode = DAYS_MAP[activeDay];
          const slotSessions = sessions.filter(s => s.day === dayCode && s.slot === slot.id);

          return (
            <div key={slot.id} className="flex flex-col gap-4">
              {/* Slot Header */}
              <div className={cn("rounded-[2rem] p-5 flex items-center justify-between", slot.bg)}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-md text-white", slot.gradient)}>
                    <slot.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-0.5", slot.text)}>{slot.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tabular-nums">{slot.range}</p>
                  </div>
                </div>
                <span className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black ring-2",
                  slotSessions.length > 0 ? cn(slot.text, slot.ring, "bg-white dark:bg-slate-900") : "text-slate-300 dark:text-slate-700 ring-slate-100 dark:ring-slate-800 bg-white dark:bg-slate-900"
                )}>{slotSessions.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {slotSessions.length > 0 ? slotSessions.map((item, i) => {
                  const info = UNIT_TITLES[item.unitCode] || { code: item.unitCode, title: 'Unknown Unit', tutor: 'Unknown Staff' };
                  const colors = unitColor(item.unitCode);
                  const campus =
                    item.room.startsWith('A1') ? 'ACT01 Gungahlin' :
                    item.room.startsWith('A2') ? 'ACT02 Belconnen' :
                    item.room.startsWith('A3') ? 'ACT03 Mitchell' :
                    item.room.startsWith('W')  ? 'WA Perth' :
                    item.room.startsWith('P')  ? '307 Pitt St' :
                    item.room.startsWith('H')  ? 'Hurstville' :
                    item.room.startsWith('NS') ? 'North Syd' :
                    'Miller St';

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -3, scale: 1.015 }}
                      className={cn(
                        "p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-l-[6px] shadow-sm relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg",
                        colors.border
                      )}
                    >
                      {/* Unit code pill + room */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={cn("px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg", colors.pill)}>
                          {info.code}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="text-slate-600 dark:text-slate-300 font-black">{item.room}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h5 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-snug mb-3">
                        {info.title}
                      </h5>

                      {/* Footer row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[90px]">{info.tutor}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500">{campus}</span>
                      </div>

                      {/* Colour dot accent */}
                      <div className={cn("absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-40", colors.dot)} />
                    </motion.div>
                  );
                }) : (
                  <div className="h-32 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-200 dark:text-slate-800">
                    <Clock className="w-6 h-6" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Free</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>}

      {/* ── Room Grid View ── */}
      {displayMode === 'grid' && (() => {
        const dayCode = DAYS_MAP[activeDay];
        const daySessions = sessions.filter(s => s.day === dayCode);
        const rooms = [...new Set(daySessions.map(s => s.room))].sort();

        const campusLabel = (room: string) =>
          room.startsWith('A1') ? 'ACT01' :
          room.startsWith('A2') ? 'ACT02' :
          room.startsWith('A3') ? 'ACT03' :
          room.startsWith('W')  ? 'Perth'  :
          room.startsWith('P')  ? 'Pitt St' :
          room.startsWith('H')  ? 'Hurstville' :
          room.startsWith('NS') ? 'N.Syd' :
          'Miller St';

        if (rooms.length === 0) return (
          <div className="py-20 text-center text-slate-300 dark:text-slate-700">
            <Table2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-[10px] font-black uppercase tracking-widest">No sessions on {activeDay}</p>
          </div>
        );

        return (
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-36 min-w-[144px] bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-100 dark:border-slate-800 px-5 py-4 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Time Slot</span>
                  </th>
                  {rooms.map(room => (
                    <th key={room} className="min-w-[200px] bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-100 dark:border-slate-800 px-5 py-4 text-left last:border-r-0">
                      <p className="text-sm font-black text-slate-800 dark:text-white">{room}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{campusLabel(room)}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map((slot, si) => (
                  <tr key={slot.id} className={cn("border-b border-slate-100 dark:border-slate-800 last:border-b-0", si % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-900/30')}>
                    {/* Time label */}
                    <td className="border-r border-slate-100 dark:border-slate-800 px-5 py-5 align-top">
                      <div className={cn("flex items-center gap-2 mb-1", slot.text)}>
                        <slot.icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{slot.name}</span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 tabular-nums">{slot.range}</p>
                    </td>
                    {/* Room cells */}
                    {rooms.map(room => {
                      const session = daySessions.find(s => s.slot === slot.id && s.room === room);
                      const info = session ? (UNIT_TITLES[session.unitCode] || { code: session.unitCode, title: 'Unknown Unit', tutor: 'Unknown Staff' }) : null;
                      const colors = session ? unitColor(session.unitCode) : null;
                      return (
                        <td key={room} className="border-r border-slate-100 dark:border-slate-800 last:border-r-0 px-4 py-4 align-top">
                          {session && info && colors ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={cn("rounded-2xl p-4 border-l-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-full", colors.border)}
                            >
                              <span className={cn("inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-lg mb-2", colors.pill)}>
                                {info.code}
                              </span>
                              <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug mb-3">{info.title}</p>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{info.tutor}</span>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="h-full min-h-[60px] rounded-2xl border border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-slate-200 dark:text-slate-800">—</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

      {sessions.length === 0 && viewMode === 'personal' && user?.role === 'student' && (
        <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-white dark:bg-slate-900 text-center space-y-4">
          <Shield className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto" />
          <div className="space-y-1">
             <h3 className="text-xl font-display font-black text-slate-800 dark:text-white">No Timetable Found</h3>
             <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">We couldn't find a personalized schedule for your ID. You might need to contact student services or log in with a valid Student ID alias.</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-left">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Try these Aliases</span>
               <div className="flex gap-2">
                 <code className="bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs font-bold border border-slate-200 dark:border-slate-700 tracking-tight dark:text-slate-200">CIHE21351</code>
                 <code className="bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs font-bold border border-slate-200 dark:border-slate-700 tracking-tight dark:text-slate-200">CIHE21544</code>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="pt-8 flex flex-wrap items-center gap-6 border-t border-slate-100 dark:border-slate-800">
        {[
          { dot: 'bg-indigo-500', label: 'ICT / GDE' },
          { dot: 'bg-emerald-500', label: 'Business / MGT' },
          { dot: 'bg-amber-500',  label: 'Accounting / Finance' },
          { dot: 'bg-pink-500',   label: 'Early Childhood' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-full", l.dot)} />
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{l.label}</span>
          </div>
        ))}
        <p className="text-[9px] font-medium text-slate-400 ml-auto italic">
          * Schedules subject to change. Verify with Meshed Portal.
        </p>
      </div>
    </div>
  );
}
