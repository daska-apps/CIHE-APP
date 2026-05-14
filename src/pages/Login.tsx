import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Logo from '../components/ui/Logo';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

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
      {/* Visual Side */}
      <div className="hidden lg:flex w-5/12 bg-[#003B95] p-20 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-4 shadow-2xl">
               <Logo variant="blue" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-4xl tracking-tight leading-none uppercase">CIHE</span>
              <span className="text-[11px] text-white/50 uppercase tracking-[0.3em] font-black mt-2">Crown Institute</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-7xl font-display font-black leading-[0.95] tracking-tighter">
              Empowering<br />Your <span className="text-white/60">Future</span><br />Path.
            </h1>
          </motion.div>
          <p className="text-white/70 text-xl max-w-sm font-medium leading-relaxed">
            The intelligent gateway to your academic excellence at CIHE. Stay connected to your studies, anytime, anywhere.
          </p>
          <div className="flex gap-4">
             <div className="h-1 w-20 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-white w-full"
                />
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          <span>&copy; 2026 CIHE Australia</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <a href="#" className="hover:text-white transition-colors">Governance</a>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>

        {/* Brand Graphics */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L100 0 L100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[120px]" />
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
