import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  MessageSquare, 
  ThumbsUp, 
  Share2,
  ExternalLink,
  ChevronRight,
  Send,
  Wrench
} from 'lucide-react';
import { CampusIssue, IssueStatus } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { ScoreMeter } from './ScoreMeter';
import { CampusMapViewer } from './CampusMapViewer';

interface IssueDetailsViewProps {
  issue: CampusIssue;
  onBack: () => void;
  onUpdateStatus?: (issueId: string, newStatus: IssueStatus, notes?: string) => void;
  isAdmin?: boolean;
}

export const IssueDetailsView: React.FC<IssueDetailsViewProps> = ({
  issue,
  onBack,
  onUpdateStatus,
  isAdmin = false,
}) => {
  const [timelineNotes, setTimelineNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(issue.status);
  const [upvotes, setUpvotes] = useState(issue.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    } else {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleApplyStatusChange = () => {
    if (onUpdateStatus && selectedStatus !== issue.status) {
      onUpdateStatus(issue.id, selectedStatus, timelineNotes || undefined);
      setTimelineNotes('');
    }
  };

  const timelineSteps = [
    { key: 'reported', label: 'Reported' },
    { key: 'ai_analyzed', label: 'AI Analyzed' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const getStepStatusIndex = (st: IssueStatus) => {
    switch (st) {
      case 'reported': return 0;
      case 'ai_analyzed': return 1;
      case 'assigned': return 2;
      case 'in_progress': return 3;
      case 'resolved':
      case 'closed': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepStatusIndex(issue.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top breadcrumb & navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Issues</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-semibold">
            {issue.trackingNumber}
          </span>
          <button
            type="button"
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
              hasUpvoted
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-blue-600 text-blue-600' : ''}`} />
            <span>{upvotes} Confirmations</span>
          </button>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={issue.priority} score={issue.priorityScore} showScore={true} size="md" />
              <StatusBadge status={issue.status} />
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {issue.category}
              </span>
              {issue.aiAnalysis.safetyHazard && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  <ShieldAlert className="w-3 h-3" />
                  Life Safety Hazard
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {issue.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {issue.description}
            </p>

            {/* Meta tags bar */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{issue.location.name}</span>
                <span className="text-slate-400 font-mono">({issue.location.code})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported {new Date(issue.reportedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>By {issue.reportedBy.name} ({issue.reportedBy.role})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-semibold text-slate-800">{issue.assignedDepartment}</span>
              </div>
            </div>
          </div>

          {/* Right score block */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 lg:w-64 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              AI Priority Composite
            </span>
            <ScoreMeter score={issue.priorityScore} showDetails={true} />
            
            <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Confidence:</span>
                <span className="font-mono font-bold text-slate-800">{issue.aiAnalysis.categoryConfidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Response:</span>
                <span className="font-semibold text-slate-800">{issue.aiAnalysis.estimatedResponseTime}</span>
              </div>
              {issue.assignedTechnician && (
                <div className="pt-1.5 border-t border-slate-200 text-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Technician</span>
                  <span className="font-semibold text-blue-700">{issue.assignedTechnician}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Action Controls Bar (When in Admin Mode) */}
      {isAdmin && onUpdateStatus && (
        <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-600 text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                  Campus Operations Control
                </h4>
                <p className="text-xs text-indigo-800">
                  Update issue resolution state and dispatch technician notes
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as IssueStatus)}
                className="text-xs font-semibold py-2 px-3 rounded-lg border border-indigo-200 bg-white text-slate-800 shadow-2xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="reported">🟣 Reported</option>
                <option value="ai_analyzed">🔵 AI Analyzed</option>
                <option value="assigned">🟠 Assigned</option>
                <option value="in_progress">🟡 In Progress</option>
                <option value="resolved">🟢 Resolved</option>
                <option value="closed">⚫ Closed</option>
              </select>

              <input
                type="text"
                placeholder="Add milestone log or technician notes..."
                value={timelineNotes}
                onChange={(e) => setTimelineNotes(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-indigo-200 bg-white text-slate-800 min-w-[220px]"
              />

              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-2xs transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: AI Analysis Intelligence & Horizontal Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Reasoning Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                AI Diagnostic &amp; Algorithmic Prioritization
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                AI Reasoning Justification
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{issue.aiAnalysis.reasoning}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Severity Rating
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {issue.aiAnalysis.severityScore} / 10
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Based on safety, impact &amp; urgency
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Duplicate Cluster
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {issue.aiAnalysis.similarIssueCount} Nearby
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {issue.aiAnalysis.duplicateProbability}% overlap probability
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Assigned Authority
                </span>
                <span className="text-xs font-bold text-blue-700 block truncate">
                  {issue.aiAnalysis.assignedDepartment}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Auto-routed via skill taxonomy
                </span>
              </div>
            </div>

            {/* Vision tags if any */}
            {issue.aiAnalysis.imageTagsDetected && issue.aiAnalysis.imageTagsDetected.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Computer Vision Features Extracted:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {issue.aiAnalysis.imageTagsDetected.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Issue Resolution Timeline */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Lifecycle Event Timeline
            </h3>

            {/* Horizontal Step Indicator */}
            <div className="relative mb-6">
              <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-200 -z-0" />
              <div className="grid grid-cols-5 relative z-10">
                {timelineSteps.map((step, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                          isPassed
                            ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-1.5 ${
                          isCurrent
                            ? 'text-blue-700'
                            : isPassed
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Event Log */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {issue.timeline.map((event, idx) => (
                <div key={event.id || idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div className="flex-1 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{event.label}</span>
                      <span className="font-mono text-[11px] text-slate-400">{event.timestamp}</span>
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      <span className="font-semibold text-slate-700">{event.actor}</span>
                      {event.notes && <p className="mt-1 text-slate-500 italic">"{event.notes}"</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Evidence & Interactive Map */}
        <div className="space-y-6">
          {/* Photo Evidence Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Evidence &amp; Media
            </h3>

            {issue.images && issue.images.length > 0 ? (
              <div className="space-y-2">
                {issue.images.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-16/10 relative group">
                    <img
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      High-Resolution Capture #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 text-xs">
                No photo evidence attached to this ticket.
              </div>
            )}
          </div>

          {/* Location Details & Map Preview */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Location Verification
            </h3>

            <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-200">
              <div className="font-bold text-slate-800">{issue.location.name}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Zone: {issue.location.zone} · Code: {issue.location.code}
              </div>
              <div className="text-slate-700 font-medium mt-1.5 pt-1.5 border-t border-slate-200">
                📌 {issue.specificLocationDetails}
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-slate-200">
              <CampusMapViewer
                selectedLocationId={issue.location.id}
                interactiveSelectMode={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
