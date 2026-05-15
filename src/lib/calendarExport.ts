// CIHE Portal — iCal / calendar export helpers
import { ClassSession, UNIT_TITLES } from './timetableData';

const SLOT_TIMES: Record<string, { start: string; end: string }> = {
  m: { start: '0815', end: '1115' },
  n: { start: '1145', end: '1445' },
  a: { start: '1515', end: '1815' },
  e: { start: '1830', end: '2130' },
};

const DAY_TO_WEEKDAY: Record<string, number> = {
  Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5,
};

/** Returns the next date (YYYYMMDD) for a given weekday (1=Mon…5=Fri) */
function nextWeekdayDate(weekday: number): string {
  const today = new Date();
  const todayDay = today.getDay() === 0 ? 7 : today.getDay(); // Sun=7
  let diff = weekday - todayDay;
  if (diff <= 0) diff += 7;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function campusLabel(room: string): string {
  if (room.startsWith('A1')) return 'ACT01 Gungahlin, Canberra';
  if (room.startsWith('A2')) return 'ACT02 Belconnen, Canberra';
  if (room.startsWith('A3')) return 'ACT03 Mitchell, Canberra';
  if (room.startsWith('W'))  return '1325 Hay St, West Perth WA 6005';
  if (room.startsWith('P'))  return 'Level 11, 307 Pitt St, Sydney CBD';
  if (room.startsWith('H'))  return '2 Woodville St, Hurstville NSW 2220';
  if (room.startsWith('NS')) return '116 Pacific Hwy, North Sydney';
  return 'Level 5, 213 Miller St, North Sydney';
}

function escape(str: string): string {
  return str.replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
}

export function generateIcal(sessions: ClassSession[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CIHE Portal//Academic Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:CIHE Timetable',
    'X-WR-TIMEZONE:Australia/Sydney',
  ];

  for (const s of sessions) {
    const times = SLOT_TIMES[s.slot];
    if (!times) continue;
    const weekday = DAY_TO_WEEKDAY[s.day];
    if (!weekday) continue;
    const dateStr = nextWeekdayDate(weekday);
    const info = UNIT_TITLES[s.unitCode] || { code: s.unitCode, title: 'Class', tutor: '' };
    const uid = `${s.unitCode}-${s.day}-${s.slot}-${s.room}@cihe.edu.au`;
    const location = `Room ${s.room} — ${campusLabel(s.room)}`;
    const description = `Unit: ${info.code}\\nTutor: ${info.tutor}\\nRoom: ${s.room}\\nPortal: https://cihe.edu.au`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${dateStr}T${times.start}00`,
      `DTEND:${dateStr}T${times.end}00`,
      `SUMMARY:${escape(`${info.code}: ${info.title}`)}`,
      `LOCATION:${escape(location)}`,
      `DESCRIPTION:${escape(description)}`,
      `RRULE:FREQ=WEEKLY;COUNT=12`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcal(sessions: ClassSession[], filename = 'CIHE-Timetable.ics') {
  const ical = generateIcal(sessions);
  const blob = new Blob([ical], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Opens the Google Calendar "add event" URL for a single session */
export function addToGoogleCalendar(s: ClassSession) {
  const times = SLOT_TIMES[s.slot];
  if (!times) return;
  const weekday = DAY_TO_WEEKDAY[s.day];
  if (!weekday) return;
  const dateStr = nextWeekdayDate(weekday);
  const info = UNIT_TITLES[s.unitCode] || { code: s.unitCode, title: 'Class', tutor: '' };
  const text = encodeURIComponent(`${info.code}: ${info.title}`);
  const location = encodeURIComponent(`Room ${s.room} — ${campusLabel(s.room)}`);
  const details = encodeURIComponent(`Tutor: ${info.tutor}\nCIHE Portal`);
  const dates = `${dateStr}T${times.start}00/${dateStr}T${times.end}00`;
  window.open(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}&details=${details}&recur=RRULE:FREQ=WEEKLY;COUNT=12`,
    '_blank'
  );
}
