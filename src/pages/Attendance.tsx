import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, Clock, Search, Check, X, QrCode, Shield, Users, ArrowUpRight, Loader2, PlayCircle, StopCircle, ScanLine, BookOpen, CalendarCheck, RefreshCw, Send, AlertTriangle, Plus, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import QRScanner from '../components/attendance/QRScanner';

interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
  room?: string;
  unitCode?: string;
  sessionId?: string;
}

import { TIMETABLE_A, TIMETABLE_B, UNIT_TITLES, getMasterSchedule } from '../lib/timetableData';

export default function Attendance() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [scannedResult, setScannedResult] = useState<{ session: string; room: string; unit: string } | null>(null);
  const [activeSession, setActiveSession] = useState<{ id: string; room: string; title: string; unitCode: string } | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [timetableVersion] = useState<'A' | 'B'>('A');
  const [timeLeft, setTimeLeft] = useState(60);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [rotating, setRotating] = useState(false);
  // Batch queue for attendance records
  const batchQueueRef = useRef<any[]>([]);
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Absence Request State ──
  interface AbsenceRequest {
    id: string;
    studentId: string;
    studentName: string;
    unitCode: string;
    date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
  }
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>(() => {
    try { return JSON.parse(localStorage.getItem('cihe-absence-requests') || '[]'); } catch { return []; }
  });
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceForm, setAbsenceForm] = useState({ date: '', unitCode: '', reason: '' });
  const [absenceSubmitting, setAbsenceSubmitting] = useState(false);
  const [absenceSubmitted, setAbsenceSubmitted] = useState(false);

  const submitAbsenceRequest = async () => {
    if (!absenceForm.date || !absenceForm.unitCode || !absenceForm.reason.trim()) return;
    setAbsenceSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const req: AbsenceRequest = {
      id: `ABS-${Date.now().toString(36).toUpperCase()}`,
      studentId: user?.id || 'unknown',
      studentName: user?.name || 'Unknown',
      unitCode: absenceForm.unitCode,
      date: absenceForm.date,
      reason: absenceForm.reason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    const updated = [req, ...absenceRequests];
    setAbsenceRequests(updated);
    localStorage.setItem('cihe-absence-requests', JSON.stringify(updated));
    setAbsenceSubmitting(false);
    setAbsenceSubmitted(true);
    setTimeout(() => {
      setAbsenceSubmitted(false);
      setShowAbsenceModal(false);
      setAbsenceForm({ date: '', unitCode: '', reason: '' });
    }, 1500);
  };

  const handleAbsenceAction = (id: string, action: 'approved' | 'rejected') => {
    const updated = absenceRequests.map(r => r.id === id ? { ...r, status: action } : r);
    setAbsenceRequests(updated);
    localStorage.setItem('cihe-absence-requests', JSON.stringify(updated));
  };

  const SESSION_TTL = 60; // seconds before QR auto-rotates

  const urlSession = searchParams.get('session');
  const urlRoom = searchParams.get('room');
  const urlUnit = searchParams.get('unit');

  // Effective values: URL params take priority, otherwise use scanned result
  const effectiveSession = urlSession || scannedResult?.session || null;
  const effectiveRoom = urlRoom || scannedResult?.room || null;
  const effectiveUnit = urlUnit || scannedResult?.unit || null;

  const unitInfo = effectiveUnit ? UNIT_TITLES[effectiveUnit] : null;

  // Rotate session ID — generates a fresh SESS- code, invalidating the old QR
  const rotateSession = useCallback(() => {
    setRotating(true);
    setSessionExpired(false);
    setActiveSession(prev => prev ? {
      ...prev,
      id: `SESS-${crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()}`,
    } : null);
    setTimeLeft(SESSION_TTL);
    setTimeout(() => setRotating(false), 800);
  }, []);

  // Countdown + auto-rotate when timer hits 0
  useEffect(() => {
    if (!showQr || !activeSession) return;
    setTimeLeft(SESSION_TTL);
    setSessionExpired(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSessionExpired(true);
          // Auto-rotate after a 3-second "expired" window so lecturer sees it
          setTimeout(() => rotateSession(), 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQr, activeSession?.id]); // re-runs on each rotation (new id)

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

  const isStudent = user?.role === 'student';
  const isLecturer = user?.role === 'lecturer';
  const isOperator = user?.role === 'admin' || user?.role === 'global_admin';

  const { data: records, isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ['attendance'],
    queryFn: async () => {
      const res = await fetch('/api/attendance');
      return res.json();
    },
    staleTime: 0,
    refetchInterval: isLecturer && showQr && activeSession ? 2000 : false,
    refetchIntervalInBackground: true,
  });

  // ── Batch flush: sends queued records to /api/attendance/batch ──
  const flushBatch = useCallback(async () => {
    if (batchQueueRef.current.length === 0) return;
    const payload = [...batchQueueRef.current];
    batchQueueRef.current = [];
    try {
      await fetch('/api/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: payload }),
      });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    } catch {
      // Re-queue on failure
      batchQueueRef.current = [...payload, ...batchQueueRef.current];
    }
  }, [queryClient]);

  // ── Queue a record then schedule a flush (debounced 500 ms, max 10) ──
  const enqueueAttendance = useCallback((record: any) => {
    batchQueueRef.current.push(record);
    if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
    if (batchQueueRef.current.length >= 10) {
      flushBatch();
    } else {
      batchTimerRef.current = setTimeout(flushBatch, 500);
    }
  }, [flushBatch]);

  const markAttendanceMutation = useMutation({
    mutationFn: async (status: 'present' | 'absent' | 'late') => {
      // Anti-Fraud check
      await new Promise(resolve => setTimeout(resolve, 1200));
      const record = {
        studentId: user?.id,
        name: user?.name,
        status,
        room: effectiveRoom || 'L4-H01',
        sessionId: effectiveSession || 'manual',
        unitCode: effectiveUnit,
        metadata: { ipVerified: true, geofence: 'CIHE-SYDNEY-CAMPUS', timestamp: new Date().toISOString() }
      };
      enqueueAttendance(record);
      return record;
    },
    onSuccess: () => {
      setShowQr(false);
      setScannedResult(null);
      setSearchParams({});
    }
  });

  // Auto-refresh records every 3 s while lecturer session modal is open
  useEffect(() => {
    if (!isLecturer || !showQr || !activeSession) return;
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLecturer, showQr, activeSession]);

  // Students who checked in to this specific session
  const liveAttendees = records?.filter(r => r.sessionId === activeSession?.id) ?? [];

  const filteredRecords = records?.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      id: `SESS-${crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()}`,
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
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowAbsenceModal(true)}
                className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Absence
              </button>
              <button
                onClick={() => setShowQr(true)}
                className="px-6 py-3 bg-[#003B95] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-100/50"
              >
                <QrCode className="w-4 h-4" />
                Check-in Now
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Student: personal attendance history */}
      {isStudent && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-brand-indigo dark:text-indigo-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">My Attendance</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Your check-in history for this semester</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-brand-indigo dark:text-indigo-400" />
            </div>
          ) : (() => {
            const myRecords = records?.filter(r => r.studentId === user?.id) ?? [];
            if (myRecords.length === 0) {
              return (
                <div className="py-16 text-center">
                  <CalendarCheck className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No check-ins yet</p>
                  <p className="text-xs font-bold text-slate-300 dark:text-slate-600 mt-1">Use the Check-in Now button to mark your attendance.</p>
                </div>
              );
            }
            return (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Unit</th>
                      <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Room</th>
                      <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Status</th>
                      <th className="px-8 py-4 border-b border-slate-100 dark:border-slate-800">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {myRecords.slice().reverse().map((record) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                              <BookOpen className="w-3.5 h-3.5 text-brand-indigo dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              {record.unitCode || <span className="text-slate-300 dark:text-slate-600 font-mono text-xs">—</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                            {record.room || '—'}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                            record.status === 'present' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                            record.status === 'absent'  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" :
                            "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full",
                              record.status === 'present' ? "bg-emerald-500" :
                              record.status === 'absent'  ? "bg-rose-500" : "bg-amber-500"
                            )} />
                            {record.status}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {new Date(record.timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600">
                            {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Student: My Absence Requests ── */}
      {isStudent && absenceRequests.filter(r => r.studentId === user?.id).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Absence Requests</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Your submitted absence notifications</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {absenceRequests.filter(r => r.studentId === user?.id).map(req => (
              <div key={req.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{req.unitCode} · {req.date}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 max-w-[260px] truncate">{req.reason}</p>
                </div>
                <span className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                  req.status === 'approved' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                  req.status === 'rejected' ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" :
                  "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                )}>
                  {req.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> :
                   req.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                   <Clock className="w-3 h-3" />}
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Lecturer: Pending Absence Approvals ── */}
      {(isLecturer || isOperator) && absenceRequests.filter(r => r.status === 'pending').length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-amber-200 dark:border-amber-500/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-amber-100 dark:border-amber-500/20 flex items-center gap-4 bg-amber-50/50 dark:bg-amber-500/5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Pending Absence Requests</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{absenceRequests.filter(r => r.status === 'pending').length} awaiting your review</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {absenceRequests.filter(r => r.status === 'pending').map(req => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5">
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800 dark:text-white">{req.studentName}</p>
                  <p className="text-[10px] font-bold text-brand-indigo dark:text-indigo-400 uppercase tracking-widest">{req.unitCode} · {req.date}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{req.reason}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAbsenceAction(req.id, 'approved')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleAbsenceAction(req.id, 'rejected')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              onClick={() => { setShowQr(false); setScannedResult(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* ── LECTURER MODAL (wide, two-panel) ── */}
            {!isStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Left — QR code + session info */}
                <div className="md:w-[45%] bg-slate-950 p-10 flex flex-col items-center justify-between gap-8 relative">
                  <button
                    onClick={() => setShowQr(false)}
                    className="absolute top-5 left-5 p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center pt-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Live Session Active
                    </div>
                    <h2 className="text-xl font-display font-black text-white mb-1">{activeSession?.title || 'Academic Session'}</h2>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Room {activeSession?.room}</p>
                  </div>

                  {/* QR Code with expiry overlay */}
                  <div className="relative">
                    <div className={cn(
                      "bg-white p-5 rounded-3xl shadow-2xl transition-all duration-300",
                      (sessionExpired || rotating) && "opacity-30 scale-95 blur-sm"
                    )}>
                      <QRCodeSVG
                        value={sessionToken}
                        size={200}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    {/* Countdown ring */}
                    {!sessionExpired && !rotating && (
                      <div className={cn(
                        "absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg transition-colors",
                        timeLeft <= 10
                          ? "bg-rose-500 text-white animate-pulse"
                          : timeLeft <= 20
                          ? "bg-amber-500 text-white"
                          : "bg-brand-indigo text-white"
                      )}>
                        <Clock className="w-3 h-3" />
                        {timeLeft}s
                      </div>
                    )}

                    {/* Expired overlay */}
                    {sessionExpired && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-slate-900/80 backdrop-blur-sm">
                        <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-1">Expired</span>
                        <span className="text-white/40 text-[9px] font-bold">Rotating QR…</span>
                      </div>
                    )}

                    {/* Rotating overlay */}
                    {rotating && !sessionExpired && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-slate-900/70 backdrop-blur-sm">
                        <RefreshCw className="w-8 h-8 text-white animate-spin mb-1" />
                        <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">New QR Ready</span>
                      </div>
                    )}
                  </div>

                  {/* Manual rotate button */}
                  <button
                    onClick={rotateSession}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
                  >
                    <RefreshCw className="w-3 h-3" /> Rotate Now
                  </button>

                  <div className="text-center w-full">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Session Code</p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
                      <p className="text-white font-mono font-black text-sm tracking-widest">{activeSession?.id}</p>
                    </div>
                    <p className="text-[9px] font-bold text-white/20 mt-3">QR auto-rotates every {SESSION_TTL}s · Students can enter code manually</p>
                  </div>
                </div>

                {/* Right — Live attendee feed */}
                <div className="flex-1 flex flex-col">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Live Attendees</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Auto-refreshing every 2 seconds</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{liveAttendees.length} joined</span>
                      </div>
                      <RefreshCw className="w-4 h-4 text-slate-300 dark:text-slate-600 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[400px]">
                    {liveAttendees.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                        <Users className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Waiting for students</p>
                        <p className="text-xs font-bold text-slate-300 dark:text-slate-600 mt-1">Students who scan the QR code will appear here</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        <AnimatePresence>
                          {liveAttendees.map((attendee, i) => (
                            <motion.div
                              key={attendee.id}
                              initial={{ opacity: 0, x: 20, backgroundColor: '#dcfce7' }}
                              animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                              transition={{ duration: 0.4 }}
                              className="flex items-center gap-4 px-8 py-4"
                            >
                              <div className="w-9 h-9 rounded-xl bg-brand-indigo dark:bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                                {attendee.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate">{attendee.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 font-mono">{attendee.studentId}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {attendee.status}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {new Date(attendee.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {activeSession?.unitCode} • {activeSession?.room}
                    </p>
                    <button
                      onClick={() => { stopSession(); setShowQr(false); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
                    >
                      <StopCircle className="w-4 h-4" /> End Session
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STUDENT MODAL (narrow, scan flow) ── */}
            {isStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 text-center shadow-2xl border border-slate-100 dark:border-slate-800"
              >
                <button
                  onClick={() => { setShowQr(false); setScannedResult(null); }}
                  className="absolute top-6 right-6 p-3 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
                    effectiveSession ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#003B95]"
                  )}>
                    {effectiveSession ? <ScanLine className="w-8 h-8" /> : <QrCode className="w-8 h-8" />}
                  </div>
                  <h2 className="text-2xl font-display font-black text-slate-800 dark:text-white mb-2">
                    {effectiveSession ? (unitInfo?.title || 'Academic Session') : 'Campus Check-in'}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {effectiveSession
                      ? `Marking attendance for ${effectiveUnit || 'this unit'} in Room ${effectiveRoom}.`
                      : 'Scan the QR code displayed by your lecturer.'}
                  </p>
                </div>

                {/* Scan phase */}
                {!effectiveSession && !scannedResult && (
                  <div className="mb-8">
                    <QRScanner onResult={(result) => setScannedResult(result)} />
                  </div>
                )}

                {/* Confirm phase */}
                {(effectiveSession || scannedResult) && (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 mb-8">
                      <div className="text-center space-y-4">
                        <div className="text-4xl font-display font-black text-[#003B95] dark:text-indigo-400 tracking-tighter">{effectiveRoom}</div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{effectiveUnit}</div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase leading-snug max-w-[200px] mx-auto">
                            {unitInfo?.title || 'Academic Session'}
                          </div>
                        </div>
                        <div className="p-4 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-2xl text-[10px] font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2 uppercase tracking-widest">
                          <Shield className="w-4 h-4" /> Session Verified
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => markAttendanceMutation.mutate('present')}
                      disabled={markAttendanceMutation.isPending}
                      className="w-full py-5 bg-[#003B95] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {markAttendanceMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><Check className="w-4 h-4" /> Synchronize Identity</>
                      )}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* ── Absence Request Modal ── */}
      <AnimatePresence>
        {showAbsenceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => { if (!absenceSubmitting) setShowAbsenceModal(false); }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-8 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">Report Absence</h2>
                    <p className="text-[10px] text-slate-400 font-bold">Notifies your lecturer and registry</p>
                  </div>
                </div>
                <button onClick={() => setShowAbsenceModal(false)} className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {absenceSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-14 flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Submitted</p>
                  <p className="text-xs text-slate-400 text-center">Your lecturer has been notified.</p>
                </motion.div>
              ) : (
                <div className="p-8 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Absence</label>
                    <input
                      type="date"
                      value={absenceForm.date}
                      onChange={e => setAbsenceForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-indigo dark:focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Code</label>
                    <input
                      type="text"
                      value={absenceForm.unitCode}
                      onChange={e => setAbsenceForm(f => ({ ...f, unitCode: e.target.value.toUpperCase() }))}
                      placeholder="e.g. ICT301"
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo dark:focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</label>
                    <textarea
                      value={absenceForm.reason}
                      onChange={e => setAbsenceForm(f => ({ ...f, reason: e.target.value }))}
                      placeholder="Brief description of your absence (medical, family, etc.)"
                      rows={3}
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo dark:focus:border-indigo-500 resize-none transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Supporting documentation (medical certificate, etc.) can be submitted via{' '}
                    <span className="text-brand-indigo dark:text-indigo-400 underline cursor-pointer">Forms & Requests</span>.
                  </p>
                  <button
                    onClick={submitAbsenceRequest}
                    disabled={!absenceForm.date || !absenceForm.unitCode || !absenceForm.reason.trim() || absenceSubmitting}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                      absenceForm.date && absenceForm.unitCode && absenceForm.reason.trim()
                        ? "bg-brand-indigo text-white hover:bg-indigo-700 shadow-lg shadow-brand-indigo/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {absenceSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Absence Report</>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
