export type UserRole = 'student' | 'staff' | 'lecturer' | 'admin' | 'global_admin';

export interface ServiceTileConfig {
  id: string;
  name: string;
  icon: string;
  href: string;
  color: string;
  description: string;
  badgeKey?: string;
}

export const MESHED_PORTAL_BASE_URL = 'https://cihe.meshedhe.com.au/';

export const TILES: Record<UserRole, ServiceTileConfig[]> = {
  student: [
    { id: 'moodle', name: 'Moodle', icon: 'BookOpen', href: 'https://moodle.cihe.edu.au', color: 'bg-[#f47b20]', description: 'Course materials & assignments.', badgeKey: 'moodleDue' },
    { id: 'outlook', name: 'Outlook', icon: 'Mail', href: 'https://outlook.office.com', color: 'bg-[#0078d4]', description: 'CIHE Student Email.', badgeKey: 'unreadEmail' },
    { id: 'meshed', name: 'Meshed Portal', icon: 'Wifi', href: MESHED_PORTAL_BASE_URL, color: 'bg-[#f47b20]', description: 'Academic records & Wi-Fi.' },
    { id: 'surveys', name: 'Student Surveys', icon: 'ClipboardList', href: 'https://www.surveymonkey.com/r/cihe-student-feedback', color: 'bg-emerald-600', description: 'TEQSA Compliance feedback.' },
    { id: 'viva', name: 'Viva Engage', icon: 'Share2', href: 'https://engage.cloud.microsoft', color: 'bg-indigo-600', description: 'Social, events & photos.' },
    { id: 'lostfound', name: 'Lost & Found', icon: 'Search', href: '/support/lost-found', color: 'bg-slate-400', description: 'Report or find lost items.' },
    { id: 'attendance', name: 'Attendance', icon: 'UserCheck', href: '/attendance', color: 'bg-indigo-600', description: 'Log session attendance.' },
    { id: 'timetable', name: 'Timetable', icon: 'Calendar', href: '/timetable', color: 'bg-indigo-500', description: 'Weekly class schedule.' },
    { id: 'support', name: 'Support Hub', icon: 'LifeBuoy', href: '/support', color: 'bg-rose-500', description: 'IT & Academic help.' },
  ],
  staff: [
    { id: 'roll_call', name: 'Roll Call', icon: 'Users', href: '/roll-call', color: 'bg-brand-indigo', description: 'Institutional Student List.' },
    { id: 'outlook', name: 'Staff Mail', icon: 'Mail', href: 'https://outlook.office.com', color: 'bg-[#0078d4]', description: 'Corporate communications.' },
    { id: 'teams', name: 'Teams', icon: 'MessageSquare', href: 'https://teams.microsoft.com', color: 'bg-[#4b53bc]', description: 'Internal staff chat.' },
    { id: 'jira', name: 'Jira Service', icon: 'LifeBuoy', href: 'https://cihe.atlassian.net', color: 'bg-[#f47b20]', description: 'Support tickets.' },
    { id: 'meshed', name: 'Meshed Staff', icon: 'Wifi', href: MESHED_PORTAL_BASE_URL, color: 'bg-[#f47b20]', description: 'Administrative records.' },
  ],
  lecturer: [
    { id: 'roll_call', name: 'Roll Call', icon: 'Users', href: '/roll-call', color: 'bg-brand-indigo', description: 'Institutional Student List.' },
    { id: 'moodle_admin', name: 'Moodle LMS', icon: 'BookOpen', href: 'https://moodle.cihe.edu.au', color: 'bg-[#f47b20]', description: 'Grading & content.' },
    { id: 'attendance_mgr', name: 'Attendance', icon: 'Users', href: '/attendance', color: 'bg-indigo-600', description: 'Class roll call.', badgeKey: 'toMark' },
    { id: 'timetable', name: 'Schedule', icon: 'Calendar', href: '/timetable', color: 'bg-indigo-500', description: 'Teaching sessions.' },
    { id: 'meshed', name: 'Meshed Lecturer', icon: 'Wifi', href: MESHED_PORTAL_BASE_URL, color: 'bg-[#f47b20]', description: 'Student management.' },
  ],
  admin: [
    { id: 'entra_admin', name: 'Identity Hub', icon: 'Key', href: 'https://entra.microsoft.com', color: 'bg-slate-900', description: 'Microsoft Entra ID.' },
    { id: 'meshed_admin', name: 'Meshed Admin', icon: 'ShieldCheck', href: MESHED_PORTAL_BASE_URL, color: 'bg-emerald-700', description: 'Roll-level control.' },
    { id: 'portal_config', name: 'Portal Config', icon: 'Settings', href: '#', color: 'bg-brand-indigo', description: 'UI & Policy engine.' },
  ],
  global_admin: [
    { id: 'entra_root', name: 'Entra Root', icon: 'ShieldAlert', href: 'https://entra.microsoft.com', color: 'bg-black', description: 'Global directory access.' },
    { id: 'meshed_root', name: 'Meshed Full', icon: 'Cpu', href: MESHED_PORTAL_BASE_URL, color: 'bg-rose-900', description: 'Root academic access.' },
    { id: 'azure_portal', name: 'Azure Resource', icon: 'Cloud', href: 'https://portal.azure.com', color: 'bg-sky-700', description: 'Cloud infrastructure.' },
    { id: 'audit_logs', name: 'Audit Trails', icon: 'ScrollText', href: '#', color: 'bg-gray-800', description: 'System-wide telemetry.' },
  ],
};

export const MOCKED_BADGES: Record<string, number> = {
  moodleDue: 3,
  unreadEmail: 12,
  toMark: 5
};
