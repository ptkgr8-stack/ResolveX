
import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Building2,
  PlusCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

import { CampusIssue } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

interface MyIssuesViewProps {
  issues: CampusIssue[];
  onSelectIssue: (issue: CampusIssue) => void;
  onNavigateToReport: () => void;
  userEmail: string;
}

type IssueRecord = CampusIssue & {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  priority: string;
  status: string;
  location: string | { name?: string } | null;
  trackingNumber?: string;
  reportedAt?: string;
  created_at?: string;
  assignedDepartment?: string;
  priorityScore?: number;
  aiAnalysis?: {
    estimatedResponseTime?: string;
    safetyHazard?: boolean;
  } | null;
};

const normaliseStatus = (status: string): string =>
  status.toLowerCase().replace(/[_-]+/g, ' ').trim();

const normalisePriority = (priority: string): string =>
  priority.toLowerCase().trim();

const getLocationName = (
  location: IssueRecord['location'],
): string => {
  if (typeof location === 'string') return location;
  return location?.name || 'Location not specified';
};

const getTrackingNumber = (issue: IssueRecord): string =>
  issue.trackingNumber || `RX-${String(issue.id).padStart(4, '0')}`;

const getReportedDate = (issue: IssueRecord): string => {
  const date = issue.reportedAt || issue.created_at;

  if (!date) return 'Date unavailable';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDepartment = (issue: IssueRecord): string =>
  issue.assignedDepartment || issue.category || 'Awaiting assignment';

export const MyIssuesView: React.FC<MyIssuesViewProps> = ({
  issues,
  onSelectIssue,
  onNavigateToReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // The authenticated backend endpoint already filters reports by user.
  const myIssues = issues as IssueRecord[];

  const filtered = myIssues.filter((issue) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      issue.title.toLowerCase().includes(query) ||
      getTrackingNumber(issue).toLowerCase().includes(query) ||
      getLocationName(issue.location).toLowerCase().includes(query) ||
      (issue.category || '').toLowerCase().includes(query);

    const status = normaliseStatus(issue.status);
    const priority = normalisePriority(issue.priority);

    const matchesStatus =
      statusFilter === 'all' ||
      status === normaliseStatus(statusFilter);

    const matchesPriority =
      priorityFilter === 'all' ||
      priority === normalisePriority(priorityFilter);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Campus Reports
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track the status and priority of the campus issues you have reported.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToReport}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-xs self-start sm:self-auto transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by title, tracking number, building, or category..."
            aria-label="Search your reports"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter reports by status"
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            aria-label="Filter reports by priority"
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">🔴 Critical</option>
            <option value="High">🟠 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No matching reports found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search or filters, or submit a new campus
            maintenance report.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => {
            const locationName = getLocationName(issue.location);
            const trackingNumber = getTrackingNumber(issue);
            const department = getDepartment(issue);

            return (
              <div
                key={issue.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectIssue(issue)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectIssue(issue);
                  }
                }}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-500 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PriorityBadge
                      priority={issue.priority}
                      score={issue.priorityScore}
                      showScore={true}
                      size="sm"
                    />

                    <StatusBadge status={issue.status} size="sm" />

                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {trackingNumber}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    {getReportedDate(issue)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {issue.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                      {issue.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">
                        {locationName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>{department}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    {issue.aiAnalysis?.estimatedResponseTime
                      ? `Estimated response: ${issue.aiAnalysis.estimatedResponseTime}`
                      : 'Response estimate unavailable'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
