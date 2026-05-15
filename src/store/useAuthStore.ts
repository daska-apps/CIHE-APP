import { create } from 'zustand';
import { UserRole } from '../lib/constants';
import { TIMETABLE_A, TIMETABLE_B, ALL_STUDENTS } from '../lib/timetableData';

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    groups: string[];
  } | null;
  timetableVersion: 'A' | 'B';
  isAuthenticated: boolean;
  darkMode: boolean;
  login: (credential: string) => void;
  logout: () => void;
  setUser: (user: AuthState['user']) => void;
  setRole: (role: UserRole) => void;
  setTimetableVersion: (version: 'A' | 'B') => void;
  setDarkMode: (dark: boolean) => void;
}

// Read initial dark mode from localStorage / DOM
const initDark = (() => {
  const saved = localStorage.getItem('cihe-dark-mode');
  return saved ? saved === 'true' : document.documentElement.classList.contains('dark');
})();

// Immediately apply so there's no flash on load
if (initDark) document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  timetableVersion: 'A',
  darkMode: initDark,
  login: (credential) => {
    // Detect student ID format (e.g. CIHE21351)
    const isStudentId = ALL_STUDENTS.includes(credential.toUpperCase());
    
    let email = credential;
    let role: UserRole = 'student';
    const groups: string[] = [];

    if (isStudentId) {
      email = `${credential.toLowerCase()}@cihe.edu.au`;
    } else {
      if (email.includes('admin')) {
        role = 'admin';
        groups.push('cihe-admin-group');
      }
      if (email.includes('global')) {
        role = 'global_admin';
        groups.push('cihe-it-manager', 'cihe-global-admin');
      }
      if (email.includes('teacher') || email.includes('lecturer')) {
        role = 'lecturer';
        groups.push('cihe-lecturer-group');
      }
      if (email.includes('staff')) {
        role = 'staff';
        groups.push('cihe-staff-group');
      }
    }

    set({
      isAuthenticated: true,
      user: {
        id: isStudentId ? credential.toUpperCase() : Math.random().toString(36).substr(2, 9),
        name: isStudentId ? `Student ${credential}` : email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        email,
        role,
        groups
      }
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role } : null
  })),
  setTimetableVersion: (version) => set({ timetableVersion: version }),
  setDarkMode: (dark) => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('cihe-dark-mode', String(dark));
    set({ darkMode: dark });
  },
}));
