import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, ArrowUpRight } from 'lucide-react';
import { CAMPUS_AI_INSIGHTS } from '../../data/mockData';

interface AIInsightsBannerProps {
  onNavigateToPredictions?: () => void;
}

export const AIInsightsBanner: React.FC<AIInsightsBannerProps> = ({ onNavigateToPredictions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAMPUS_AI_INSIGHTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Operations Notice
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] text-slate-500 font-medium">Campus Infrastructure Feed</span>
            </div>
            <p className="text-xs font-medium text-slate-800 mt-0.5 min-h-[18px]">
              {CAMPUS_AI_INSIGHTS[currentIndex]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          {/* Index Dots */}
          <div className="flex items-center gap-1 mr-1">
            {CAMPUS_AI_INSIGHTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-slate-800' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Notice ${idx + 1}`}
              />
            ))}
          </div>

          {onNavigateToPredictions && (
            <button
              type="button"
              onClick={onNavigateToPredictions}
              className="inline-flex items-center gap-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <span>Preventive Schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

