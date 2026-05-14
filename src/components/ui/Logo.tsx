import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'white' | 'blue';
  showText?: boolean;
}

export default function Logo({ className, variant = 'white', showText = false }: LogoProps) {
  const color = variant === 'white' ? '#FFFFFF' : '#003B95';
  
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg 
        viewBox="0 0 100 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Crown Shape based on CIHE logo */}
        <path 
          d="M20 20L35 50L50 10L65 50L80 20V60C80 65.5 75.5 70 70 70H30C24.5 70 20 65.5 20 60V20Z" 
          stroke={color} 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M25 60C35 50 65 50 75 60" 
          stroke={color} 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        <rect x="46" y="8" width="8" height="8" transform="rotate(45 50 12)" fill={color} />
        <circle cx="20" cy="20" r="3" fill={color} />
        <circle cx="80" cy="20" r="3" fill={color} />
      </svg>
      {showText && (
        <span className={cn(
          "font-display font-black tracking-tight mt-1",
          variant === 'white' ? "text-white" : "text-[#003B95]"
        )}>
          CIHE
        </span>
      )}
    </div>
  );
}
