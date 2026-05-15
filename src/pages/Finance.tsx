import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Receipt, AlertCircle, CheckCircle, Download, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

const INVOICES = [
  { id: 'INV-2026-001', date: '12 May 2026', desc: 'Trimester 1 Tuition Fees', amount: 4850.00, status: 'paid' },
  { id: 'INV-2026-002', date: '14 May 2026', desc: 'Student Services & Amenities Fee', amount: 320.00, status: 'unpaid' },
  { id: 'INV-2025-098', date: '15 Dec 2025', desc: 'Trimester 3 Tuition Fees', amount: 4850.00, status: 'paid' },
];

export default function Finance() {
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest">
              <CreditCard className="w-3 h-3" />
              Treasury
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-brand-indigo dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
              <Lock className="w-2.5 h-2.5" /> Students Only
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight">Finances & Fees</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Manage tuition, HECS/FEE-HELP, and SA-HELP fees under Australian student loan regulations.</p>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-indigo dark:hover:bg-indigo-500 transition-all shadow-xl shadow-black/5">
            Pay Outstanding
          </button>
        </div>
      </header>

      {/* Financial Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-10"
          >
              <div className="text-center md:text-left space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outstanding Balance</p>
                  <p className="text-5xl font-display font-black text-slate-800 dark:text-white">$320.00</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      <AlertCircle className="w-3 h-3" /> Due in 4 days
                  </div>
              </div>
              <div className="h-px md:h-20 w-full md:w-px bg-slate-100 dark:bg-slate-800" />
              <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500 dark:text-slate-400">Academic Census Date</span>
                      <span className="font-black text-rose-600 dark:text-rose-400">31 May 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500 dark:text-slate-400">Government HELP Status</span>
                      <span className="inline-flex items-center gap-1.5 font-black text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-4 h-4" /> FEE-HELP & SA-HELP ACTIVE
                      </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500 dark:text-slate-400">Invoiced Currency</span>
                      <span className="font-black text-slate-800 dark:text-white">AUD (Australian Dollars)</span>
                  </div>
              </div>
          </motion.div>

          <div className="bg-brand-indigo rounded-[3rem] p-10 text-white relative overflow-hidden shadow-xl shadow-brand-indigo/20">
              <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                      <Receipt className="w-10 h-10 mb-6 opacity-40" />
                      <h4 className="text-xl font-display font-black mb-2">Secure Payments</h4>
                      <p className="text-white/60 text-xs font-medium leading-relaxed">
                          All financial transactions are processed via CIHE Secure Gateway with end-to-end encryption.
                      </p>
                  </div>
                  <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:translate-x-1 transition-transform">
                      Statement History <ExternalLink className="w-3 h-3" />
                  </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
      </div>

      {/* Invoice History */}
      <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4">Invoice History</h3>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Invoice ID</th>
                              <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Issue Date</th>
                              <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">Description</th>
                              <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 text-center">Status</th>
                              <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 text-right">Amount</th>
                              <th className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 text-right"></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                          {INVOICES.map((inv, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="px-8 py-5 font-mono text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase">{inv.id}</td>
                                  <td className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400">{inv.date}</td>
                                  <td className="px-8 py-5 text-sm font-bold text-slate-700 dark:text-slate-200">{inv.desc}</td>
                                  <td className="px-8 py-5 text-center">
                                      <span className={cn(
                                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5",
                                          inv.status === 'paid'
                                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                            : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                      )}>
                                          {inv.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                          {inv.status}
                                      </span>
                                  </td>
                                  <td className="px-8 py-5 text-right font-display font-black text-slate-800 dark:text-white">${inv.amount.toLocaleString()}</td>
                                  <td className="px-8 py-5 text-right">
                                      <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-brand-indigo hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-all">
                                          <Download className="w-4 h-4" />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
}
