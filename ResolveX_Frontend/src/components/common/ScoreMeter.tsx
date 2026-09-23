import React from 'react';

interface ScoreMeterProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({ 
  score, 
  size = 'md',
  showDetails = false 
}) => {
  const clamped = Math.max(0, Math.min(100, score));

  // Color logic
  let color = 'text-emerald-600 border-emerald-500';
  let barColor = 'bg-emerald-500';
  let label = 'Low Priority';

  if (clamped >= 85) {
    color = 'text-red-600 border-red-500';
    barColor = 'bg-red-600';
    label = 'Critical Risk';
  } else if (clamped >= 70) {
    color = 'text-orange-500 border-orange-500';
    barColor = 'bg-orange-500';
    label = 'High Priority';
  } else if (clamped >= 50) {
    color = 'text-amber-500 border-amber-500';
    barColor = 'bg-amber-500';
    label = 'Medium Priority';
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColor} rounded-full transition-all duration-500`} 
            style={{ width: `${clamped}%` }}
          />
        </div>
        <span className="font-mono text-xs font-bold text-slate-800">{clamped}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-900">
            {clamped}
          </span>
          <span className="text-sm font-semibold text-slate-400">/ 100</span>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>
          {label}
        </span>
      </div>

      {/* Progress track */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div 
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out shadow-xs`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {showDetails && (
        <div className="grid grid-cols-4 text-[10px] uppercase font-semibold text-slate-400 pt-1">
          <span className="text-left">0 Low</span>
          <span className="text-center">50 Med</span>
          <span className="text-center">70 High</span>
          <span className="text-right text-red-500">85+ Crit</span>
        </div>
      )}
    </div>
  );
};
