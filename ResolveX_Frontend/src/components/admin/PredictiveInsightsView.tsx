import React, { useState } from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { PREDICTIVE_ALERTS } from '../../data/mockData';
import { PredictiveAlert } from '../../types';

interface PredictiveInsightsViewProps {
  onScheduleInspection?: (alert: PredictiveAlert) => void;
}

export const PredictiveInsightsView: React.FC<PredictiveInsightsViewProps> = ({
  onScheduleInspection,
}) => {
  const [scheduledAlertIds, setScheduledAlertIds] = useState<string[]>([]);
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const handleTakeAction = (alert: PredictiveAlert) => {
    if (!scheduledAlertIds.includes(alert.id)) {
      setScheduledAlertIds((prev) => [...prev, alert.id]);
    }
    if (onScheduleInspection) {
      onScheduleInspection(alert);
    }
  };

  // Mock Trend Chart Data
  const trendData = [
    { month: 'May', historical: 48, predicted: 50, prevented: 12 },
    { month: 'Jun', historical: 54, predicted: 52, prevented: 18 },
    { month: 'Jul', historical: 42, predicted: 45, prevented: 22 },
    { month: 'Aug', historical: 61, predicted: 58, prevented: 28 },
    { month: 'Sep (Current)', historical: 67, predicted: 72, prevented: 34 },
    { month: 'Oct (Forecast)', predicted: 84, prevented: 42 },
    { month: 'Nov (Forecast)', predicted: 76, prevented: 39 },
  ];

  // Category Distribution Data
  const categoryData = [
    { name: 'Electrical', count: 32, fill: '#3B82F6' },
    { name: 'Plumbing', count: 28, fill: '#0EA5E9' },
    { name: 'HVAC', count: 18, fill: '#F59E0B' },
    { name: 'IT Networks', count: 24, fill: '#8B5CF6' },
    { name: 'Civil & Paving', count: 14, fill: '#64748B' },
    { name: 'Safety & Security', count: 8, fill: '#EF4444' },
  ];

  // Recurrence Frequency by Zone
  const recurrenceData = [
    { zone: 'Hostel B', recurrenceRate: 88, issues: 17 },
    { zone: 'Library 2F', recurrenceRate: 72, issues: 14 },
    { zone: 'Engineering Labs', recurrenceRate: 64, issues: 9 },
    { zone: 'Dining Commons', recurrenceRate: 51, issues: 8 },
    { zone: 'Sports Pav.', recurrenceRate: 22, issues: 3 },
  ];

  const filteredAlerts = PREDICTIVE_ALERTS.filter(
    (a) => filterUrgency === 'all' || a.urgency === filterUrgency
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-6 shadow-md relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-md bg-blue-600/30 text-blue-400 border border-blue-500/30">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                Preventive Infrastructure Modeling
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Predictive Campus Intelligence
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Continuously parsing historical failure telemetry, environmental stress variables, and client load patterns to prevent campus infrastructure outages before they escalate.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 flex items-center gap-4 text-xs shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Model Accuracy</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400">91.4%</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Prevented Outages</span>
              <span className="text-lg font-mono font-extrabold text-blue-400">34 this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Primary Alert: Hostel Block B — Plumbing (Section 13 Anchor) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-red-500/5 to-slate-50 border-2 border-amber-500/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>High-Risk Recurring Issue Alert</span>
              </span>
              <span className="text-xs font-mono bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                Pattern ID: PAT-PLUMB-HBB-02
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Hostel Block B — Plumbing Riser #2 (Hydraulic Instability)
            </h2>

            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl font-medium">
              Acoustic and flow sensors indicate escalating nocturnal pressure pulses (up to 88 PSI) coupled with 17 historical riser leak events. High likelihood of severe pipe rupture if pressure regulator PRV-2 is not dampening the main line.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Probability</span>
                <span className="text-lg font-extrabold text-red-600 font-mono">78%</span>
                <span className="text-[10px] text-slate-500 block">within 14 days</span>
              </div>

              <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Historical Events</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono">17 Reports</span>
                <span className="text-[10px] text-red-600 font-bold block">↑ 42% trend</span>
              </div>

              <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Responsible Unit</span>
                <span className="text-xs font-bold text-slate-800 block truncate">Plumbing &amp; Water Works</span>
                <span className="text-[10px] text-slate-500 block">Chief R. Gibbs</span>
              </div>

              <div className="bg-white/80 border border-slate-200 rounded-lg p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Potential Downtime</span>
                <span className="text-xs font-bold text-amber-600 block">400+ Residents</span>
                <span className="text-[10px] text-slate-500 block">Water shutoff impact</span>
              </div>
            </div>

            {/* Recommendation callout */}
            <div className="bg-white rounded-xl border border-amber-200 p-3 text-xs text-slate-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Recommended Preventive Action:</strong> Schedule an ultrasound wall-thickness survey and replace mechanical pressure reducing valve (PRV-2) during low-occupancy hours (10:00 - 14:00).
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-2 shrink-0 self-start lg:self-center">
            {scheduledAlertIds.includes('pred-1') ? (
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-5 py-3 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Work Order Scheduled (WO-8821)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleTakeAction(PREDICTIVE_ALERTS[0])}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-xs"
              >
                <Wrench className="w-4 h-4" />
                <span>Schedule Preventive Inspection</span>
              </button>
            )}
            <span className="text-[10px] text-center text-slate-400">
              Dispatches priority ticket to plumbing crew
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Other Active Predictive Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Active Predictive Alert Queue
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 mr-1">Urgency:</span>
            <button
              type="button"
              onClick={() => setFilterUrgency('all')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                filterUrgency === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterUrgency('high')}
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                filterUrgency === 'high' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              High
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.slice(1).map((alert) => {
            const isScheduled = scheduledAlertIds.includes(alert.id);

            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-400 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {alert.category}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-blue-600">
                        {alert.probability}% probability
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {alert.targetLocation}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      alert.urgency === 'high'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {alert.timeframe}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-700">Root Cause Hypothesis:</strong> {alert.rootCauseHypothesis}
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900 mb-0.5">Recommended Action:</div>
                  <div>{alert.recommendedAction}</div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Dept: {alert.department}
                  </span>

                  {isScheduled ? (
                    <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Dispatched
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakeAction(alert)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      <span>Take Action</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Visualizer Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Forecast Line Chart */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Predicted vs. Historical Failure Ingestion
              </h3>
              <p className="text-xs text-slate-500">
                Continuous ML trajectory forecast and preventive mitigations
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              34 Outages Averted
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="historical"
                  name="Historical Reports"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="AI Predicted Load"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="prevented"
                  name="Preventive Interventions"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recurrence Frequency by Campus Zone */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recurring Issue Frequency by Hotspot
              </h3>
              <p className="text-xs text-slate-500">
                Identifies chronic aging infrastructure requiring capital overhaul
              </p>
            </div>
            <span className="text-[10px] font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
              Hostel B Critical
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recurrenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="zone" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="issues" name="Report Count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recurrenceRate" name="Recurrence Index (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
