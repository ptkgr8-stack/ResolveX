import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  MapPin, 
  Wrench,
  Download,
  Calendar,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { CampusIssue, CampusKPIs, PredictiveAlert } from '../../types';
import { KPICard } from '../common/KPICard';
import { AIInsightsBanner } from '../common/AIInsightsBanner';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { CampusMapViewer } from '../common/CampusMapViewer';
import { PREDICTIVE_ALERTS, DEPARTMENT_METRICS } from '../../data/mockData';

interface AdminDashboardProps {
  issues: CampusIssue[];
  kpis: CampusKPIs;
  onNavigateToIssues: () => void;
  onNavigateToMap: () => void;
  onNavigateToPredictions: () => void;
  onNavigateToDepartments: () => void;
  onSelectIssue: (issue: CampusIssue) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  issues,
  kpis,
  onNavigateToIssues,
  onNavigateToMap,
  onNavigateToPredictions,
  onNavigateToDepartments,
  onSelectIssue,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unassigned' | 'in_progress'>('all');

  // Sort critical and high priority issues
  const criticalIssues = issues
    .filter((i) => i.priority === 'critical' || i.priorityScore >= 80)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const displayedIssues = criticalIssues.filter((issue) => {
    if (selectedFilter === 'unassigned') return issue.status === 'reported' || issue.status === 'ai_analyzed';
    if (selectedFilter === 'in_progress') return issue.status === 'in_progress' || issue.status === 'assigned';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Operations Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Facilities Command · Operations Overview
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Live Telemetry Connected</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Infrastructure &amp; Work Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time work order dispatch, automated priority assessment, and preventive building maintenance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeRange === 'today' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateToIssues}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Briefing</span>
          </button>
        </div>
      </div>

      {/* Urgent Dispatch Advisory Strip (when critical issues exist) */}
      {criticalIssues.length > 0 && (
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-red-100 text-red-700 border border-red-200 shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-900">
                Action Required: {criticalIssues.length} Critical Life-Safety Work Orders Active
              </div>
              <p className="text-[11px] text-red-700 mt-0.5">
                Immediate crew dispatch required: {criticalIssues[0]?.title} ({criticalIssues[0]?.location.name})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToIssues}
            className="inline-flex items-center gap-1 text-xs font-bold bg-red-700 hover:bg-red-800 text-white px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors shrink-0 self-end sm:self-center"
          >
            <span>Review &amp; Dispatch ({criticalIssues.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Clean KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KPICard
          title="Open Work Orders"
          value={kpis.totalOpenIssues}
          subtitle="Across 10 campus zones"
          change="+3 since 08:00"
          icon={Layers}
        />
        <KPICard
          title="Critical Issues"
          value={kpis.criticalIssues}
          subtitle="Immediate dispatch queue"
          badgeText="SLA <30m"
          icon={AlertTriangle}
        />
        <KPICard
          title="Response Time (MTTR)"
          value={`${kpis.avgResolutionTimeHours} hrs`}
          subtitle="Campus-wide average"
          change="↓ 14% vs last week"
          isPositiveTrend={true}
          icon={Clock}
        />
        <KPICard
          title="Resolved Today"
          value={kpis.issuesResolvedToday}
          subtitle="Verified technician fixes"
          change="94% SLA on time"
          isPositiveTrend={true}
          icon={CheckCircle2}
        />
        <KPICard
          title="Preventive Alerts"
          value={kpis.activePredictionAlerts}
          subtitle="Equipment health watchlist"
          badgeText="Hostel B alert"
          icon={Wrench}
        />
      </div>

      {/* Facilities Operations Advisory Bar */}
      <AIInsightsBanner onNavigateToPredictions={onNavigateToPredictions} />

      {/* Split Row: Priority Work Order Queue vs Live Campus Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Priority Dispatch Queue */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    High-Priority Work Order Queue
                  </h3>
                  <span className="text-[11px] font-mono font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                    {criticalIssues.length} Urgent
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated priority scoring based on safety risk, location density, and SLA urgency
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToIssues}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 self-start sm:self-center"
              >
                <span>Full Queue ({issues.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-filter chips */}
            <div className="flex items-center gap-1.5 mb-3 border-b border-slate-100 pb-2.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedFilter === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Urgent ({criticalIssues.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('unassigned')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedFilter === 'unassigned' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Needs Dispatch
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('in_progress')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedFilter === 'in_progress' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                In Progress
              </button>
            </div>

            <div className="space-y-2.5">
              {displayedIssues.slice(0, 4).map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 cursor-pointer transition-colors shadow-2xs group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={issue.priority} score={issue.priorityScore} showScore={true} size="sm" />
                      <StatusBadge status={issue.status} size="sm" />
                      <span className="font-mono text-[11px] text-slate-500 font-medium">
                        {issue.trackingNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      SLA: {issue.aiAnalysis.estimatedResponseTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {issue.title}
                  </h4>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{issue.location.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{issue.assignedDepartment}</span>
                      </div>
                    </div>

                    <span className="text-blue-600 font-semibold group-hover:underline text-[11px]">
                      Dispatch / Details &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dynamic priority recalculation enabled</span>
            <button
              type="button"
              onClick={onNavigateToIssues}
              className="text-blue-600 hover:underline font-semibold"
            >
              Filter by Department &amp; Status
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Facility Map & Spatial Incident Density */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Campus Facility Density Map
                </h3>
                <p className="text-xs text-slate-500">
                  Spatial distribution and thermal issue clustering
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToMap}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200">
              <CampusMapViewer
                issues={issues}
                showHeatmapDefault={true}
                onViewIssueDetails={onSelectIssue}
              />
            </div>
          </div>

          <div className="mt-3.5 bg-amber-50/80 border border-amber-200/90 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">Hostel Block B Plumbing Risk Alert</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                17 reports recorded in past 60 days. Model forecasts 78% probability of secondary pipe rupture within 14 days.
              </p>
              <button
                type="button"
                onClick={onNavigateToPredictions}
                className="mt-1.5 text-[11px] font-bold text-amber-900 underline hover:text-amber-950"
              >
                Schedule Preventive Inspection Work Order &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Department Workload Snapshot & Featured Predictive Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workloads */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Department Crew Dispatch Status
              </h3>
              <p className="text-xs text-slate-500">
                Active technician workloads, response SLAs, and open work orders
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToDepartments}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage Crews &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {DEPARTMENT_METRICS.slice(0, 4).map((dept) => (
              <div
                key={dept.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{dept.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Lead: {dept.head} · Ext {dept.contactExtension}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-mono font-bold text-slate-900 block">
                      {dept.openIssues} Open
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {dept.criticalIssues} critical
                    </span>
                  </div>

                  <div className="w-16">
                    <span className="font-mono font-bold text-emerald-700 block">
                      {dept.slaPerformance}%
                    </span>
                    <span className="text-[10px] text-slate-500">SLA rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Maintenance Watchlist */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Preventive Maintenance Watchlist
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-failure equipment risk models and recommended inspections
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToPredictions}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All Models &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {PREDICTIVE_ALERTS.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{alert.targetLocation}</span>
                    <span className="font-mono font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[11px]">
                      {alert.probability}% Failure Risk
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {alert.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Preventive servicing reduces emergency downtime by 38%</span>
            <button
              type="button"
              onClick={onNavigateToPredictions}
              className="text-blue-600 font-semibold hover:underline"
            >
              View Inspection Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

