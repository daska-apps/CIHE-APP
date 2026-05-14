import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Sparkles, X, Phone, Globe, ExternalLink, BookOpen, MessageSquare, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { chatWithAssistant } from '../../services/geminiService';
import { useAuthStore } from '../../store/useAuthStore';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const LOCAL_FALLBACKS: Record<string, string> = {
  'wifi': 'To connect to CIHE Wi-Fi, use your student email and global password. If you are on Level 4, ensure you are near the hub access point.',
  'password': 'You can reset your CIHE password at https://passwordreset.microsoftonline.com or visit the IT desk on Level 4.',
  'meshed': 'Meshed is our student management system. You can access it at https://cihe.meshedhe.com.au/ to view your results and enrolment.',
  'moodle': 'Moodle is where your course materials live. Ensure you have completed your enrolment in Meshed first.'
};

export default function SupportAssistant() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = [
    { label: 'Enrolment Support', key: 'enrolment', icon: Globe },
    { label: 'Wi-Fi & Tech', key: 'wifi', icon: Sparkles },
    { label: 'Moodle Access', key: 'moodle', icon: Bot },
    { label: 'Transport & Campus', key: 'campus', icon: ExternalLink },
    { label: 'Academic Dates', key: 'dates', icon: BookOpen },
    { label: 'General Enquiry', key: 'general', icon: MessageSquare }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideMsg?: string) => {
    const userMessage = overrideMsg || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Check for local fallbacks first
    const lowercaseMsg = userMessage.toLowerCase();
    const fallbackKey = Object.keys(LOCAL_FALLBACKS).find(key => lowercaseMsg.includes(key));
    
    if (fallbackKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', content: LOCAL_FALLBACKS[fallbackKey] }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      // Build structured context
      const userContext = `Context: User ${user?.name} (${user?.role}) at North Sydney Campus. Page: ${location.pathname}`;
      
      const responseText = await chatWithAssistant(`${userContext}\nUser Message: ${userMessage}`, messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })));
      
      setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting to the CIHE networks. Please try again or contact IT helpdesk at it.support@cihe.edu.au." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-indigo text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 group overflow-hidden"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md h-[600px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              {/* Header */}
              <div className="p-6 bg-brand-indigo dark:bg-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-[1.25rem] flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm tracking-tight uppercase">CIHE Assistant</h3>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase text-emerald-100 tracking-widest">Active</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none mt-1">Intelligence</p>
                  </div>
                </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setMessages([]);
                        setShowSuggestions(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      <RefreshCw className="w-3" />
                      Reset
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth bg-slate-50/50 dark:bg-slate-950/50"
              >
                {messages.length === 0 && showSuggestions && (
                  <div className="space-y-8 py-4">
                    <div className="flex flex-col items-center text-center space-y-3 mb-8">
                       <div className="w-20 h-20 bg-brand-indigo/10 dark:bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mb-2">
                          <Bot className="w-10 h-10 text-brand-indigo dark:text-indigo-400" />
                       </div>
                       <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">How can I help?</h4>
                       <p className="text-xs text-slate-400 dark:text-slate-500 font-bold max-w-[260px]">I'm the official CIHE Smart Portal assistant. Ask me anything.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => handleSend(`Tell me about ${s.label.toLowerCase()}`)}
                          className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-left hover:border-brand-indigo dark:hover:border-indigo-500 hover:shadow-xl transition-all group/s"
                        >
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover/s:bg-indigo-50 dark:group-hover/s:bg-indigo-900/30 transition-colors">
                             <s.icon className="w-5 h-5 text-slate-400 group-hover/s:text-brand-indigo dark:group-hover/s:text-indigo-400" />
                          </div>
                          <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{s.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center shadow-lg",
                      msg.role === 'user' ? "bg-brand-indigo text-white" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-brand-indigo dark:text-indigo-400"
                    )}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={cn(
                      "max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed font-bold",
                      msg.role === 'user' 
                        ? "bg-brand-indigo dark:bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-xl shadow-slate-100/10 dark:shadow-black/20"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-[1.25rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-brand-indigo dark:text-indigo-400 shadow-lg">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-xl">
                      <Loader2 className="w-5 h-5 animate-spin text-brand-indigo dark:text-indigo-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 overflow-x-auto no-scrollbar">
                {[
                  { label: 'Wi-Fi Setup', icon: Globe, key: 'wifi' },
                  { label: 'IT Helpdesk', icon: Phone, href: 'tel:0212345678' },
                  { label: 'Meshed Portal', icon: ExternalLink, href: 'https://cihe.meshedhe.com.au' }
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        if (action.key) setInput(action.key);
                        else if (action.href) window.open(action.href);
                    }}
                    className="shrink-0 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 hover:text-brand-indigo dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-100 dark:border-slate-700 transition-all flex items-center gap-2"
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message CIHE Assistant..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] py-5 pl-8 pr-16 text-sm font-bold focus:ring-8 focus:ring-brand-indigo/5 dark:focus:ring-indigo-500/5 focus:border-brand-indigo/30 dark:focus:border-indigo-500/30 outline-none transition-all dark:text-white"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-indigo dark:bg-indigo-600 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
                  >
                    <Send className="w-5 h-5 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
