import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

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
  const { user } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [mfa, setMfa] = useState(false);

  // Toggle dark mode classes
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
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
              onClick={toggleDarkMode}
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
              value="Get alerts for classes and news"
              toggle
              isToggled={notifications}
              onClick={() => setNotifications(!notifications)}
            />
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
