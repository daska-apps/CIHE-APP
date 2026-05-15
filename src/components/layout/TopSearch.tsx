import React, { useState, useEffect, useRef } from 'react';
import { Search, Book, LifeBuoy, ChevronRight, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UNIT_TITLES } from '../../lib/timetableData';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SearchResult {
  id: string;
  type: 'unit' | 'service';
  title: string;
  description: string;
  path: string;
}

const CAMPUS_SERVICES = [
  // Internal Navigation
  { id: 'dashboard', title: 'Dashboard', description: 'Overview of your current academic status and performance.', path: '/' },
  { id: 'attendance', title: 'Attendance', description: 'Log your attendance or check check-in history.', path: '/attendance' },
  { id: 'roll-call', title: 'Master Roll Call', description: 'Detailed attendance records and sync statistics.', path: '/roll-call' },
  { id: 'timetable', title: 'Timetable', description: 'Weekly class schedule and room allocations.', path: '/timetable' },
  { id: 'finance', title: 'Finance & Fees', description: 'Statements, payments, and financial documentation.', path: '/finance' },
  { id: 'support', title: 'Academic Support', description: 'Helpdesk, wellbeing, and learning resources.', path: '/support' },
  { id: 'forms', title: 'Applications & Forms', description: 'Submit student requests and formal documentation.', path: '/forms' },
  
  // External & Campus Services
  { id: 'ict-help', title: 'ICT Helpdesk', description: 'Technical support for students and staff.', path: '/support' },
  { id: 'wellbeing', title: 'Student Wellbeing', description: 'Counseling and mental health resources.', path: '/support' },
  { id: 'library', title: 'CIHE Library', description: 'Access academic journals, books, and study spaces.', path: 'https://cihe.edu.au/library' },
  { id: 'careers', title: 'Career Advice', description: 'Resume help, internship placements, and workshops.', path: '/support' },
  { id: 'registrar', title: 'Registrar Office', description: 'Enrolment, transcripts, and formal documentation.', path: '/forms' },
  { id: 'security', title: 'Campus Security', description: 'Emergency contact and safety protocols.', path: '/support' },
  { id: 'finance-office', title: 'Finance Department', description: 'Fee inquiries and payment plans.', path: '/finance' },
];

export default function TopSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchStr = query.toLowerCase();
    
    // Search Units
    const unitResults: SearchResult[] = [];
    Object.values(UNIT_TITLES)
      .filter(u => u.code.toLowerCase().includes(searchStr) || u.title.toLowerCase().includes(searchStr))
      .forEach(u => {
        // Add direct link to Moodle if available
        if (u.moodleUrl) {
          unitResults.push({
            id: `${u.code}-moodle`,
            type: 'unit',
            title: `${u.code} • Moodle`,
            description: `Access ${u.title} course materials.`,
            path: u.moodleUrl
          });
        }

        // Add direct link to Unit Guide if available
        if (u.guideUrl) {
          unitResults.push({
            id: `${u.code}-guide`,
            type: 'unit',
            title: `${u.code} • Unit Guide`,
            description: `View the official syllabus for ${u.title}.`,
            path: u.guideUrl
          });
        }

        // Fallback or generic info link
        if (!u.moodleUrl && !u.guideUrl) {
          unitResults.push({
            id: u.code,
            type: 'unit',
            title: u.code,
            description: u.title,
            path: '/courses'
          });
        }
      });

    // Search Services
    const serviceResults: SearchResult[] = CAMPUS_SERVICES
      .filter(s => s.title.toLowerCase().includes(searchStr) || s.description.toLowerCase().includes(searchStr))
      .map(s => ({
        id: s.id,
        type: 'service',
        title: s.title,
        description: s.description,
        path: s.path
      }));

    setResults([...unitResults, ...serviceResults]);
    setIsOpen(true);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    if (result.path.startsWith('http')) {
      window.open(result.path, '_blank');
    } else {
      navigate(result.path);
    }
  };

  return (
    <div className="relative group w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#003B95] transition-colors" />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search unit guides or campus services..."
          className="w-full bg-slate-50 border-transparent border-2 focus:border-[#003B95]/10 py-2.5 pl-12 pr-10 rounded-2xl text-sm font-medium outline-none transition-all"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 mt-3 bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-[#003B95]/10 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
          >
            <div className="p-2">
              <div className="px-4 py-3 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Search Results ({results.length})</span>
              </div>
              
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-all rounded-xl text-left group/item"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110",
                    result.type === 'unit' ? "bg-blue-50 text-[#003B95]" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {result.type === 'unit' ? <Book className="w-5 h-5" /> : <LifeBuoy className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800 tracking-tight truncate uppercase">{result.title.split(' • ')[0]}</span>
                      {result.title.includes(' • ') && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                          result.title.includes('Moodle') ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-[#003B95]"
                        )}>
                          {result.title.split(' • ')[1]}
                        </span>
                      )}
                      {result.path.startsWith('http') && <ExternalLink className="w-3 h-3 text-slate-300" />}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{result.description}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-200 group-hover/item:translate-x-1 group-hover/item:text-[#003B95] transition-all" />
                </button>
              ))}
            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Press enter to see all results</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
