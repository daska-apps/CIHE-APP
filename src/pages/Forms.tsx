import React from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Download, Search, Filter, ShieldCheck, Printer } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

const DIGITAL_FORMS = [
  { id: 'FRM-001', name: 'Application for Special Consideration', status: 'Approved', date: '10 Oct 2025', type: 'Academic' },
  { id: 'FRM-002', name: 'Change of Enrollment / Unit Withdrawal', status: 'Pending', date: '22 Oct 2025', type: 'Registry' },
  { id: 'FRM-003', name: 'Medical Certificate Submission', status: 'Action Required', date: '15 Oct 2025', type: 'Wellbeing' },
  { id: 'FRM-004', name: 'International Student Travel Request', status: 'Draft', date: 'N/A', type: 'Compliance' },
];

const COMPLIANCE_DOCS = [
  { name: 'Official Transcript (Unofficial)', size: '1.2 MB', ext: 'PDF' },
  { name: 'Confirmation of Enrolment (CoE)', size: '0.8 MB', ext: 'PDF' },
  { name: 'Student Visa Compliance Letter', size: '2.1 MB', ext: 'PDF' },
];

export default function Forms() {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo font-black text-[10px] uppercase tracking-widest">
            <FileText className="w-3 h-3" />
            Governance & TEQSA Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">Forms & Compliance</h1>
          <p className="text-slate-500 font-medium max-w-md">Official applications managed under the TEQSA Higher Education Standards Framework.</p>
        </div>

        <button className="px-6 py-3 bg-brand-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-brand-indigo/20">
          <FileText className="w-4 h-4" />
          New Application
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Requests */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Digital Submissions</h3>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-indigo transition-colors"><Search className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-brand-indigo transition-colors"><Filter className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5 border-b border-slate-100">Form Title</th>
                                <th className="px-8 py-5 border-b border-slate-100">Type</th>
                                <th className="px-8 py-5 border-b border-slate-100">Status</th>
                                <th className="px-8 py-5 border-b border-slate-100 text-right">Last Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {DIGITAL_FORMS.map((form, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-slate-800">{form.name}</div>
                                        <div className="text-[10px] font-mono font-black text-slate-300 uppercase mt-0.5">{form.id}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{form.type}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                                            form.status === 'Approved' ? "bg-emerald-50 text-emerald-700" :
                                            form.status === 'Action Required' ? "bg-rose-50 text-rose-700 font-bold animate-pulse" :
                                            form.status === 'Pending' ? "bg-amber-50 text-amber-700" :
                                            "bg-slate-100 text-slate-500"
                                        )}>
                                            {form.status === 'Approved' ? <CheckCircle className="w-3 h-3" /> :
                                             form.status === 'Action Required' ? <AlertCircle className="w-3 h-3" /> :
                                             <Clock className="w-3 h-3" />}
                                            {form.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-xs font-bold text-slate-400">{form.date}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Document Vault */}
        <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Document Vault</h3>
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Verified Vault</span>
                    </div>
                    
                    <div className="space-y-4">
                        {COMPLIANCE_DOCS.map((doc, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{doc.name}</h4>
                                    <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                                    <span>{doc.ext}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                        <Printer className="w-3.5 h-3.5" /> Request Paper Hardcopy
                    </button>
                </div>
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                 <h4 className="text-[10px] font-black text-brand-indigo uppercase tracking-widest mb-2">Legislative Framework</h4>
                 <p className="text-[11px] font-medium text-indigo-900/60 leading-relaxed">
                    Data is handled per the *Privacy Act 1988 (Cth)*. Digital signatures are legally binding under the *Electronic Transactions Act 1999*.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
}
