import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Info, AlertTriangle, MessageSquare, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'alert', title: 'Census Date Approaching', message: 'The census date for IT Foundations is Friday. Review your enrolment.', time: '2m ago', read: false },
  { id: '2', type: 'message', title: 'New Message from Mutaz', message: 'Shared a new resource for IT Infrastructure & Networking.', time: '1h ago', read: false },
  { id: '3', type: 'info', title: 'Level 4 Access Update', message: 'Pitt St Level 4 lounge is now open 24/7 with your student card.', time: '3h ago', read: true },
  { id: '4', type: 'warning', title: 'Attendance Alert', message: 'Your attendance in ICT940 is at 78%. Reach out if you need support.', time: 'Yesterday', read: true },
];

export default function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
            className="absolute top-20 right-8 w-full max-w-sm bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <Bell className="w-4 h-4 text-[#003B95]" />
                   Notifications
                </h3>
              </div>
              <div className="flex items-center gap-2">
                 <button className="text-[9px] font-black text-[#003B95] uppercase tracking-widest hover:underline">Mark all read</button>
                 <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                    <X className="w-3 h-3 text-slate-400" />
                 </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div 
                  key={n.id}
                  className={cn(
                    "p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group",
                    !n.read && "bg-white"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                      n.type === 'alert' ? "bg-rose-50 text-rose-500" :
                      n.type === 'warning' ? "bg-amber-50 text-amber-600" :
                      n.type === 'message' ? "bg-indigo-50 text-indigo-600" :
                      "bg-blue-50 text-[#003B95]"
                    )}>
                      {n.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> :
                       n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                       n.type === 'message' ? <MessageSquare className="w-5 h-5" /> :
                       <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-xs font-black text-slate-800 truncate">{n.title}</h4>
                        <span className="text-[9px] font-bold text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-[#003B95] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 text-center">
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">
                  View All Notifications
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
