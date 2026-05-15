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

function getLightBg(color: string): { bg: string; border: string; iconRing: string } {
  if (color.includes('#f47b20') || color.includes('orange'))                          return { bg: 'bg-orange-50 dark:bg-orange-950/30',  border: 'border-orange-100 dark:border-orange-900/40  hover:border-orange-300 dark:hover:border-orange-700',  iconRing: 'ring-orange-100 dark:ring-orange-900/40'  };
  if (color.includes('#0078d4') || color.includes('sky') || color.includes('blue'))  return { bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-blue-100 dark:border-blue-900/40    hover:border-blue-300 dark:hover:border-blue-700',     iconRing: 'ring-blue-100 dark:ring-blue-900/40'     };
  if (color.includes('#4b53bc') || color.includes('indigo') || color.includes('brand-indigo')) return { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-100 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700', iconRing: 'ring-indigo-100 dark:ring-indigo-900/40' };
  if (color.includes('emerald') || color.includes('green'))                          return { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700', iconRing: 'ring-emerald-100 dark:ring-emerald-900/40' };
  if (color.includes('rose') || color.includes('red'))                               return { bg: 'bg-rose-50 dark:bg-rose-950/30',     border: 'border-rose-100 dark:border-rose-900/40    hover:border-rose-300 dark:hover:border-rose-700',     iconRing: 'ring-rose-100 dark:ring-rose-900/40'     };
  if (color.includes('violet') || color.includes('purple'))                          return { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-100 dark:border-violet-900/40 hover:border-violet-300 dark:hover:border-violet-700', iconRing: 'ring-violet-100 dark:ring-violet-900/40' };
  if (color.includes('amber') || color.includes('yellow'))                           return { bg: 'bg-amber-50 dark:bg-amber-950/30',   border: 'border-amber-100 dark:border-amber-900/40  hover:border-amber-300 dark:hover:border-amber-700',   iconRing: 'ring-amber-100 dark:ring-amber-900/40'   };
  return                                                                               { bg: 'bg-slate-50 dark:bg-slate-800/40',        border: 'border-slate-100 dark:border-slate-700     hover:border-slate-300 dark:hover:border-slate-500',        iconRing: 'ring-slate-100 dark:ring-slate-700'        };
}

const FeaturedTile: React.FC<FeaturedTileProps> = ({ config, index, className }) => {
  const Icon = icons[config.icon] || HelpCircle;
  const badge = config.badgeKey ? MOCKED_BADGES[config.badgeKey] : null;
  const isExternal = config.href.startsWith('http');

  // Check if it's a "Hero" style tile (Outlook, Teams, Moodle)
  const isBranded = ['outlook', 'teams', 'moodle', 'moodle_admin', 'meshed', 'meshed_admin', 'meshed_root', 'jira'].includes(config.id);
  const light = getLightBg(config.color);

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
        "group relative overflow-hidden p-6 rounded-[3rem] shadow-sm transition-all flex flex-col justify-between min-h-[160px] border",
        isBranded
          ? config.color + " text-white border-transparent shadow-xl dark:shadow-none"
          : cn(light.bg, light.border),
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ring-4",
          isBranded ? "bg-white/20 ring-white/10" : cn("text-white", config.color, light.iconRing)
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
          isBranded ? "text-white" : "text-slate-800 dark:text-slate-100"
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
