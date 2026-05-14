import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Bell, Key, Smartphone, LogOut, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest">
            <User className="w-3 h-3" />
            Identity
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium max-w-md">Manage your CIHE digital identity and security preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-32 bg-brand-indigo relative">
                    <div className="absolute -bottom-12 left-10 w-24 h-24 rounded-[2rem] bg-white border-4 border-white shadow-xl flex items-center justify-center font-black text-4xl text-brand-indigo italic">
                        {user?.name.charAt(0)}
                    </div>
                </div>
                <div className="pt-16 p-10">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl font-display font-black text-slate-800 tracking-tight mb-1">{user?.name}</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2">
                                {user?.role.replace('_', ' ')} <CheckCircle className="w-3 h-3 text-emerald-500" />
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-indigo transition-all">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Email</label>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">{user?.email}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Student ID</label>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <Shield className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-mono font-bold text-slate-700 uppercase">{user?.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-slate-800 tracking-tight">Notifications</h4>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Attendance Alerts', enabled: true },
                            { label: 'Academic Announcements', enabled: true },
                            { label: 'System Maintenance', enabled: false },
                        ].map((pref, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <span className="text-sm font-bold text-slate-600">{pref.label}</span>
                                <div className={cn("w-10 h-6 rounded-full p-1 transition-colors relative", pref.enabled ? "bg-brand-indigo" : "bg-slate-200")}>
                                    <div className={cn("w-4 h-4 rounded-full bg-white transition-all", pref.enabled ? "translate-x-4" : "translate-x-0")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-brand-indigo">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-slate-800 tracking-tight">Security</h4>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between group">
                            <span className="text-sm font-bold text-slate-600">2FA Settings</span>
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </button>
                        <button className="w-full flex items-center justify-between group">
                            <span className="text-sm font-bold text-slate-600">Active Sessions</span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2 ACTIVE</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column - Secondary Actions */}
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

            <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-6">Danger Zone</h4>
                <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200">
                    <LogOut className="w-4 h-4" /> Terminate Session
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
