import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Logo from '../components/ui/Logo';

const SLIDES = [
  {
    src: '/images/updated logo.png',
    caption: 'Crown Institute of Higher Education',
  },
  {
    src: '/images/class.jpg',
    caption: 'Campus Life',
  },
  {
    src: '/images/this.jpg',
    caption: 'Student Support',
  },
];

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [slideIndex, setSlideIndex] = React.useState(0);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate Entra OIDC flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    login(email);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* Visual Side — CIHE Campus Slideshow */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between text-white relative overflow-hidden">
        {/* Slideshow */}
        <AnimatePresence mode="sync">
          <motion.img
            key={slideIndex}
            src={SLIDES[slideIndex].src}
            alt={SLIDES[slideIndex].caption}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </AnimatePresence>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003B95]/80 via-[#003B95]/60 to-slate-900/95" />

        <div className="relative z-10 p-20">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-4 shadow-2xl">
               <Logo variant="blue" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-4xl tracking-tight leading-none uppercase">CIHE</span>
              <span className="text-[11px] text-white/60 uppercase tracking-[0.3em] font-black mt-2">Crown Institute</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-display font-black leading-[0.95] tracking-tighter">
              Real Skills.<br />Real Impact.<br /><span className="text-white/60">Meaningful</span><br />Careers.
            </h1>
          </motion.div>
          <p className="text-white/70 text-base max-w-sm font-medium leading-relaxed">
            8 campuses across Sydney, Canberra and Perth. 39 nationalities. One intelligent portal.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 pt-2">
            {[
              { value: '8', label: 'Campuses' },
              { value: '39', label: 'Countries' },
              { value: '370+', label: 'Industry Partners' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-display font-black text-white leading-none">{s.value}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots + caption */}
        <div className="relative z-10 px-20 pb-6 flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlideIndex(i)}
              className={`transition-all duration-300 rounded-full ${i === slideIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
              aria-label={s.caption}
            />
          ))}
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-white/40">
            {SLIDES[slideIndex].caption}
          </span>
        </div>

        <div className="relative z-10 p-20 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <span>&copy; 2026 CIHE Australia</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>ABN 22 611 573 301</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>TEQSA PRV14301</span>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-lg space-y-12">
          <div className="lg:hidden flex items-center justify-center gap-4 mb-12">
            <div className="w-14 h-14 bg-[#003B95] rounded-2xl flex items-center justify-center p-3 shadow-lg">
               <Logo variant="white" className="w-full h-full" />
            </div>
            <span className="font-display font-black text-3xl tracking-tight text-[#003B95]">CIHE</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter">Identity Portal.</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Sign in to CIHE using your Microsoft Entra ID account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Email or Student ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-[#003B95] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cihe.edu.au or Student ID"
                  className="block w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-slate-900 font-bold placeholder:text-slate-300 focus:bg-white focus:border-[#003B95]/20 focus:ring-4 focus:ring-[#003B95]/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Password</label>
                <a href="#" className="text-[10px] font-black text-[#003B95] hover:underline uppercase tracking-[0.2em]">Entra Help</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300" />
                </div>
                <input
                  type="password"
                  disabled
                  placeholder="Handled by Microsoft SSO"
                  className="block w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-slate-300 outline-none cursor-not-allowed italic"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#003B95] hover:bg-slate-900 text-white rounded-[2rem] py-6 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all shadow-2xl shadow-[#003B95]/20 disabled:opacity-50 hover:-translate-y-1 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying with Microsoft...</span>
                </div>
              ) : (
                <>
                  Connect with Microsoft
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Aliases */}
          <div className="pt-12 border-t border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                Verify Identity
             </p>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { email: 'CIHE231174', label: 'CIHE231174' },
                { email: 'CIHE21351', label: 'CIHE21351' },
                { email: 'CIHE231693', label: 'CIHE231693' },
                { email: 'staff@cihe.edu.au', label: 'Staff SSO' },
                { email: 'teacher@cihe.edu.au', label: 'Lecturer SSO' },
                { email: 'global@cihe.edu.au', label: 'Admin SSO' }
              ].map(alias => (
                <button 
                  key={alias.email}
                  type="button"
                  onClick={() => setEmail(alias.email)} 
                  className="px-4 py-3 bg-white border border-slate-100 text-[10px] font-black text-slate-500 rounded-2xl hover:border-[#003B95] hover:text-[#003B95] hover:bg-slate-50 transition-all shadow-sm"
                >
                  {alias.label}
                </button>
              ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
