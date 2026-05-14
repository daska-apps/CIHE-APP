import React from 'react';
import { motion } from 'motion/react';
import { LifeBuoy, Mail, Phone, MessageSquare, ExternalLink, Shield, FileText, Smartphone, Search, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const SUPPORT_CARDS = [
  { 
    title: 'International Support', 
    desc: 'Visa compliance, ESOS framework guidance, and Overseas Student Health Cover (OSHC) support.',
    icon: Shield,
    email: 'international@cihe.edu.au',
    phone: '02 9900 1100',
    color: 'bg-indigo-900'
  },
  { 
    title: 'Student Services', 
    desc: 'Enrolment, Graduation under AQF standards, and official USI/TEQSA documentation.',
    icon: FileText,
    email: 'students@cihe.edu.au',
    phone: '02 8765 4321',
    color: 'bg-emerald-600'
  },
  { 
    title: 'Academic Success', 
    desc: 'Unit guide assistance, learning resources, and assessment feedback loops for trimesters.',
    icon: Smartphone,
    email: 'academics@cihe.edu.au',
    phone: '02 4455 6677',
    color: 'bg-amber-600'
  },
  { 
    title: 'Wellbeing & Mentoring', 
    desc: 'Confidential counseling and accessibility support per the Disability Standards for Education.',
    icon: LifeBuoy,
    email: 'wellbeing@cihe.edu.au',
    phone: '02 9900 8877',
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              city: 'North Sydney', 
              address: 'Level 4, 11-17 Atchison St, North Sydney NSW 2060', 
              amenities: ['Library', 'Student Lounge', 'L4 Kitchen', 'Computer Labs'],
              image: 'https://images.unsplash.com/photo-1540339832862-4745a9805a3b?auto=format&fit=crop&q=80&w=1200'
            },
            { 
              city: 'Perth Campus', 
              address: '677 Murray St, West Perth WA 6005', 
              amenities: ['New Facilities', 'Teaching Labs', 'Study Spaces'],
              image: 'https://images.unsplash.com/photo-1517502884422-41eaadeff171?auto=format&fit=crop&q=80&w=1200'
            }
          ].map((campus, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group hover:border-brand-indigo/30 transition-all"
            >
                <div className="aspect-[21/9] relative overflow-hidden">
                    <img src={campus.image} alt={campus.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-6 left-8">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Institutional Location</p>
                        <h4 className="text-2xl font-display font-black text-white leading-none">{campus.city}</h4>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-indigo dark:text-indigo-400 shrink-0" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{campus.address}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {campus.amenities.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
          ))}
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
