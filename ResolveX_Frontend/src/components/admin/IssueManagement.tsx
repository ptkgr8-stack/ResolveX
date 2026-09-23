import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Building2, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  SlidersHorizontal,
  Download,
  Eye
} from 'lucide-react';
import { CampusIssue, IssuePriority, IssueStatus } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

interface IssueManagementProps {
  issues: CampusIssue[];
  onSelectIssue: (issue: CampusIssue) => void;
  onUpdateIssueStatus?: (issueId: string, status: IssueStatus) => void;
}

export const IssueManagement: React.FC<IssueManagementProps> = ({
  issues,
  onSelectIssue,
  onUpdateIssueStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('priority');

  const filteredIssues = issues
    .filter((issue) => {
      const matchSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
      const matchCategory = categoryFilter === 'all' || issue.category === categoryFilter;
      const matchDept = departmentFilter === 'all' || issue.assignedDepartment === departmentFilter;
      const matchStatus = statusFilter === 'all' || issue.status === statusFilter;

      return matchSearch && matchPriority && matchCategory && matchDept && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priorityScore - a.priorityScore; // Highest priority first
      }
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

  const calculateAge = (isoDate: string) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return '< 1 hr ago';
    if (diffHours < 24) return `${diffHours} hrs ago`;
    const days = Math.floor(diffHours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              Priority Dispatch Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Issue Priority Queue
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Auto-ranked by neural severity assessment, threat to life safety, and infrastructural recurrence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'priority' ? 'date' : 'priority')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Sort: {sortBy === 'priority' ? 'Priority Score (High-Low)' : 'Latest Reported'}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issue title, code, or building..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Priorities</option>
            <option value="critical">🔴 Critical Risk</option>
            <option value="high">🟠 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          {/* Department filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Departments</option>
            <option value="Electrical Maintenance">Electrical</option>
            <option value="Plumbing & Water Works">Plumbing</option>
            <option value="Campus IT & Networks">IT & Networks</option>
            <option value="Sanitation & Facilities">Sanitation</option>
            <option value="Civil & Infrastructure">Civil</option>
            <option value="Campus Security">Security</option>
            <option value="HVAC & Energy">HVAC</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="ai_analyzed">AI Analyzed</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Displaying <strong>{filteredIssues.length}</strong> of {issues.length} campus work orders
          </span>
          {(priorityFilter !== 'all' || categoryFilter !== 'all' || departmentFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('all');
                setCategoryFilter('all');
                setDepartmentFilter('all');
                setStatusFilter('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Large Priority Queue Table (Responsive Desktop Table + Mobile Cards) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Priority &amp; Score</th>
                <th className="py-3.5 px-4">Issue Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Age</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => {
                const isCritical = issue.priority === 'critical';

                return (
                  <tr
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isCritical ? 'bg-red-50/20' : ''
                    }`}
                  >
                    {/* Priority & Score Column */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <PriorityBadge priority={issue.priority} size="sm" />
                        <span className="font-mono font-extrabold text-sm text-slate-900">
                          {issue.priorityScore}
                          <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        </span>
                      </div>
                    </td>

                    {/* Issue Details */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-mono text-[10px] text-slate-400">
                        {issue.trackingNumber}
                      </div>
                      <div className="font-bold text-slate-900 truncate hover:text-blue-600">
                        {issue.title}
                      </div>
                      {issue.aiAnalysis.safetyHazard && (
                        <span className="text-[10px] text-red-600 font-semibold inline-flex items-center gap-0.5">
                          ⚠️ Hazard Alert
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {issue.location.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {issue.location.code} · {issue.location.zone}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {issue.category}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{issue.assignedDepartment}</span>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500">
                      {calculateAge(issue.reportedAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIssue(issue);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Responsive Cards */}
        <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={issue.priority} score={issue.priorityScore} showScore={true} size="sm" />
                  <StatusBadge status={issue.status} size="sm" />
                </div>
                <span className="font-mono text-[10px] text-slate-400">{issue.trackingNumber}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{issue.title}</h4>

              <div className="text-xs text-slate-500 space-y-1">
                <div>📍 {issue.location.name}</div>
                <div>🏢 {issue.assignedDepartment}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
