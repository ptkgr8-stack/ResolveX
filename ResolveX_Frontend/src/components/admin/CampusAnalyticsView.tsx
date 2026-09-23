import React from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Users,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { CampusIssue, DepartmentMetric } from '../../types';
import { DEPARTMENT_METRICS } from '../../data/mockData';

interface CampusAnalyticsViewProps {
  issues: CampusIssue[];
}

export const CampusAnalyticsView: React.FC<CampusAnalyticsViewProps> = ({ issues }) => {
  // Weekly trend
  const weeklyData = [
    { day: 'Mon', reported: 18, resolved: 14, critical: 2 },
    { day: 'Tue', reported: 24, resolved: 21, critical: 4 },
    { day: 'Wed', reported: 20, resolved: 19, critical: 1 },
    { day: 'Thu', reported: 29, resolved: 26, critical: 5 },
    { day: 'Fri', reported: 34, resolved: 28, critical: 3 },
    { day: 'Sat', reported: 15, resolved: 17, critical: 1 },
    { day: 'Sun', reported: 11, resolved: 12, critical: 0 },
  ];

  // Category counts
  const categoryCounts: Record<string, number> = {};
  issues.forEach((i) => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  const categoryPieData = [
    { name: 'Electrical', value: categoryCounts['Electrical'] || 18, color: '#3B82F6' },
    { name: 'Plumbing', value: categoryCounts['Plumbing & Water'] || 22, color: '#0EA5E9' },
    { name: 'HVAC', value: categoryCounts['HVAC & Climate'] || 11, color: '#F59E0B' },
    { name: 'IT Networks', value: categoryCounts['Internet & Network'] || 14, color: '#8B5CF6' },
    { name: 'Civil', value: categoryCounts['Civil & Structural'] || 16, color: '#64748B' },
    { name: 'Security', value: categoryCounts['Security & Safety'] || 5, color: '#EF4444' },
    { name: 'Sanitation', value: categoryCounts['Sanitation & Waste'] || 9, color: '#10B981' },
  ];

  const departmentPerformanceData = DEPARTMENT_METRICS.map(dept => ({
    name: dept.name.replace(' Maintenance', '').replace(' & Infrastructure', '').replace(' & Networks', '').replace(' & Water Works', '').replace(' & Energy', '').replace(' & Facilities', ''),
    sla: dept.slaPerformance,
    open: dept.openIssues,
    avgHours: dept.avgResolutionHours,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Infrastructure Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Holistic cross-facility telemetry, SLA fulfillment ratios, and workload throughput
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Fall Semester Active Window (Wk 4)</span>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Ingested Issues
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">151</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            +18% automated triage rate
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Campus SLA
          </span>
          <div className="text-3xl font-extrabold font-mono text-blue-600 mt-2">92.4%</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            SLA target: &gt;90%
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            MTTR (Mean Time to Resolve)
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900 mt-2">5.4 hrs</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            ↓ 1.2 hrs faster vs manual
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Duplicate Tickets Filtered
          </span>
          <div className="text-3xl font-extrabold font-mono text-purple-600 mt-2">34.2%</div>
          <span className="text-xs text-purple-700 font-semibold mt-1 inline-block">
            Merged into active clusters
          </span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Ingestion vs Resolution (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Weekly Reporting &amp; Resolution Velocity
              </h3>
              <p className="text-xs text-slate-500">
                7-day rolling cadence of submissions vs. technician sign-offs
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Peak: Friday 34 reports
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="reported" name="New Reports Ingested" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved & Closed" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" name="Critical Priority" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Infrastructure domain breakdown
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {categoryPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-mono font-bold text-slate-800 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department SLA & Resolution Times */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Department SLA &amp; Resolution Performance Benchmark
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Compares target response compliance vs. average resolution duration
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="sla" name="SLA Compliance %" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgHours" name="Avg Hours to Fix" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="open" name="Active Tickets" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
