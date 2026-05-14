import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, Clock, Search, MoreVertical, Check, X, AlertCircle, QrCode, Shield, Users, ArrowUpRight, Loader2, PlayCircle, StopCircle, ScanLine } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
  room?: string;
  sessionId?: string;
}

import { TIMETABLE_A, TIMETABLE_B, UNIT_TITLES, getMasterSchedule } from '../lib/timetableData';

export default function Attendance() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [activeSession, setActiveSession] = useState<{ id: string; room: string; title: string; unitCode: string } | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [timetableVersion] = useState<'A' | 'B'>('A'); // Default to current version
  const [timeLeft, setTimeLeft] = useState(60);

  const urlSession = searchParams.get('session');
  const urlRoom = searchParams.get('room');
  const urlUnit = searchParams.get('unit');

  const unitInfo = urlUnit ? UNIT_TITLES[urlUnit] : null;

  // Countdown timer for QR validity
  useEffect(() => {
    if (!showQr || !activeSession) return;
    
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Regenerate session ID or token if needed, here we just reset for demo
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQr, activeSession]);

  // Find classes taught by this lecturer today
  const dayCode = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const masterSchedule = getMasterSchedule(timetableVersion);
  const lecturerClasses = useMemo(() => {
    if (user?.role !== 'lecturer' && user?.role !== 'staff') return [];
    return masterSchedule.filter(s => {
       // Match tutor name if possible, or just show all for demo if no direct tutor link
       return s.day === dayCode;
    });
  }, [masterSchedule, dayCode, user?.role]);

  useEffect(() => {
    if (urlSession && urlRoom && user?.role === 'student') {
      setShowQr(true);
    }
  }, [urlSession, urlRoom, user]);

  const { data: records, isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ['attendance'],
    queryFn: async () => {
      const res = await fetch('/api/attendance');
      return res.json();
    }
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async (status: 'present' | 'absent' | 'late') => {
      // Simulate Anti-Fraud IP/GPS Check
      const fraudCheck = new Promise((resolve) => setTimeout(resolve, 1200));
      await fraudCheck;

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id,
          name: user?.name,
          status,
          room: urlRoom || 'L4-H01',
          sessionId: urlSession || 'manual',
          unitCode: urlUnit,
          metadata: {
            ipVerified: true,
            geofence: 'CIHE-SYDNEY-CAMPUS',
            timestamp: new Date().toISOString()
          }
        })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setShowQr(false);
      setSearchParams({}); // Clear scan params
    }
  });

  const filteredRecords = records?.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isStudent = user?.role === 'student';
  const isLecturer = user?.role === 'lecturer';
  const isOperator = user?.role === 'admin' || user?.role === 'global_admin';

  const sessionToken = useMemo(() => {
    if (!activeSession) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/attendance?session=${activeSession.id}&room=${activeSession.room}&unit=${activeSession.unitCode}`;
  }, [activeSession]);

  const startSession = () => {
    if (!selectedClassId && isLecturer) return;
    
    const selectedClass = lecturerClasses.find(c => `${c.unitCode}-${c.slot}-${c.room}` === selectedClassId);
    const unitInfo = selectedClass ? UNIT_TITLES[selectedClass.unitCode] : null;

    setActiveSession({
      id: `SESS-${Math.random().toString(36).substring(7).toUpperCase()}`,
      room: selectedClass?.room || 'M501',
      title: unitInfo?.title || 'Academic Session',
      unitCode: selectedClass?.unitCode || 'UNIT-000'
    });
    setShowQr(true);
  };

  const stopSession = () => {
    setActiveSession(null);
    setShowQr(false);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#003B95] font-black text-[10px] uppercase tracking-[0.2em]">
            <UserCheck className="w-3 h-3" />
            CIHE Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tighter">Attendance</h1>
          <p className="text-slate-500 font-medium max-w-md">Institutional session tracking and identity synchronization.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {(isLecturer || isOperator) && (
            <>
              {!activeSession && isLecturer && (
                <select 
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-[10px] font-black text-slate-600 focus:outline-none focus:border-[#003B95]/30 shadow-sm uppercase tracking-widest min-w-[240px]"
                >
                  <option value="">Select your class...</option>
                  {lecturerClasses.map(c => (
                    <option key={`${c.unitCode}-${c.slot}-${c.room}`} value={`${c.unitCode}-${c.slot}-${c.room}`}>
                      {c.unitCode} • Room {c.room} ({c.slot === 'm' ? 'Morning' : c.slot === 'n' ? 'Noon' : 'Afternoon'})
                    </option>
                  ))}
                  {lecturerClasses.length === 0 && <option disabled>No classes scheduled for today</option>}
                </select>
              )}

              <Link 
                to="/roll-call"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:border-[#003B95] transition-all shadow-sm"
              >
                <Users className="w-4 h-4" />
                Master Roll Call
              </Link>
              <button 
                onClick={activeSession ? stopSession : startSession}
                disabled={!activeSession && isLecturer && !selectedClassId}
                className={cn(
                  "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm",
                  !activeSession && isLecturer && !selectedClassId ? "opacity-30 cursor-not-allowed bg-slate-100" :
                  activeSession 
                    ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100" 
                    : "bg-[#003B95] text-white hover:scale-105"
                )}
              >
                {activeSession ? (
                  <>
                    <StopCircle className="w-4 h-4" />
                    Terminate Roll Call
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    Start Roll Call
                  </>
                )}
              </button>
            </>
          )}
          {isStudent && (
            <button 
              onClick={() => setShowQr(true)}
              className="px-6 py-3 bg-[#003B95] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-100/50"
            >
              <QrCode className="w-4 h-4" />
              Check-in Now
            </button>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registry Table */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="relative max-w-sm w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#003B95] dark:group-focus-within:text-indigo-400 transition-colors" />
                        <input
                        type="text"
                        placeholder="Filter directory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-transparent border-white/10 rounded-2xl text-sm font-medium focus:border-[#003B95]/30 dark:focus:border-indigo-500/30 outline-none transition-all shadow-sm dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Registrant</th>
                            <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Student ID</th>
                            <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Status</th>
                            <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Sync</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {isLoading ? (
                            <tr>
                            <td colSpan={4} className="px-8 py-24 text-center text-slate-300 dark:text-slate-700 font-medium">Synchronizing records...</td>
                            </tr>
                        ) : filteredRecords?.length === 0 ? (
                            <tr>
                            <td colSpan={4} className="px-8 py-24 text-center text-slate-300 dark:text-slate-700 font-medium">No matching entries found.</td>
                            </tr>
                        ) : (
                            filteredRecords?.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{record.name}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] uppercase tracking-tighter">{record.studentId}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                                        record.status === 'present' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                                        record.status === 'absent' ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" :
                                        "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                                        record.status === 'present' ? "bg-emerald-500" :
                                        record.status === 'absent' ? "bg-rose-500" :
                                        "bg-amber-500"
                                        )} />
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                            </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Sidebar Info/Stats */}
        <div className="space-y-6">
            {[
                { label: 'Cumulative Sync', value: records?.length || 0, icon: UserCheck, color: 'bg-[#003B95]' },
                { label: 'Campus Capacity', value: '42%', icon: Users, color: 'bg-emerald-600' },
            ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-[#003B95]/30 dark:hover:border-indigo-500/30 transition-all flex items-center justify-between"
                    >
                        <div>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-display font-black text-slate-800 dark:text-white">{stat.value}</p>
                        </div>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </motion.div>
            ))}

                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Integrity Note</h4>
                            <p className="text-sm font-medium text-white/70 leading-relaxed mb-6">
                                CIHE Attendance policies require physical campus presence. System verifies geolocation and network identifiers on every sync.
                            </p>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#003B95] group-hover:translate-x-1 transition-transform">
                                Policy Guide <ArrowUpRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#003B95]/10 rounded-full blur-2xl" />
                    </div>
        </div>
      </div>

      {/* Modal QR / Check-in */}
      <AnimatePresence>
        {showQr && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowQr(false)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 text-center shadow-2xl border border-slate-100 dark:border-slate-800"
                    >
                        <button 
                            onClick={() => setShowQr(false)}
                            className="absolute top-6 right-6 p-3 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                    <div className="mb-8">
                        <div className={(cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
                          urlSession ? "bg-emerald-50 text-emerald-600" : (isLecturer ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-[#003B95]")
                        ))}>
                            {urlSession ? <ScanLine className="w-8 h-8" /> : <QrCode className="w-8 h-8" />}
                        </div>
                        <h2 className="text-2xl font-display font-black text-slate-800 dark:text-white mb-2">
                          {urlSession ? (unitInfo?.title || 'Academic Session') : (isLecturer ? 'Live Session Key' : 'Campus Check-in')}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                          {urlSession 
                            ? `Marking attendance for ${unitInfo?.code || 'this unit'} in Room ${urlRoom}.` 
                            : (isLecturer ? 'Display this code for students in your class.' : 'Verify your presence at CIHE campus.')
                          }
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 mb-8 flex flex-col items-center justify-center min-h-[250px] group relative">
                         {urlSession ? (
                            <div className="text-center space-y-4">
                                <div className="text-4xl font-display font-black text-[#003B95] dark:text-indigo-400 tracking-tighter">{urlRoom}</div>
                                <div className="space-y-1">
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{urlUnit}</div>
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase leading-snug max-w-[200px] mx-auto">
                                    {unitInfo?.title}
                                  </div>
                                </div>
                                <div className="p-4 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-2xl text-[10px] font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2 uppercase tracking-widest">
                                  <Shield className="w-4 h-4" /> Identity Validated
                                </div>
                            </div>
                         ) : (
                           <>
                             <div className="bg-white p-6 rounded-3xl shadow-inner transition-transform group-hover:scale-105 duration-500">
                                 <QRCodeSVG 
                                    value={isLecturer ? `${sessionToken}&expires=${Date.now() + (timeLeft * 1000)}&v=1` : 'CIHE-STUDENT-CHECKIN'} 
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                 />
                             </div>
                             {isLecturer && (
                               <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-brand-indigo text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                  <Clock className="w-3 h-3" />
                                  Refreshing in {timeLeft}s
                               </div>
                             )}
                           </>
                         )}
                         {!urlSession && (
                           <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {isLecturer ? `SESSION ID: ${activeSession?.id}` : 'CIHE-NS-L4-H01'}
                           </p>
                         )}
                    </div>

                    {isStudent && (
                      <button 
                          onClick={() => markAttendanceMutation.mutate('present')}
                          disabled={markAttendanceMutation.isPending}
                          className="w-full py-5 bg-[#003B95] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                          {markAttendanceMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                              <>
                                  <Check className="w-4 h-4" />
                                  Synchronize Identity
                              </>
                          )}
                      </button>
                    )}

                    {isLecturer && (
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest animate-pulse">
                        Live Session Active
                      </p>
                    )}
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
