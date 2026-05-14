import React from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, QrCode, MapPin, Calendar, Clock, BadgeCheck, ArrowUpRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';

export default function DigitalID() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto space-y-8 pb-12 pt-4">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-display font-black text-slate-800 tracking-tight">Digital Identity</h1>
        <p className="text-slate-500 font-medium">Verify your enrollment at CIHE Campus.</p>
      </header>

      {/* ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative aspect-[1/1.58] w-full bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col group"
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-indigo/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        {/* Card Header */}
        <div className="relative z-10 p-8 border-b border-white/10 flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Institution</span>
                <span className="text-lg font-display font-black text-white tracking-tighter">CIHE Portal</span>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Shield className="w-5 h-5 text-indigo-400" />
            </div>
        </div>

        {/* User Info Section */}
        <div className="relative z-10 p-8 flex-1 flex flex-col items-center text-center">
            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 p-1 group-hover:border-brand-indigo/50 transition-colors">
                    <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center font-black text-4xl text-white/20">
                        {user.name.charAt(0)}
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-brand-indigo rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                    <BadgeCheck className="w-4 h-4 text-white" />
                </div>
            </div>

            <h2 className="text-2xl font-display font-black text-white mb-1 tracking-tight">{user.name}</h2>
            <div className="px-4 py-1.5 bg-brand-indigo/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-indigo mb-8 border border-brand-indigo/30">
                {user.role === 'student' ? 'Undergraduate' : user.role === 'lecturer' ? 'Academic Lecturer' : 'Staff Member'}
            </div>

            <div className="grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-8">
                <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">USI (Verified)</p>
                    <p className="text-sm font-mono font-bold text-white uppercase">ABC123XYZ9</p>
                </div>
                <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">CRICOS / TEQSA</p>
                    <p className="text-sm font-mono font-bold text-white uppercase">03852H | PRV14312</p>
                </div>
            </div>
        </div>

        {/* QR Code Segment */}
        <div className="relative z-10 p-8 bg-white/5 backdrop-blur-xl border-t border-white/10 flex items-center gap-6">
             <div className="bg-white p-3 rounded-2xl shadow-xl">
                <QRCodeSVG 
                    value={`USER_ID:${user.id}|USI:ABC123XYZ9|CRICOS:03852H|VERIFIED:TRUE`}
                    size={64}
                    level="M"
                />
             </div>
             <div className="flex-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Digital USI Link</p>
                <p className="text-[10px] font-bold text-white/80 leading-relaxed">TEQSA Compliant Identity. Valid for campus and exam entry.</p>
             </div>
        </div>

        {/* Progress Bar indicator */}
        <div className="h-1 bg-white/5 relative overflow-hidden">
            <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: '100%' }}
               transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-brand-indigo to-transparent"
            />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            <p className="text-[9px] font-black uppercase text-slate-400">Campus</p>
            <p className="text-xs font-bold text-slate-800">North Sydney</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <p className="text-[9px] font-black uppercase text-slate-400">Semester</p>
            <p className="text-xs font-bold text-slate-800">Spring 2026</p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-center gap-4 group cursor-pointer hover:bg-indigo-100 transition-all">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-indigo shadow-sm group-hover:scale-110 transition-transform">
             <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Auto Access</p>
              <h4 className="text-sm font-bold text-indigo-900">Add to Apple Wallet</h4>
          </div>
          <ArrowUpRight className="w-4 h-4 text-brand-indigo" />
      </div>
    </div>
  );
}
