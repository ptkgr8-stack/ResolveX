import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { AIAnalysisResult, CampusLocation } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { ScoreMeter } from '../common/ScoreMeter';

interface AIAnalysisSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AIAnalysisResult;
  issueTitle: string;
  location: CampusLocation;
  hasImage: boolean;
  onConfirmSubmit: () => void;
}

interface StepItem {
  id: string;
  label: string;
  detail: string;
}

export const AIAnalysisSequenceModal: React.FC<AIAnalysisSequenceModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  issueTitle,
  location,
  hasImage,
  onConfirmSubmit,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const steps: StepItem[] = [
    { id: 'step-1', label: 'Analyzing description semantics', detail: 'Parsing linguistic urgency tokens and domain nouns' },
    { id: 'step-2', label: 'Analyzing uploaded evidence image', detail: hasImage ? 'Executing visual feature extraction & boundary detection' : 'No image uploaded; using text & telemetry context' },
    { id: 'step-3', label: 'Identifying infrastructure category', detail: `Classified as ${analysisResult.category} (${analysisResult.categoryConfidence}% confidence)` },
    { id: 'step-4', label: 'Estimating physical risk & severity', detail: `Evaluated safety hazard score: ${analysisResult.severityScore}/10` },
    { id: 'step-5', label: 'Checking duplicate & similar reports', detail: `Found ${analysisResult.similarIssueCount} nearby reports in ${location.code}` },
    { id: 'step-6', label: 'Calculating algorithmic priority score', detail: `Composite score: ${analysisResult.priorityScore}/100` },
    { id: 'step-7', label: 'Routing to authoritative department', detail: `Assigned: ${analysisResult.assignedDepartment}` },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsCompleted(false);
      return;
    }

    let timer: NodeJS.Timeout;
    if (currentStepIndex < steps.length) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 550); // fast, responsive, yet visibly informative progression
    } else {
      setIsCompleted(true);
    }

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden transition-all">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  ResolveX AI Analysis
                </h3>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {isCompleted ? 'EVALUATION COMPLETE' : 'PROCESSING PIPELINE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated multi-factor classification, severity assessment, and predictive routing
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!isCompleted ? (
            /* Live Step Progression Sequence */
            <div className="space-y-4 py-3">
              <div className="text-center pb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Running ResolveX AI Analysis
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synthesizing report signals against ResolveX digital twin database...
                </p>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 text-xs p-2 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-white shadow-xs border border-blue-200 text-blue-900 font-semibold'
                          : isDone
                          ? 'text-slate-700'
                          : 'text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={isCurrent ? 'font-bold text-blue-700' : ''}>
                            {step.label}
                          </span>
                          {isDone && (
                            <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                              Verified
                            </span>
                          )}
                        </div>
                        {(isDone || isCurrent) && (
                          <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                            {step.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Analysis Complete Output Card */
            <div className="space-y-5 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    AI Analysis Complete &amp; Prioritized
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Report evaluated with high statistical confidence. Ready for immediate dispatch.
                  </p>
                </div>
              </div>

              {/* Core Output Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column: Classification & Score */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Issue Classification
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <h5 className="text-base font-extrabold text-slate-900">
                        {analysisResult.category}
                      </h5>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {analysisResult.categoryConfidence}% Confidence
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {analysisResult.secondaryTags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Calculated Priority Score
                    </span>
                    <ScoreMeter score={analysisResult.priorityScore} showDetails={true} />
                  </div>
                </div>

                {/* Right column: Department, Severity, Duplicates */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Estimated Severity
                    </span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <PriorityBadge priority={analysisResult.severity} size="lg" />
                      {analysisResult.safetyHazard && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Life Safety Risk
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Authoritative Routing
                    </span>
                    <div className="mt-1 flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{analysisResult.assignedDepartment}</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Target SLA: {analysisResult.estimatedResponseTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Cluster &amp; Similar Issues
                    </span>
                    <div className="mt-1 text-xs font-medium text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {analysisResult.similarIssueCount > 0 ? (
                        <span>
                          <strong>{analysisResult.similarIssueCount}</strong> similar reports found nearby in {location.name}
                        </span>
                      ) : (
                        <span>No duplicate reports detected in this zone</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Reasoning Narrative */}
              <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h6 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                    AI Decision Reasoning
                  </h6>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  "{analysisResult.reasoning}"
                </p>
                {analysisResult.preventiveActionRecommended && (
                  <div className="mt-2 pt-2 border-t border-indigo-200/60 text-xs text-indigo-950 font-medium flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Preventive Recurrence Flag:</strong> {analysisResult.preventiveActionRecommended}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            {isCompleted ? 'Edit Report' : 'Cancel'}
          </button>

          {isCompleted && (
            <button
              type="button"
              onClick={onConfirmSubmit}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <span>Submit &amp; Dispatch Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
