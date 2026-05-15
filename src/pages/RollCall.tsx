import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Filter, BookOpen, GraduationCap, MapPin, UserCheck, MoreVertical, Download, Mail, Calendar, TrendingUp, TrendingDown, AlertCircle, ChevronDown, ListFilter } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ALL_STUDENTS, TIMETABLE_A, TIMETABLE_B, UNIT_TITLES } from '../lib/timetableData';
import { cn } from '../lib/utils';

export default function RollCall() {
  const { timetableVersion } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('All Units');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const currentTimetable = timetableVersion === 'A' ? TIMETABLE_A : TIMETABLE_B;
  
  // Aggregate data: List of all students with their units
  const students = ALL_STUDENTS.map(id => {
    const data = currentTimetable.find(s => s.id.toUpperCase() === id.toUpperCase());
    const units = data ? [...new Set(data.sessions.map(sess => sess.unitCode))] : [];
    // Mocking some attendance data for visualization
    const attendanceRecord = Math.floor(Math.random() * 40) + 60; // 60% - 100%
    return {
      id,
      name: `Student ${id}`,
      units,
      email: `${id.toLowerCase()}@cihe.edu.au`,
      attendance: attendanceRecord,
      lastSeen: '10:45 AM Today'
    };
  });

  const allUnitsList = ['All Units', ...new Set(students.flatMap(s => s.units))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = selectedUnit === 'All Units' || s.units.includes(selectedUnit);
    return matchesSearch && matchesUnit;
  });

  // Calculate Metrics
  const avgAttendance = Math.round(filteredStudents.reduce((acc, s) => acc + s.attendance, 0) / (filteredStudents.length || 1));
  const absentLevel = 100 - avgAttendance;
  const atRiskCount = filteredStudents.filter(s => s.attendance < 75).length;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#003B95] dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            <Users className="w-3 h-3" />
            Institutional Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tighter">Master Roll Call</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Comprehensive attendance monitoring and registry management.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:border-[#003B95] transition-all"
          >
            <ListFilter className="w-4 h-4" />
            {isFiltersOpen ? 'Hide Controls' : 'Show Controls'}
          </button>
          <button className="px-6 py-3 bg-[#003B95] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-indigo-100 dark:shadow-none">
            <Download className="w-4 h-4" />
            Export Audit
          </button>
        </div>
      </header>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Attendance Level', value: `${avgAttendance}%`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Absence Level', value: `${absentLevel}%`, icon: TrendingDown, color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' },
          { label: 'At Risk Students', value: atRiskCount, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Total Registry', value: filteredStudents.length, icon: GraduationCap, color: 'text-[#003B95] bg-blue-50 dark:bg-indigo-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <p className="text-2xl font-display font-black text-slate-800 dark:text-white leading-none">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Selection / Refinement Area */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Subject Unit</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#003B95] dark:focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      {allUnitsList.map(unit => <option key={unit} value={unit}>{unit === 'All Units' ? 'Select Unit (All Records)' : unit}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Session Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#003B95] transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Global Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Name, ID or Email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#003B95] transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Student Identity</th>
                <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Enrolment Path</th>
                <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Attendance</th>
                <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Engagement</th>
                <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-300 dark:text-slate-700 font-medium">No results match your current institutional filters.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-[#003B95] dark:group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs">
                           {student.id.slice(-2)}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight">{student.name}</div>
                          <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID: {student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                        {student.units.map(unit => (
                          <span key={unit} className="px-2 py-0.5 bg-blue-50 dark:bg-indigo-500/10 text-[#003B95] dark:text-indigo-400 rounded text-[9px] font-black uppercase tracking-wider">
                            {unit}
                          </span>
                        ))}
                        {student.units.length === 0 && <span className="text-[10px] font-medium text-slate-300 dark:text-slate-700 italic">No Enrolments</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            student.attendance >= 90 ? "bg-emerald-500" :
                            student.attendance >= 75 ? "bg-amber-500" : "bg-rose-500"
                          )} />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{student.attendance}% Aggregated</span>
                        </div>
                        <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Last Check: {student.lastSeen}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="w-32 h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.attendance}%` }}
                            className={cn(
                              "h-full rounded-full transition-all",
                              student.attendance >= 90 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                              student.attendance >= 75 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : 
                              "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                            )}
                          />
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                        <a href={`mailto:${student.email}`} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#003B95] dark:hover:text-indigo-400 hover:bg-blue-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all">
                            <Mail className="w-4 h-4" />
                        </a>
                        <button className="p-2.5 text-slate-300 dark:text-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
               {students.slice(0, 5).map(s => (
                 <div key={s.id} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-400">
                   {s.id.slice(-2)}
                 </div>
               ))}
               <div className="w-8 h-8 rounded-full bg-[#003B95] border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center text-[10px] font-black text-white">
                 +{students.length - 5}
               </div>
             </div>
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">
               Displaying Audit Records for Unit Selection: {selectedUnit}
             </p>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 disabled:opacity-30" disabled>Backward</button>
             <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 disabled:opacity-30" disabled>Forward</button>
          </div>
        </div>
      </div>
    </div>
  );
}
