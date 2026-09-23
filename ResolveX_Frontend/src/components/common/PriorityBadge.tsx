import React from 'react';
import { IssuePriority } from '../../types';

interface PriorityBadgeProps {
  priority: IssuePriority;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  score,
  showScore = false,
  size = 'md',
}) => {
  const configs = {
    critical: {
      bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
      dot: 'bg-red-600 animate-pulse',
      label: 'CRITICAL',
    },
    high: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      dot: 'bg-amber-500',
      label: 'HIGH',
    },
    medium: {
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800/60',
      dot: 'bg-yellow-500',
      label: 'MEDIUM',
    },
    low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
      label: 'LOW',
    },
  };

  const config = configs[priority] || configs.low;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]} whitespace-nowrap transition-all shadow-xs`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 pl-1 border-l border-current/20 font-mono text-[11px] font-semibold opacity-90">
          {score}/100
        </span>
      )}
    </span>
  );
};
