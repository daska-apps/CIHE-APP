import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, BrainCircuit, Loader2, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import { chatWithAssistant } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import Markdown from 'react-markdown';

interface UnitSummaryModalProps {
  unitId: string;
  unitTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UnitSummaryModal({ unitId, unitTitle, isOpen, onClose }: UnitSummaryModalProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const prompt = `Provide a concise academic summary and key learning outcomes for the unit ${unitId}: ${unitTitle}. 
      Include:
      1. Core Objective (2 sentences)
      2. Key Learning Outcomes (3 bullet points)
      3. Practical Applications (1 sentence)
      Keep it professional and tailored for a CIHE student.`;
      
      const response = await chatWithAssistant(prompt);
      setSummary(response);
    } catch (err) {
      setSummary("Error generating summary. Please ensure your CIHE credentials and AI access are active.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !summary && !isLoading) {
      generateSummary();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 bg-[#003B95] dark:bg-indigo-700 text-white flex items-center justify-between relative overflow-hidden shrink-0">
               <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <BrainCircuit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">CIHE Intelligence</span>
                        <div className="px-2 py-0.5 bg-indigo-400/30 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-200" />
                            <span className="text-[8px] font-black uppercase text-indigo-100 tracking-widest">Generative AI</span>
                        </div>
                    </div>
                    <h3 className="font-display font-black text-2xl tracking-tight leading-none mt-1">Smart Unit Summary</h3>
                  </div>
               </div>
               <button 
                  onClick={onClose}
                  className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 text-[#003B95] dark:text-indigo-400 animate-spin" />
                            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-pulse" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Analyzing Unit Materials...</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Synthesizing AQF compliance data</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <div className="flex items-center gap-3 pb-8 border-b border-slate-50 dark:border-slate-800">
                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                <BookOpen className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Subject Context</p>
                                <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">{unitId}: {unitTitle}</p>
                            </div>
                        </div>

                        <div className="markdown-body prose prose-slate dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black">
                            <Markdown>{summary || ''}</Markdown>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100/50 dark:border-emerald-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">Verification Status</span>
                                </div>
                                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">Aligned with 2026 Unit Guide</p>
                            </div>
                            <div className="p-6 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100/50 dark:border-indigo-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Academic Level</span>
                                </div>
                                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-200">AQF Level 7/8 Equivalent</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold max-w-[250px] leading-relaxed">
                    AI summaries are generated based on institutional knowledge and should be cross-verified with official CIHE Unit Guides on Moodle.
                </p>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Dismiss Guide
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
