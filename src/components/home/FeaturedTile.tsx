import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Mail, 
  Wifi, 
  UserCheck, 
  Calendar, 
  LifeBuoy, 
  Files, 
  MessageSquare,
  Settings,
  Users,
  ShieldCheck,
  Contact,
  Key,
  ScrollText,
  Cpu,
  Cloud,
  ChevronRight,
  HelpCircle,
  ArrowUpRight,
  ClipboardList,
  Share2,
  Search
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ServiceTileConfig, MOCKED_BADGES } from '../../lib/constants';

const icons: Record<string, any> = {
  BookOpen, Mail, Wifi, UserCheck, Calendar, LifeBuoy, Files, MessageSquare,
  Settings, Users, ShieldCheck, Contact, Key, ScrollText, Cpu, Cloud,
  ClipboardList, Share2, Search
};

interface FeaturedTileProps {
  config: ServiceTileConfig;
  index: number;
  className?: string;
}

const FeaturedTile: React.FC<FeaturedTileProps> = ({ config, index, className }) => {
  const Icon = icons[config.icon] || HelpCircle;
  const badge = config.badgeKey ? MOCKED_BADGES[config.badgeKey] : null;
  const isExternal = config.href.startsWith('http');

  // Check if it's a "Hero" style tile (Outlook, Teams, Moodle)
  const isBranded = ['outlook', 'teams', 'moodle', 'moodle_admin', 'meshed', 'meshed_admin', 'meshed_root', 'jira'].includes(config.id);

  return (
    <motion.a
      href={config.href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative overflow-hidden p-6 rounded-[3rem] shadow-sm transition-all flex flex-col justify-between min-h-[160px]",
        isBranded 
          ? config.color + " text-white border-transparent shadow-xl dark:shadow-none" 
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-indigo/30 dark:hover:border-indigo-500/30",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
          isBranded ? "bg-white/20" : cn("text-white", config.color)
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex items-center gap-2">
          {badge !== null && badge > 0 && (
            <span className="px-2 py-1 bg-rose-500 text-[10px] font-black text-white rounded-lg shadow-lg shadow-black/10 animate-in zoom-in">
              {badge}
            </span>
          )}
          {isExternal && (
            <ArrowUpRight className={cn(
              "w-4 h-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
              isBranded ? "text-white/40" : "text-slate-300 dark:text-slate-600"
            )} />
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className={cn(
          "font-display font-black text-lg tracking-tight mb-1 transition-colors",
          isBranded ? "text-white" : "text-slate-800 dark:text-slate-100 group-hover:text-brand-indigo dark:group-hover:text-indigo-400"
        )}>
          {config.name}
        </h3>
        <p className={cn(
          "text-xs font-bold leading-tight line-clamp-2",
          isBranded ? "text-white/70" : "text-slate-500 dark:text-slate-400"
        )}>
          {config.description}
        </p>
      </div>

      {/* Decorative gradient for branded tiles */}
      {isBranded && (
        <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      )}
    </motion.a>
  );
}

export default FeaturedTile;
