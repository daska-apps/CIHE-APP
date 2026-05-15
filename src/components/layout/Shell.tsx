import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  User,
  Bell,
  Search,
  Calendar,
  LifeBuoy,
  BookOpen,
  Settings,
  GraduationCap,
  CreditCard,
  Shield,
  FileText,
  Users,

  Moon,
  Sun,
  Megaphone
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import RoleSwitcher from '../home/RoleSwitcher';
import Logo from '../ui/Logo';
import TopSearch from './TopSearch';
import NotificationsPanel from './NotificationsPanel';
import SupportAssistant from '../assistant/SupportAssistant';
import { isPushSupported, subscribeToPush, getCurrentPermission } from '../../lib/pushNotifications';

interface ShellProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, isActive, badge }: { to: string; icon: any; label: string; isActive: boolean; badge?: number }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm group",
        isActive
          ? "bg-brand-indigo dark:bg-indigo-600 text-white shadow-lg shadow-brand-indigo/20 scale-[1.02]"
          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-indigo dark:hover:text-indigo-400"
      )}
    >
      <div className="relative flex-shrink-0">
        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-indigo dark:group-hover:text-indigo-400")} />
        {badge != null && badge > 0 && !isActive && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 leading-none">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && !isActive && (
        <span className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded-lg">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default function Shell({ children }: ShellProps) {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { darkMode, setDarkMode } = useAuthStore();
  const [pushBannerVisible, setPushBannerVisible] = React.useState(false);
  const [pushStatus, setPushStatus] = React.useState<'idle'|'subscribing'|'done'>('idle');
  // Badge counts — fetched once on mount; refresh when user changes
  const [announcementBadge, setAnnouncementBadge] = React.useState(0);
  const [attendanceBadge, setAttendanceBadge] = React.useState(0);

  // Show push prompt once per session if not yet granted
  React.useEffect(() => {
    if (!user || !isPushSupported()) return;
    const already = localStorage.getItem('cihe-push-dismissed');
    if (!already && getCurrentPermission() === 'default') {
      setTimeout(() => setPushBannerVisible(true), 3000);
    }
  }, [user]);

  // Load badge counts
  React.useEffect(() => {
    if (!user) return;
    fetch('/api/announcements')
      .then(r => r.json())
      .then((data: any[]) => {
        // Count pinned/urgent as "unread" proxy
        const urgent = data.filter(a => a.type === 'urgent' || a.pinned).length;
        setAnnouncementBadge(urgent);
      })
      .catch(() => {});
    // Attendance: flag if student has any absent records
    if (user.role === 'student') {
      fetch('/api/attendance')
        .then(r => r.json())
        .then((data: any[]) => {
          const flagged = data.filter(a => a.studentId === user.id && a.status === 'absent').length;
          setAttendanceBadge(flagged);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleEnablePush = async () => {
    setPushStatus('subscribing');
    const ok = await subscribeToPush(user?.id || 'anonymous');
    setPushStatus('done');
    setPushBannerVisible(false);
    localStorage.setItem('cihe-push-dismissed', '1');
    if (!ok) console.warn('[CIHE] Push subscription failed or denied');
  };

  const dismissPushBanner = () => {
    setPushBannerVisible(false);
    localStorage.setItem('cihe-push-dismissed', '1');
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500">
      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 transition-transform duration-300 transform lg:translate-x-0 hidden lg:block">
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-[#003B95] dark:bg-indigo-600 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-indigo-100/50 dark:shadow-none">
               <Logo variant="white" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-3xl tracking-tighter text-slate-800 dark:text-white leading-none">CIHE</span>
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-[#003B95] dark:text-indigo-400 mt-1.5 opacity-60">Sydney • Canberra • Perth</span>
            </div>
          </div>

            <nav className="flex-1 space-y-1">
              <NavItem to="/" icon={LayoutDashboard} label="Dashboard" isActive={location.pathname === "/"} />
              <NavItem to="/courses" icon={BookOpen} label="Unit Guides" isActive={location.pathname === "/courses"} />
              <NavItem to="/timetable" icon={Calendar} label="Timetable" isActive={location.pathname === "/timetable"} />
              <NavItem to="/results" icon={GraduationCap} label="Academic Record" isActive={location.pathname === "/results"} />
              {user?.role === 'student' && (
                <NavItem to="/finance" icon={CreditCard} label="Finance" isActive={location.pathname === "/finance"} />
              )}
              <NavItem to="/attendance" icon={UserCheck} label="Attendance" isActive={location.pathname === "/attendance"} badge={attendanceBadge} />
              {['lecturer', 'staff', 'admin', 'global_admin'].includes(user?.role || '') && (
                <NavItem to="/roll-call" icon={Users} label="Roll Call" isActive={location.pathname === "/roll-call"} />
              )}
              <NavItem to="/announcements" icon={Megaphone} label="Announcements" isActive={location.pathname === "/announcements"} badge={announcementBadge} />
              <NavItem to="/forms" icon={FileText} label="Forms & Requests" isActive={location.pathname === "/forms"} />
              <NavItem to="/digital-id" icon={Shield} label="Digital ID" isActive={location.pathname === "/digital-id"} />
              <NavItem to="/support" icon={LifeBuoy} label="Support Hub" isActive={location.pathname === "/support"} />
              <NavItem to="/settings" icon={Settings} label="Settings" isActive={location.pathname === "/settings"} />
            </nav>

          <div className="pt-8 mt-8 border-t border-slate-50 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-1 opacity-20 hover:opacity-100 transition-opacity">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                CIHE Smart Portal &bull; v2.4.0
            </p>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Designed by Anthony Daskalakis
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72 min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-8 flex-1">
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
             >
               {isMobileMenuOpen ? <X /> : <Menu />}
             </button>

             <div className="hidden md:flex flex-1">
                <TopSearch />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-400 hover:text-brand-indigo hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {['admin', 'global_admin', 'staff'].includes(user?.role || '') && (
              <div className="hidden sm:block">
                <RoleSwitcher />
              </div>
            )}
            
            <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "relative p-2 rounded-xl transition-all",
                  isNotificationsOpen ? "bg-indigo-50 text-[#003B95]" : "text-slate-400 hover:text-[#003B95] hover:bg-slate-50"
                )}
              >
                <Bell className={cn("w-5 h-5", isNotificationsOpen && "fill-[#003B95]/10")} />
                {!isNotificationsOpen && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />}
              </button>
              
              <div 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1.5 pr-4 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md hover:border-brand-indigo/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-indigo dark:bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md group-hover:scale-105 transition-transform">
                   {user?.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 leading-none truncate max-w-[100px]">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role === 'student' ? 'S' : 'E'}{user?.id.slice(-4)}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-12 pb-28 lg:pb-12 max-w-7xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Push notification opt-in banner */}
              <AnimatePresence>
                {pushBannerVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="mb-6 flex items-center justify-between gap-4 bg-brand-indigo text-white px-6 py-4 rounded-[2rem] shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-indigo-200 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-black">Enable push notifications</p>
                        <p className="text-[11px] text-indigo-200 font-medium">Get alerts for new classes, announcements and attendance reminders.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={handleEnablePush}
                        disabled={pushStatus === 'subscribing'}
                        className="px-4 py-2 bg-white text-brand-indigo text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-60"
                      >
                        {pushStatus === 'subscribing' ? 'Enabling…' : 'Enable'}
                      </button>
                      <button
                        onClick={dismissPushBanner}
                        className="p-2 text-indigo-300 hover:text-white transition-colors"
                        aria-label="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <SupportAssistant />

      {/* ── Mobile Bottom Nav Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex items-stretch pb-safe">
        {[
          { to: '/',             icon: LayoutDashboard, label: 'Home',       badge: 0 },
          { to: '/timetable',    icon: Calendar,        label: 'Timetable',  badge: 0 },
          { to: '/attendance',   icon: UserCheck,       label: 'Attendance', badge: attendanceBadge },
          { to: '/announcements',icon: Megaphone,       label: 'Alerts',     badge: announcementBadge },
          { to: '/settings',     icon: Settings,        label: 'Settings',   badge: 0 },
        ].map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 relative transition-colors",
                isActive ? "text-brand-indigo dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-indigo dark:bg-indigo-400 rounded-full"
                />
              )}
              <div className="relative">
                <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-rose-500 text-white text-[7px] font-black rounded-full flex items-center justify-center px-0.5">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider transition-all",
                isActive ? "text-brand-indigo dark:text-indigo-400" : "text-slate-400"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#003B95] dark:bg-indigo-600 rounded-xl flex items-center justify-center p-2 shadow-lg">
                      <Logo variant="white" className="w-full h-full" />
                    </div>
                    <span className="font-display font-black text-3xl tracking-tighter text-slate-800 dark:text-white uppercase">CIHE</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-4">
                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" isActive={location.pathname === "/"} />
                <NavItem to="/courses" icon={BookOpen} label="Unit Guides" isActive={location.pathname === "/courses"} />
                <NavItem to="/timetable" icon={Calendar} label="Timetable" isActive={location.pathname === "/timetable"} />
                <NavItem to="/results" icon={GraduationCap} label="Academic Record" isActive={location.pathname === "/results"} />
                <NavItem to="/forms" icon={FileText} label="Forms" isActive={location.pathname === "/forms"} />
                {user?.role === 'student' && (
                  <NavItem to="/finance" icon={CreditCard} label="Finance" isActive={location.pathname === "/finance"} />
                )}
                <NavItem to="/attendance" icon={UserCheck} label="Attendance" isActive={location.pathname === "/attendance"} badge={attendanceBadge} />
                {['lecturer', 'staff', 'admin', 'global_admin'].includes(user?.role || '') && (
                  <NavItem to="/roll-call" icon={Users} label="Roll Call" isActive={location.pathname === "/roll-call"} />
                )}
                <NavItem to="/announcements" icon={Megaphone} label="Announcements" isActive={location.pathname === "/announcements"} badge={announcementBadge} />
                <NavItem to="/digital-id" icon={Shield} label="Digital ID" isActive={location.pathname === "/digital-id"} />
                <NavItem to="/support" icon={LifeBuoy} label="Support Hub" isActive={location.pathname === "/support"} />
                <NavItem to="/profile" icon={Settings} label="Governance" isActive={location.pathname === "/profile"} />
                
                {['admin', 'global_admin', 'staff'].includes(user?.role || '') && (
                  <div className="pt-4 border-t border-slate-50">
                      <RoleSwitcher />
                  </div>
                )}

                <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-sm font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-2xl">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
