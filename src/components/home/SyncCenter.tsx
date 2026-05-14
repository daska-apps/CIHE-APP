import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, LayoutGrid, Calendar, MessageSquare, Bell, Check, AlertCircle, ChevronRight, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SyncItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'syncing';
  description: string;
}

const INITIAL_SYNC_ITEMS: SyncItem[] = [
  { id: 'teams', name: 'Microsoft Teams', icon: <MessageSquare className="w-4 h-4" />, status: 'disconnected', description: 'Sync chat notifications and meeting alerts.' },
  { id: 'outlook', name: 'Outlook Calendar', icon: <Calendar className="w-4 h-4" />, status: 'disconnected', description: 'Import class reminders and assignment deadlines.' },
  { id: 'portal', name: 'Entra ID', icon: <Settings className="w-4 h-4" />, status: 'connected', description: 'SSO and security profile management.' }
];

export default function SyncCenter() {
  const [items, setItems] = useState(INITIAL_SYNC_ITEMS);
  const [lastSync, setLastSync] = useState('2m ago');

  const handleSync = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'syncing' } : item
    ));

    // Simulate connection
    setTimeout(() => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'connected' } : item
      ));
      setLastSync('Just now');
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col h-full shadow-sm hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Sync Center</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Connected Services</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Last Activity</p>
          <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{lastSync}</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {items.map((item) => (
          <div 
            key={item.id}
            className={cn(
              "p-5 rounded-3xl border transition-all group",
              item.status === 'connected' ? "bg-slate-50/50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800" : "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                  item.status === 'connected' ? "bg-white dark:bg-slate-800 text-[#003B95] dark:text-indigo-400 shadow-sm" : "bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600"
                )}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 line-clamp-1">{item.description}</p>
                </div>
              </div>

              {item.status === 'disconnected' ? (
                <button 
                  onClick={() => handleSync(item.id)}
                  className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Connect
                </button>
              ) : item.status === 'syncing' ? (
                <div className="w-8 h-8 rounded-full border-2 border-slate-100 dark:border-slate-800 border-t-[#003B95] dark:border-t-indigo-500 animate-spin" />
              ) : (
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
         <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center overflow-hidden">
                 <img src={`https://i.pravatar.cc/32?img=${i+10}`} alt="user" referrerPolicy="no-referrer" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-600">
               +12
            </div>
         </div>
         <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-slate-800 dark:hover:text-white transition-colors">
            Manage Permissions <ChevronRight className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
}
