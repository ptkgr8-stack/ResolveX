import React from 'react';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  Building2,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { CampusIssue, UserProfile } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from './../common/StatusBadge';
import { KPICard } from '../common/KPICard';
import { AIInsightsBanner } from '../common/AIInsightsBanner';

interface StudentDashboardProps {
  user: UserProfile;
  issues: CampusIssue[];
  onNavigateToReport: () => void;
  onNavigateToMyIssues: () => void;
  onSelectIssue: (issue: CampusIssue) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  issues,
  onNavigateToReport,
  onNavigateToMyIssues,
  onSelectIssue,
}) => {
  // Compute user statistics
  const userIssues = issues.filter(
    (i) => i.reportedBy.email === user.email || i.reportedBy.name === user.name
  );
  
  const reportedCount = userIssues.length;
  const inProgressCount = userIssues.filter(
    (i) => i.status === 'in_progress' || i.status === 'assigned'
  ).length;
  const resolvedCount = userIssues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
  const criticalCount = userIssues.filter((i) => i.priority === 'critical').length;

  // General campus quick stats
  const totalOpenCampus = issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;
  const resolvedTodayCampus = 28;

  return (
    <div className="space-y-6">
      {/* Welcome & Operations Overview Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {user.department || 'Campus Member Portal'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-500 font-medium">Facilities Service Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track the status of your reported campus maintenance issues and view building announcements.
          </p>
        </div>

        {/* Quick Action: + Report Issue */}
        <button
          type="button"
          onClick={onNavigateToReport}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-2xs transition-colors text-xs shrink-0 self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Maintenance Issue</span>
        </button>
      </div>

      {/* Campus Advisory Feed */}
      <AIInsightsBanner />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          title="Issues Reported"
          value={reportedCount}
          subtitle="Your total submissions"
          icon={FileText}
        />
        <KPICard
          title="In Progress"
          value={inProgressCount}
          subtitle="Assigned to maintenance crews"
          icon={Clock}
        />
        <KPICard
          title="Resolved"
          value={resolvedCount}
          subtitle="Verified technician fixes"
          icon={CheckCircle2}
        />
        <KPICard
          title="Urgent Safety Issues"
          value={criticalCount}
          subtitle="Immediate dispatch category"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Split: Recent Reports vs Campus Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Your Recent Reports
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time status, department routing, and technician assignment
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToMyIssues}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>View All ({userIssues.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of reports */}
            {userIssues.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No active reports found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Notice a defect, plumbing leak, broken light, or hazard? Tap "Report New Maintenance Issue" to notify campus facilities.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userIssues.slice(0, 4).map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 transition-colors cursor-pointer shadow-2xs group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={issue.priority} score={issue.priorityScore} showScore={true} size="sm" />
                        <StatusBadge status={issue.status} size="sm" />
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                          {issue.trackingNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(issue.reportedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {issue.title}
                    </h4>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{issue.location.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{issue.assignedDepartment}</span>
                      </div>
                      {issue.aiAnalysis.safetyHazard && (
                        <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium text-[11px] flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Safety Flagged</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tracking active maintenance updates</span>
            <button
              type="button"
              onClick={onNavigateToReport}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              + Submit another issue
            </button>
          </div>
        </div>

        {/* Right Col: Campus Status Overview */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">
                Campus Facilities Overview
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Campus-wide maintenance resolution status
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Total Active Work Orders</span>
                <span className="text-xl font-bold font-mono text-slate-900">{totalOpenCampus}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                10 Campus Zones
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Work Orders Resolved Today</span>
                <span className="text-xl font-bold font-mono text-emerald-700">{resolvedTodayCampus}</span>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                94% On-Time SLA
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Average Resolution Time</span>
                <span className="text-xl font-bold font-mono text-slate-900">5.4 hrs</span>
              </div>
              <span className="text-[11px] text-slate-500">
                ↓ 14% vs last week
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/90 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-900 text-xs">Active Facility Notice</span>
                <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                  ZONE NOTICE
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-900">
                Hostel Block B (Plumbing Maintenance)
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Plumbing inspection crew on-site addressing pipe pressure. Water service normal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

