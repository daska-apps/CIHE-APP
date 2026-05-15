import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Moon,
  Sun,
  Smartphone,
  Globe,
  Mail,
  Lock,
  ChevronRight,
  Camera,
  Check,
  Link2,
  Unlink,
  BookOpen,
  Loader2,
  GraduationCap,
  Megaphone,
  UserCheck,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';
import { isPushSupported, subscribeToPush, unsubscribeFromPush, getCurrentPermission } from '../lib/pushNotifications';

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Section = ({ title, description, children }: SectionProps) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
    <div className="mb-6">
      <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-xs text-slate-400 font-bold">{description}</p>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

interface SettingItemProps {
  icon: any;
  label: string;
  value?: string;
  onClick?: () => void;
  toggle?: boolean;
  isToggled?: boolean;
}

const SettingItem = ({ icon: Icon, label, value, onClick, toggle, isToggled }: SettingItemProps) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group text-left"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-indigo dark:group-hover:text-indigo-400 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">{label}</p>
        {value && <p className="text-[10px] text-slate-400 font-bold mt-0.5">{value}</p>}
      </div>
    </div>
    {toggle ? (
      <div className={cn(
        "w-10 h-6 rounded-full transition-colors relative",
        isToggled ? "bg-brand-indigo" : "bg-slate-200 dark:bg-slate-700"
      )}>
        <div className={cn(
          "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
          isToggled && "translate-x-4"
        )} />
      </div>
    ) : (
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
    )}
  </button>
);

export default function Settings() {
  const { user, darkMode, setDarkMode } = useAuthStore();
  const [mfa, setMfa] = useState(false);

  // Notification preferences (persisted to localStorage)
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cihe-notif-prefs') || '{}');
    } catch { return {}; }
  });
  const toggleNotif = (key: string) => {
    const next = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(next);
    localStorage.setItem('cihe-notif-prefs', JSON.stringify(next));
  };
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [msConnected, setMsConnected] = useState(() => localStorage.getItem('cihe-ms-connected') === '1');
  const [moodleConnected, setMoodleConnected] = useState(() => localStorage.getItem('cihe-moodle-connected') === '1');
  const [connecting, setConnecting] = useState<'ms'|'moodle'|null>(null);

  const connectMicrosoft = async () => {
    setConnecting('ms');
    await new Promise(r => setTimeout(r, 1800)); // simulated OAuth
    setMsConnected(true);
    localStorage.setItem('cihe-ms-connected', '1');
    setConnecting(null);
  };

  const connectMoodle = async () => {
    setConnecting('moodle');
    await new Promise(r => setTimeout(r, 1500));
    setMoodleConnected(true);
    localStorage.setItem('cihe-moodle-connected', '1');
    setConnecting(null);
  };

  const disconnect = (service: 'ms' | 'moodle') => {
    if (service === 'ms') { setMsConnected(false); localStorage.removeItem('cihe-ms-connected'); }
    else { setMoodleConnected(false); localStorage.removeItem('cihe-moodle-connected'); }
  };

  useEffect(() => {
    setPushEnabled(isPushSupported() && getCurrentPermission() === 'granted');
  }, []);

  const togglePush = async () => {
    if (!isPushSupported()) return;
    setPushLoading(true);
    if (pushEnabled) {
      await unsubscribeFromPush(user?.id || 'anon');
      setPushEnabled(false);
    } else {
      const ok = await subscribeToPush(user?.id || 'anon');
      setPushEnabled(ok);
    }
    setPushLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8 pb-24">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-brand-indigo" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Settings</h1>
              <p className="text-slate-400 font-bold flex items-center gap-2">
                Manage your profile and portal preferences
              </p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-800 overflow-hidden mx-auto shadow-lg">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-brand-indigo text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1">{user?.name}</h2>
            <p className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 uppercase tracking-widest mb-6">{user?.role} &bull; CIHE ID {user?.id || '21351'}</p>
            
            <div className="flex flex-col gap-2">
              <button className="w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-50 transition-colors shadow-lg">
                Edit Public Profile
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <Shield className="w-24 h-24" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-2 relative z-10">Security Score</h4>
            <p className="text-3xl font-black mb-4 relative z-10">85%</p>
            <div className="w-full h-2 bg-indigo-500 rounded-full mb-6 relative z-10">
               <div className="w-[85%] h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline relative z-10">
              Improve Security <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="md:col-span-2 space-y-6">
          <Section 
            title="Appearance" 
            description="Personalise your dashboard experience"
          >
            <SettingItem
              icon={darkMode ? Moon : Sun}
              label="Dark Mode"
              value={darkMode ? "High contrast visual style" : "Classic light theme"}
              toggle
              isToggled={darkMode}
              onClick={() => setDarkMode(!darkMode)}
            />
            <SettingItem 
              icon={Smartphone} 
              label="App Sync" 
              value="Sync settings with CIHE Mobile"
              toggle
              isToggled={true}
            />
          </Section>

          <Section 
            title="Personal Info" 
            description="Manage your contact and identity details"
          >
            <SettingItem icon={Mail} label="Email Address" value="anthony.d@student.cihe.edu.au" />
            <SettingItem icon={Globe} label="Language" value="English (Australian)" />
            <SettingItem icon={User} label="Academic Record" value="Bachelor of IT (Network Security)" />
          </Section>

          <Section 
            title="Privacy & Security" 
            description="Control your data and account access"
          >
            <SettingItem icon={Lock} label="Change Password" value="Last changed 3 months ago" />
            <SettingItem 
              icon={Shield} 
              label="Two-Factor Auth" 
              value="Protect your account with MFA"
              toggle
              isToggled={mfa}
              onClick={() => setMfa(!mfa)}
            />
            <SettingItem
              icon={Bell}
              label="Push Notifications"
              value={pushEnabled ? "Enabled — you'll receive alerts" : pushLoading ? "Updating…" : isPushSupported() ? "Tap to enable alerts for classes and news" : "Not supported on this browser"}
              toggle
              isToggled={pushEnabled}
              onClick={togglePush}
            />
          </Section>

          {/* Notification Preferences */}
          <Section title="Notification Preferences" description="Choose which alerts you receive and how">
            {[
              { key: 'notif-grades',        icon: GraduationCap, label: 'Grade Updates',         value: 'New results and feedback posted' },
              { key: 'notif-announcements', icon: Megaphone,     label: 'Announcements',          value: 'Campus news and urgent notices' },
              { key: 'notif-attendance',    icon: UserCheck,     label: 'Attendance Reminders',   value: 'Before class and absence alerts' },
              { key: 'notif-assignments',   icon: FileText,      label: 'Assignment Deadlines',   value: '24h and 1h before due dates' },
            ].map(item => (
              <SettingItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                value={item.value}
                toggle
                isToggled={!!notifPrefs[item.key]}
                onClick={() => toggleNotif(item.key)}
              />
            ))}
          </Section>

          {/* Connected Accounts */}
          <Section title="Connected Accounts" description="Link your Microsoft and Moodle accounts to sync academic records and grades">
            {/* Microsoft Entra */}
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none"><path d="M1 1h10v10H1z" fill="#F35325"/><path d="M12 1h10v10H12z" fill="#81BC06"/><path d="M1 12h10v10H1z" fill="#05A6F0"/><path d="M12 12h10v10H12z" fill="#FFBA08"/></svg>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Microsoft 365</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {msConnected ? `Connected as ${user?.email}` : 'Sign in with your CIHE Microsoft account'}
                  </p>
                </div>
              </div>
              {msConnected ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                  <button onClick={() => disconnect('ms')} className="p-1.5 text-slate-300 hover:text-rose-400 transition-colors"><Unlink className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button
                  onClick={connectMicrosoft}
                  disabled={connecting === 'ms'}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0078d4] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60"
                >
                  {connecting === 'ms' ? <><Loader2 className="w-3 h-3 animate-spin" /> Connecting…</> : <><Link2 className="w-3 h-3" /> Connect</>}
                </button>
              )}
            </div>

            {/* Moodle */}
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#f47b20]" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Moodle LMS</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {moodleConnected ? 'Grades and academic records syncing' : 'Connect to sync grades and academic records'}
                  </p>
                </div>
              </div>
              {moodleConnected ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    <Check className="w-3 h-3" /> Syncing
                  </span>
                  <button onClick={() => disconnect('moodle')} className="p-1.5 text-slate-300 hover:text-rose-400 transition-colors"><Unlink className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button
                  onClick={connectMoodle}
                  disabled={connecting === 'moodle' || !msConnected}
                  title={!msConnected ? 'Connect Microsoft first' : ''}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#f47b20] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all disabled:opacity-40"
                >
                  {connecting === 'moodle' ? <><Loader2 className="w-3 h-3 animate-spin" /> Connecting…</> : <><Link2 className="w-3 h-3" /> Connect</>}
                </button>
              )}
            </div>
            {!msConnected && (
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 px-4">Connect Microsoft first to enable Moodle sync.</p>
            )}
          </Section>

          <div className="flex items-center justify-between p-8">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors">
                Privacy Policy
             </button>
             <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors">
                Deactivate Account
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
