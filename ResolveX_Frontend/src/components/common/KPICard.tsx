import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositiveTrend?: boolean;
  icon: LucideIcon;
  badgeText?: string;
  accentColor?: 'red' | 'blue' | 'amber' | 'emerald' | 'purple';
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  isPositiveTrend,
  icon: Icon,
  badgeText,
}) => {
  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-colors relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="p-1.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/60">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
          {value}
        </span>
        {badgeText && (
          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {badgeText}
          </span>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {change && (
            <span
              className={`font-medium shrink-0 ml-1 ${
                isPositiveTrend ? 'text-emerald-700' : 'text-slate-600'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

