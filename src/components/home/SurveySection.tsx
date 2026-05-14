import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, ArrowRight, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const ACTIVE_SURVEYS = [
  {
    id: 'ses-2026',
    title: 'Student Experience Survey (SES)',
    provider: 'SurveyMonkey',
    deadline: 'May 30, 2026',
    status: 'pending',
    points: 50,
    url: 'https://www.surveymonkey.com/r/cihe-student-feedback'
  },
  {
    id: 'it-support-2026',
    title: 'Digital Services Feedback',
    provider: 'Internal',
    deadline: 'June 15, 2026',
    status: 'completed',
    points: 20,
    url: '#'
  }
];

export default function SurveySection() {
  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8"
    >
      <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
              <h3 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Quality Assurance
              </h3>
              <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Student Surveys</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">TEQSA Compliance</span>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIVE_SURVEYS.map((survey) => (
              <div 
                key={survey.id}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all group relative overflow-hidden",
                  survey.status === 'completed' 
                    ? "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 opacity-80" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-lg hover:scale-[1.02]"
                )}
              >
                  <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        survey.status === 'completed' ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}>
                          {survey.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                      </div>
                      <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{survey.provider}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">{survey.title}</h4>
                  
                  <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          <Clock className="w-3.5 h-3.5" /> {survey.deadline}
                      </div>
                  </div>

                  {survey.status === 'pending' ? (
                    <a 
                      href={survey.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                    >
                        Start Survey <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="mt-6 w-full py-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        Response Recorded <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
              </div>
          ))}
      </div>

      <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Your feedback helps CIHE Australia improve learning outcomes and campus facilities.</p>
          </div>
          <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
              View Survey Policy <ArrowRight className="w-3.5 h-3.5" />
          </button>
      </div>
    </motion.div>
  );
}
