import React from 'react';
import { motion } from 'motion/react';
import { LifeBuoy, Mail, Phone, MessageSquare, ExternalLink, Shield, FileText, Smartphone, Search, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const SUPPORT_CARDS = [
  {
    title: 'Admissions',
    desc: 'Enrolment queries, course applications, RPL credit, FEE-HELP, and intake information.',
    icon: FileText,
    email: 'admissions@cihe.edu.au',
    phone: '1300 171 094',
    color: 'bg-indigo-900'
  },
  {
    title: 'Student Services',
    desc: 'Graduations under AQF standards, official USI/TEQSA documentation, and census dates.',
    icon: Shield,
    email: 'students@cihe.edu.au',
    phone: '1300 171 094',
    color: 'bg-emerald-600'
  },
  {
    title: 'IT Support',
    desc: 'Moodle access, Microsoft Entra ID issues, portal troubleshooting, and device management.',
    icon: Smartphone,
    email: 'it.support@cihe.edu.au',
    phone: '1300 171 094',
    color: 'bg-amber-600'
  },
  {
    title: 'Wellbeing & Mentoring',
    desc: 'Confidential counselling, accessibility support, and Disability Standards for Education.',
    icon: LifeBuoy,
    email: 'students@cihe.edu.au',
    phone: '1300 171 094',
    color: 'bg-rose-500'
  }
];

export default function Support() {
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest">
            <LifeBuoy className="w-3 h-3" />
            Concierge
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">Support Hub</h1>
          <p className="text-slate-500 font-medium max-w-md">Connect with the departments managing campus infrastructure and student life.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUPPORT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-indigo/30 transition-all flex flex-col group h-full"
          >
            <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform", card.color)}>
              <card.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-black text-slate-800 dark:text-slate-100 mb-3">{card.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8 flex-1">{card.desc}</p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800 overflow-hidden">
              <a href={`mailto:${card.email}`} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight text-slate-400 hover:text-brand-indigo transition-colors group/link">
                 <Mail className="w-4 h-4 shrink-0 text-slate-300 dark:text-slate-700 group-hover/link:text-brand-indigo" /> 
                 <span className="break-all">{card.email}</span>
              </a>
              <a href={`tel:${card.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight text-slate-400 hover:text-brand-indigo transition-colors group/link">
                 <Phone className="w-4 h-4 shrink-0 text-slate-300 dark:text-slate-700 group-hover/link:text-brand-indigo" /> 
                 <span className="break-all">{card.phone}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lost & Found Enquiry Section */}
      <motion.div 
        id="lost-found"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm p-12"
      >
        <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 space-y-4">
                <div className="w-16 h-16 bg-slate-900 dark:bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Search className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-display font-black text-slate-800 dark:text-white">Lost & Found Enquiry</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Misplaced something on campus? Complete this digital enquiry. Items are held at the Level 4 Reception for 30 days.
                </p>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reception Hours</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Mon - Fri • 9:00 AM - 5:00 PM</p>
                </div>
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 rounded-[2rem] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Description</label>
                        <input type="text" placeholder="e.g. Silver Laptop, Blue Wallet" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors dark:text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Lost</label>
                        <input type="text" placeholder="e.g. Level 4 Kitchen, Room H01" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors dark:text-white" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Details</label>
                    <textarea rows={3} placeholder="Any identifying marks or specific time lost..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors resize-none dark:text-white" />
                </div>
                <button className="w-full md:w-auto px-12 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Submit Enquiry <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
      </motion.div>

      {/* Campus Directory */}
      <div>
        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6">Our Campuses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              city: 'North Sydney (Main)',
              state: 'NSW',
              address: '116 Pacific Highway, North Sydney NSW 2060',
              also: 'Also: Level 5/213 Miller Street, North Sydney',
              amenities: ['Library', 'Student Lounge', 'Computer Labs', 'Study Spaces'],
              image: '/images/class.jpg',
              fallback: 'from-indigo-800 to-indigo-600',
            },
            {
              city: 'Sydney CBD',
              state: 'NSW',
              address: 'Level 11/307 Pitt Street, Sydney NSW 2000',
              also: 'Also: 2 Woodville Street, Hurstville NSW 2220',
              amenities: ['Teaching Labs', 'Group Rooms', 'CBD Location'],
              image: '/images/this.jpg',
              fallback: 'from-sky-800 to-sky-600',
            },
            {
              city: 'Canberra (ACT)',
              state: 'ACT',
              address: 'Level 1/5 Fussell Lane, Gungahlin ACT 2912',
              also: 'Also: Level 4/40 Cameron Ave, Belconnen | 118 Lysaght St, Mitchell',
              amenities: ['3 ACT Locations', 'Study Spaces', 'Student Services'],
              image: '/images/class.jpg',
              fallback: 'from-emerald-800 to-emerald-600',
            },
            {
              city: 'West Perth',
              state: 'WA',
              address: '1325 Hay Street, West Perth WA 6005',
              also: 'Opened Semester 1, 2026 — Early Childhood Education focus',
              amenities: ['New Facilities', 'Early Childhood Specialisation', 'Teaching Labs'],
              image: '/images/this.jpg',
              fallback: 'from-amber-800 to-amber-600',
            },
          ].map((campus, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group hover:border-brand-indigo/30 transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${campus.fallback}`} />
                <img src={campus.image} alt={campus.city} className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute bottom-5 left-7 flex items-end justify-between w-full pr-7">
                  <div>
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-0.5">CIHE Campus</p>
                    <h4 className="text-xl font-display font-black text-white leading-none">{campus.city}</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[9px] font-black text-white uppercase tracking-widest">{campus.state}</span>
                </div>
              </div>
              <div className="p-7 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-indigo dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{campus.address}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 leading-snug">{campus.also}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {campus.amenities.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Assistant Callout */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-indigo mb-6">
                    <MessageSquare className="w-3 h-3" /> Intelligent Search
                </div>
                <h2 className="text-3xl font-display font-black mb-4">Need immediate answers?</h2>
                <p className="text-white/60 font-medium">
                    The CIHE AI Assistant can help you with Wi-Fi passwords, Moodle login issues, and unit guide locations instantly.
                </p>
            </div>
            <div className="shrink-0 flex items-center gap-6">
                 <button 
                  onClick={() => {
                    const assistantBtn = document.querySelector('button[class*="fixed bottom-8 right-8"]') as HTMLButtonElement;
                    if (assistantBtn) assistantBtn.click();
                  }}
                  className="px-8 py-4 bg-brand-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-indigo/10"
                 >
                     Open Assistant
                 </button>
            </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-indigo/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
