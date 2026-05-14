import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { ChevronDown, Shield, User, GraduationCap, Briefcase, Settings } from 'lucide-react';

const ROLE_ICONS: Record<UserRole, any> = {
  student: GraduationCap,
  lecturer: Briefcase,
  staff: User,
  admin: Shield,
  global_admin: Settings
};

export default function RoleSwitcher() {
  const { user, setUser } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null;

  // In a real app, this would come from Entra ID groups
  const availableRoles: UserRole[] = ['student', 'lecturer', 'staff', 'admin', 'global_admin'];

  const handleRoleChange = (role: UserRole) => {
    setUser({ ...user, role });
    setIsOpen(false);
  };

  const Icon = ROLE_ICONS[user.role] || User;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-200 hover:border-brand-indigo/30 transition-all shadow-sm group"
      >
        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-indigo transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Role</p>
          <p className="text-xs font-black text-slate-800 capitalize">{user.role.replace('_', ' ')}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-50"
            >
              <div className="px-4 py-3 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Switch Environment</p>
              </div>
              <div className="space-y-1">
                {availableRoles.map((role) => {
                  const RoleIcon = ROLE_ICONS[role];
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:bg-slate-50",
                        user.role === role ? "text-brand-indigo bg-indigo-50/50" : "text-slate-600"
                      )}
                    >
                      <RoleIcon className={cn("w-4 h-4", user.role === role ? "text-brand-indigo" : "text-slate-400")} />
                      <span className="capitalize">{role.replace('_', ' ')}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
