import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Download,
  ShieldCheck, Printer, Plus, X, ChevronRight, Check, Circle,
  Send, User, Calendar, BookOpen, Stethoscope, Globe, Briefcase, ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

type FormStatus = 'Approved' | 'Pending' | 'Action Required' | 'Draft' | 'Rejected';
type FormType = 'Academic' | 'Registry' | 'Wellbeing' | 'Compliance' | 'Finance';

interface DigitalForm {
  id: string;
  name: string;
  status: FormStatus;
  date: string;
  type: FormType;
  submittedDate?: string;
  notes?: string;
  timeline: { step: string; date: string; done: boolean; active?: boolean }[];
}

const INITIAL_FORMS: DigitalForm[] = [
  {
    id: 'FRM-001',
    name: 'Application for Special Consideration',
    status: 'Approved',
    date: '10 Oct 2025',
    type: 'Academic',
    submittedDate: '8 Oct 2025',
    notes: 'Approved with 10-day extension for BIT102 assessment.',
    timeline: [
      { step: 'Submitted', date: '8 Oct', done: true },
      { step: 'Under Review', date: '9 Oct', done: true },
      { step: 'Approved', date: '10 Oct', done: true },
    ],
  },
  {
    id: 'FRM-002',
    name: 'Change of Enrolment / Unit Withdrawal',
    status: 'Pending',
    date: '22 Oct 2025',
    type: 'Registry',
    submittedDate: '22 Oct 2025',
    timeline: [
      { step: 'Submitted', date: '22 Oct', done: true },
      { step: 'Under Review', date: '', done: false, active: true },
      { step: 'Decision', date: '', done: false },
    ],
  },
  {
    id: 'FRM-003',
    name: 'Medical Certificate Submission',
    status: 'Action Required',
    date: '15 Oct 2025',
    type: 'Wellbeing',
    submittedDate: '12 Oct 2025',
    notes: 'Original certificate required — please upload or deliver to Student Services.',
    timeline: [
      { step: 'Submitted', date: '12 Oct', done: true },
      { step: 'Action Required', date: '15 Oct', done: true, active: true },
      { step: 'Verified', date: '', done: false },
    ],
  },
  {
    id: 'FRM-004',
    name: 'International Student Travel Request',
    status: 'Draft',
    date: 'Not submitted',
    type: 'Compliance',
    timeline: [
      { step: 'Draft', date: 'In progress', done: false, active: true },
      { step: 'Submit', date: '', done: false },
      { step: 'Approved', date: '', done: false },
    ],
  },
];

const COMPLIANCE_DOCS = [
  { name: 'Official Transcript (Unofficial)', size: '1.2 MB', ext: 'PDF' },
  { name: 'Confirmation of Enrolment (CoE)', size: '0.8 MB', ext: 'PDF' },
  { name: 'Student Visa Compliance Letter', size: '2.1 MB', ext: 'PDF' },
];

const FORM_TEMPLATES = [
  { id: 'special-consideration', name: 'Special Consideration', icon: BookOpen, type: 'Academic' as FormType, desc: 'Extension or deferral due to illness or circumstances' },
  { id: 'unit-withdrawal', name: 'Unit Withdrawal', icon: FileText, type: 'Registry' as FormType, desc: 'Withdraw from a unit before census date' },
  { id: 'medical-cert', name: 'Medical Certificate', icon: Stethoscope, type: 'Wellbeing' as FormType, desc: 'Submit documentation for absences or deferrals' },
  { id: 'travel-request', name: 'Travel Request', icon: Globe, type: 'Compliance' as FormType, desc: 'International student travel approval' },
  { id: 'name-change', name: 'Name / Details Change', icon: User, type: 'Registry' as FormType, desc: 'Update personal or contact details' },
  { id: 'leave-of-absence', name: 'Leave of Absence', icon: Calendar, type: 'Academic' as FormType, desc: 'Temporary suspension of enrolment' },
];

const STATUS_CONFIG: Record<FormStatus, { color: string; icon: any; bg: string }> = {
  'Approved':        { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle },
  'Pending':         { color: 'text-amber-700 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',     icon: Clock },
  'Action Required': { color: 'text-rose-700 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',         icon: AlertCircle },
  'Draft':           { color: 'text-slate-500 dark:text-slate-400',     bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',           icon: FileText },
  'Rejected':        { color: 'text-rose-700 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',         icon: X },
};

const TYPE_COLOR: Record<FormType, string> = {
  Academic:   'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
  Registry:   'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10',
  Wellbeing:  'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
  Compliance: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
  Finance:    'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
};

export default function Forms() {
  const { user } = useAuthStore();
  const [forms, setForms] = useState<DigitalForm[]>(INITIAL_FORMS);
  const [selectedForm, setSelectedForm] = useState<DigitalForm | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof FORM_TEMPLATES[0] | null>(null);
  const [newFormNote, setNewFormNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitNew = async () => {
    if (!selectedTemplate) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    const newForm: DigitalForm = {
      id: `FRM-${String(Date.now()).slice(-3)}`,
      name: selectedTemplate.name,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      type: selectedTemplate.type,
      submittedDate: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      notes: newFormNote || undefined,
      timeline: [
        { step: 'Submitted', date: 'Just now', done: true },
        { step: 'Under Review', date: '', done: false, active: true },
        { step: 'Decision', date: '', done: false },
      ],
    };
    setForms(f => [newForm, ...f]);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowNewModal(false);
      setSelectedTemplate(null);
      setNewFormNote('');
    }, 1800);
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            <FileText className="w-3 h-3" />
            Governance & TEQSA Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight">Forms & Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Official applications managed under the TEQSA Higher Education Standards Framework.</p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-brand-indigo/20 self-start"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </header>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {(['Action Required', 'Pending', 'Approved', 'Draft'] as FormStatus[]).map(status => {
          const count = forms.filter(f => f.status === status).length;
          if (!count) return null;
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          return (
            <div key={status} className={cn("flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-black", cfg.bg, cfg.color)}>
              <Icon className="w-3.5 h-3.5" />
              {count} {status}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Your Submissions</h3>
          {forms.map((form, i) => {
            const cfg = STATUS_CONFIG[form.status];
            const Icon = cfg.icon;
            const isSelected = selectedForm?.id === form.id;
            return (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bg-white dark:bg-slate-900 rounded-[2rem] border transition-all cursor-pointer shadow-sm hover:shadow-md",
                  isSelected ? "border-brand-indigo dark:border-indigo-500 shadow-md" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                )}
                onClick={() => setSelectedForm(isSelected ? null : form)}
              >
                <div className="p-6 flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0", cfg.bg)}>
                    <Icon className={cn("w-5 h-5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug">{form.name}</h4>
                      <ChevronRight className={cn("w-4 h-4 text-slate-300 flex-shrink-0 transition-transform", isSelected && "rotate-90")} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-slate-300 dark:text-slate-600 uppercase">{form.id}</span>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", TYPE_COLOR[form.type])}>
                        {form.type}
                      </span>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border", cfg.bg, cfg.color)}>
                        {form.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable detail */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-5">
                        {/* Timeline */}
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Progress</p>
                          <div className="flex items-center gap-0">
                            {form.timeline.map((step, si) => (
                              <React.Fragment key={si}>
                                <div className="flex flex-col items-center gap-1">
                                  <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                                    step.done
                                      ? "bg-brand-indigo border-brand-indigo text-white"
                                      : step.active
                                        ? "bg-amber-50 dark:bg-amber-500/10 border-amber-400 text-amber-500"
                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300"
                                  )}>
                                    {step.done ? <Check className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                                  </div>
                                  <p className="text-[9px] font-black text-center whitespace-nowrap max-w-[70px] leading-tight text-slate-500 dark:text-slate-400">{step.step}</p>
                                  {step.date && <p className="text-[8px] text-slate-300 dark:text-slate-600">{step.date}</p>}
                                </div>
                                {si < form.timeline.length - 1 && (
                                  <div className={cn("flex-1 h-0.5 mb-5 mx-1 rounded-full", step.done ? "bg-brand-indigo" : "bg-slate-100 dark:bg-slate-800")} />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        {form.notes && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registry Notes</p>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{form.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                          {form.status === 'Draft' && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                              <Send className="w-3.5 h-3.5" /> Submit Now
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Vault */}
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Document Vault</h3>
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Verified Vault</span>
              </div>
              <div className="space-y-4">
                {COMPLIANCE_DOCS.map((doc, i) => (
                  <div key={i} className="group cursor-pointer flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug truncate">{doc.name}</h4>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-0.5">{doc.ext} · {doc.size}</p>
                    </div>
                    <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                <Printer className="w-3.5 h-3.5" /> Request Hardcopy
              </button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          {/* Legislative note */}
          <div className="bg-indigo-50 dark:bg-indigo-500/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20">
            <h4 className="text-[10px] font-black text-brand-indigo dark:text-indigo-400 uppercase tracking-widest mb-2">Legislative Framework</h4>
            <p className="text-[11px] font-medium text-indigo-900/60 dark:text-indigo-300/60 leading-relaxed">
              Data handled per the <em>Privacy Act 1988 (Cth)</em>. Digital signatures are legally binding under the <em>Electronic Transactions Act 1999</em>.
            </p>
          </div>
        </div>
      </div>

      {/* ── New Application Modal ── */}
      <AnimatePresence>
        {showNewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => { if (!submitting) { setShowNewModal(false); setSelectedTemplate(null); setNewFormNote(''); } }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">New Application</h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Select a form type to begin</p>
                </div>
                <button onClick={() => { setShowNewModal(false); setSelectedTemplate(null); setNewFormNote(''); }} className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Submitted!</p>
                    <p className="text-xs text-slate-400 text-center">Your application has been lodged and is under review.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Template grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {FORM_TEMPLATES.map(tmpl => {
                        const Icon = tmpl.icon;
                        const isSelected = selectedTemplate?.id === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            onClick={() => setSelectedTemplate(isSelected ? null : tmpl)}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-left transition-all",
                              isSelected
                                ? "border-brand-indigo bg-indigo-50 dark:bg-indigo-500/10"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-3", isSelected ? "bg-brand-indigo text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <p className={cn("text-[11px] font-black leading-tight mb-1", isSelected ? "text-brand-indigo dark:text-indigo-400" : "text-slate-700 dark:text-slate-200")}>{tmpl.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium leading-snug">{tmpl.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Supporting notes */}
                    {selectedTemplate && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supporting Notes (optional)</label>
                        <textarea
                          value={newFormNote}
                          onChange={e => setNewFormNote(e.target.value)}
                          placeholder="Describe your circumstances or any relevant details…"
                          rows={3}
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo dark:focus:border-indigo-500 resize-none"
                        />
                      </motion.div>
                    )}

                    <button
                      onClick={handleSubmitNew}
                      disabled={!selectedTemplate || submitting}
                      className={cn(
                        "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        selectedTemplate
                          ? "bg-brand-indigo text-white hover:bg-indigo-700 shadow-lg shadow-brand-indigo/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Submit Application</>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
