import React from 'react';
import { IssueStatus } from '../../types';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<IssueStatus, { label: string; bg: string; dot: string }> = {
    reported: {
      label: 'Reported',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
    },
    ai_analyzed: {
      label: 'AI Analyzed',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-600',
    },
    assigned: {
      label: 'Assigned',
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500 animate-pulse',
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-600',
    },
    closed: {
      label: 'Closed',
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      dot: 'bg-slate-600',
    },
  };

  const current = configs[status] || configs.reported;
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shadow-2xs ${current.bg} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
};
