import React from 'react';

interface CampusLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const CampusLogo: React.FC<CampusLogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
}) => {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Pulse / EKG icon in rounded container */}
      <div
        className={`flex items-center justify-center shrink-0 rounded-lg transition-transform ${
          size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'
        } ${
          isLight
            ? 'bg-white/10 text-white border border-white/20'
            : 'bg-[#0b1f44] text-white shadow-xs'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight leading-none ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
          } ${isLight ? 'text-white' : 'text-[#0b1f44]'}`}
        >
          ResolveX
        </span>
        <span
          className={`font-mono font-medium tracking-wider uppercase leading-none mt-1 ${
            size === 'sm' ? 'text-[8px]' : 'text-[9px]'
          } ${isLight ? 'text-blue-200/80' : 'text-slate-500'}`}
        >
          INFRASTRUCTURE INTELLIGENCE
        </span>
      </div>
    </div>
  );
};
