import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Plus, Trash2, Pin, PinOff, AlertCircle, Calendar, Info, Zap, X, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

type AnnouncementType = 'urgent' | 'event' | 'update' | 'info';

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  time: string;
  author: string;
  pinned: boolean;
  timestamp: string;
}

const TYPE_CONFIG: Record<AnnouncementType, { label: string; color: string; dot: string; icon: any }> = {
  urgent: { label: 'Urgent', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20', dot: 'bg-rose-500', icon: AlertCircle },
  event:  { label: 'Event',  color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20', dot: 'bg-indigo-400', icon: Calendar },
  update: { label: 'Update', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20', dot: 'bg-emerald-400', icon: Zap },
  info:   { label: 'Info',   color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20', dot: 'bg-amber-400', icon: Info },
};

const EMPTY_FORM = { title: '', body: '', type: 'info' as AnnouncementType, time: '', author: '' };

export default function Announcements() {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canEdit = ['admin', 'global_admin', 'staff'].includes(user?.role || '');

  async function fetchAnnouncements() {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch {
      setError('Could not load announcements.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAnnouncements(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, author: form.author || user?.name || 'Admin' })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const newItem = await res.json();
      setAnnouncements(prev => [newItem, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
  }

  async function handlePin(id: string) {
    const res = await fetch(`/api/announcements/${id}/pin`, { method: 'PATCH' });
    if (res.ok) {
      const updated = await res.json();
      setAnnouncements(prev => prev.map(a => a.id === id ? updated : a));
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-indigo dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
            <Megaphone className="w-3 h-3" />
            Campus Broadcast
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white tracking-tight">Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Publish updates, events, and alerts that appear on the student dashboard.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none shrink-0"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Announcement'}
          </button>
        )}
      </header>

      {/* Compose Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
          >
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6">Compose Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    maxLength={100}
                    placeholder="e.g. Library closed this Friday"
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-indigo/40 dark:focus:border-indigo-500/40 transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message *</label>
                  <textarea
                    value={form.body}
                    onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    maxLength={500}
                    rows={3}
                    placeholder="Write the full announcement here..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-indigo/40 dark:focus:border-indigo-500/40 transition-all resize-none"
                  />
                  <p className="text-right text-[10px] text-slate-300 dark:text-slate-600 mt-1 font-bold">{form.body.length}/500</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(TYPE_CONFIG) as AnnouncementType[]).map(t => {
                      const cfg = TYPE_CONFIG[t];
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, type: t }))}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                            form.type === t ? cfg.color : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-slate-200'
                          )}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">When / Time Label</label>
                    <input
                      value={form.time}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      maxLength={50}
                      placeholder="e.g. Friday 9AM, This Week"
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-indigo/40 dark:focus:border-indigo-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">From (Department)</label>
                    <input
                      value={form.author}
                      onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                      maxLength={80}
                      placeholder={user?.name || 'Admin'}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-indigo/40 dark:focus:border-indigo-500/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting || !form.title.trim() || !form.body.trim()}
                  className="flex items-center gap-2 px-8 py-4 bg-brand-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Publish
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(TYPE_CONFIG) as [AnnouncementType, typeof TYPE_CONFIG[AnnouncementType]][]).map(([key, cfg]) => (
          <div key={key} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest", cfg.color)}>
            <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-indigo dark:text-indigo-400" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
          <Megaphone className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No announcements yet</p>
          {canEdit && <p className="text-xs text-slate-300 dark:text-slate-600 mt-2 font-bold">Click "New Announcement" to publish your first one.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map((ann) => {
              const cfg = TYPE_CONFIG[ann.type] || TYPE_CONFIG.info;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={ann.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "bg-white dark:bg-slate-900 rounded-[2rem] border p-6 shadow-sm flex gap-5 group transition-all",
                    ann.pinned ? "border-brand-indigo/30 dark:border-indigo-500/30" : "border-slate-100 dark:border-slate-800"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border", cfg.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {ann.pinned && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-indigo dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg">Pinned</span>
                      )}
                      <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border", cfg.color)}>{cfg.label}</span>
                      {ann.time && <span className="text-[10px] font-bold text-slate-400">{ann.time}</span>}
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight mb-1">{ann.title}</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">{ann.body}</p>
                    <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 mt-3">
                      Posted by {ann.author} • {new Date(ann.timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePin(ann.id)}
                        title={ann.pinned ? 'Unpin' : 'Pin to top'}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-brand-indigo dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                      >
                        {ann.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        title="Delete"
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
