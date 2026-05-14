import React from 'react';
import { motion } from 'motion/react';
import { Share2, Heart, MessageCircle, MoreHorizontal, Camera, Users, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const POSTS = [
  {
    id: 1,
    author: 'Student Association',
    time: '2h ago',
    content: 'Amazing energy at the North Sydney Networking Mixer! Thanks to everyone who came out to level 4 yesterday. 📸 Photos are now live in the gallery.',
    likes: 24,
    comments: 5,
    hasImage: true,
    category: 'Community'
  },
  {
    id: 2,
    author: 'Academic Registry',
    time: '5h ago',
    content: 'Reminder: Census date for Trimester 2 is approaching. Please ensure all unit selections are finalized via Meshed by Friday.',
    likes: 12,
    comments: 2,
    hasImage: false,
    category: 'Admin'
  }
];

export default function VivaEngage() {
  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
              <h3 className="text-[10px] font-black text-[#4b53bc] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5" />
                  Viva Engage
              </h3>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Social & Announcements</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#4b53bc] transition-colors">
              <Zap className="w-4 h-4" />
          </button>
      </div>

      <div className="divide-y divide-slate-50">
          {POSTS.map((post, i) => (
              <div key={post.id} className="p-8 hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs",
                            post.category === 'Community' ? 'bg-indigo-500' : 'bg-emerald-500'
                          )}>
                              {post.author[0]}
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-slate-800">{post.author}</h4>
                              <p className="text-[10px] font-medium text-slate-400">{post.time} • {post.category}</p>
                          </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {post.content}
                  </p>

                  {post.hasImage && (
                    <div className="aspect-video bg-slate-100 rounded-2xl mb-6 flex items-center justify-center text-slate-400 relative overflow-hidden group/img cursor-pointer">
                        <Camera className="w-8 h-8 opacity-20 group-hover/img:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <span className="absolute bottom-4 left-4 text-[10px] font-black text-white uppercase tracking-widest">Event Gallery</span>
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors">
                          <Heart className="w-4 h-4" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#4b53bc] transition-colors">
                          <MessageCircle className="w-4 h-4" /> {post.comments}
                      </button>
                  </div>
              </div>
          ))}
      </div>

      <div className="p-6 bg-slate-50/50 border-t border-slate-50">
          <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#4b53bc] hover:border-[#4b53bc]/30 transition-all flex items-center justify-center gap-2">
              Join the Conversation <Users className="w-3.5 h-3.5" />
          </button>
      </div>
    </motion.div>
  );
}
