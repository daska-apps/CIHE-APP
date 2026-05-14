import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, Bell, Key, Smartphone, LogOut, CheckCircle, Monitor, Tablet, Trash2, MapPin, Clock, Globe, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface LoginEvent {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'failed';
}

const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'MacBook Pro', type: 'desktop', browser: 'Chrome 124', location: 'Sydney, NSW', lastActive: 'Active now', isCurrent: true },
  { id: '2', name: 'iPhone 15 Pro', type: 'mobile', browser: 'Safari 17', location: 'Sydney, NSW', lastActive: '2 hours ago', isCurrent: false },
  { id: '3', name: 'iPad Air', type: 'tablet', browser: 'Safari 17', location: 'Parramatta, NSW', lastActive: 'Yesterday', isCurrent: false },
];

const LOGIN_HISTORY: LoginEvent[] = [
  { id: '1', device: 'MacBook Pro', browser: 'Chrome 124', location: 'Sydney, NSW', ip: '103.xx.xx.41', timestamp: new Date().toISOString(), status: 'success' },
  { id: '2', device: 'iPhone 15 Pro', browser: 'Safari 17', location: 'Sydney, NSW', ip: '103.xx.xx.41', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'success' },
  { id: '3', device: 'Unknown Device', browser: 'Firefox 125', location: 'Melbourne, VIC', ip: '58.xx.xx.12', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'failed' },
  { id: '4', device: 'iPad Air', browser: 'Safari 17', location: 'Parramatta, NSW', ip: '103.xx.xx.41', timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'success' },
  { id: '5', device: 'MacBook Pro', browser: 'Chrome 124', location: 'Sydney, NSW', ip: '103.xx.xx.41', timestamp: new Date(Date.now() - 259200000).toISOString(), status: 'success' },
];

const DeviceIcon = ({ type, className }: { type: Device['type']; className?: string }) => {
  if (type === 'mobile') return <Smartphone className={className} />;
  if (type === 'tablet') return <Tablet className={className} />;
  return <Monitor className={className} />;
};

export default function Profile() {
  const { user } = useAuthStore();
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [removingId, setRemovingId] = useState<string | null>(null);

  function removeDevice(id: string) {
    setRemovingId(id);
    setTimeout(() => {
      setDevices(prev => prev.filter(d => d.id !== id));
      setRemovingId(null);
    }, 400);
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            <User className="w-3 h-3" />
            Identity
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Manage your CIHE digital identity and security preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="h-32 bg-brand-indigo relative">
              <div className="absolute -bottom-12 left-10 w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center font-black text-4xl text-brand-indigo italic">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div className="pt-16 p-10">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-display font-black text-slate-800 dark:text-white tracking-tight mb-1">{user?.name}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2">
                    {user?.role.replace('_', ' ')} <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-indigo dark:hover:bg-indigo-100 transition-all">
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Email</label>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.email}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Student ID</label>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 uppercase">{user?.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications + Security row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-800 dark:text-white tracking-tight">Notifications</h4>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Attendance Alerts', enabled: true },
                  { label: 'Academic Announcements', enabled: true },
                  { label: 'System Maintenance', enabled: false },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{pref.label}</span>
                    <div className={cn("w-10 h-6 rounded-full p-1 transition-colors relative", pref.enabled ? "bg-brand-indigo" : "bg-slate-200 dark:bg-slate-700")}>
                      <div className={cn("w-4 h-4 rounded-full bg-white transition-all", pref.enabled ? "translate-x-4" : "translate-x-0")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-brand-indigo dark:text-indigo-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-800 dark:text-white tracking-tight">Security</h4>
              </div>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between group">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">2FA Settings</span>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </button>
                <button className="w-full flex items-center justify-between group">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Active Sessions</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{devices.length} ACTIVE</p>
                </button>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white tracking-tight">Connected Devices</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{devices.length} device{devices.length !== 1 ? 's' : ''} signed in</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence>
                {devices.map(device => (
                  <motion.div
                    key={device.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: removingId === device.id ? 0 : 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-5 px-8 py-5 group"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                      device.isCurrent ? "bg-brand-indigo text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    )}>
                      <DeviceIcon type={device.type} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">{device.name}</p>
                        {device.isCurrent && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">This device</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{device.browser}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{device.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{device.lastActive}</span>
                      </div>
                    </div>
                    {!device.isCurrent && (
                      <button
                        onClick={() => removeDevice(device.id)}
                        title="Remove device"
                        className="p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {devices.length === 0 && (
                <p className="px-8 py-10 text-sm font-bold text-slate-400 text-center">No other devices connected.</p>
              )}
            </div>
          </div>

          {/* Recent Login Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white tracking-tight">Recent Login Activity</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last 7 days</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {LOGIN_HISTORY.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-5 px-8 py-5"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                    event.status === 'success' ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-rose-50 dark:bg-rose-500/10"
                  )}>
                    {event.status === 'success'
                      ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                      : <AlertTriangle className="w-4 h-4 text-rose-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{event.device}</p>
                      {event.status === 'failed' && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg">Failed attempt</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{event.browser}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      <span className="font-mono">{event.ip}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 shrink-0 text-right">
                    {new Date(event.timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}<br />
                    <span className="text-slate-300 dark:text-slate-600">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Microsoft Integration</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">Outlook Linked</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">CIHE-TENANT-NS</p>
                </div>
              </div>
              <button className="w-full py-4 border-2 border-white/10 hover:bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Key className="w-4 h-4" /> Manage PKCE Tokens
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Quick Links</h4>
            {[
              { label: 'Download Login Report', icon: ChevronRight },
              { label: 'Sign Out All Devices', icon: LogOut },
            ].map(({ label, icon: Icon }) => (
              <button key={label} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{label}</span>
                <Icon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          <div className="bg-rose-50 dark:bg-rose-500/10 rounded-[2.5rem] p-8 border border-rose-100 dark:border-rose-500/20">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 dark:text-rose-400/60 mb-6">Danger Zone</h4>
            <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200 dark:shadow-none">
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
