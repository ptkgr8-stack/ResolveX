import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  Droplets, 
  Wifi, 
  Trash2, 
  HardHat, 
  ShieldAlert, 
  Thermometer,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DepartmentMetric, DepartmentName } from '../../types';
import { DEPARTMENT_METRICS } from '../../data/mockData';

interface DepartmentManagementProps {
  onFilterByDepartment?: (deptName: DepartmentName) => void;
}

export const DepartmentManagement: React.FC<DepartmentManagementProps> = ({
  onFilterByDepartment,
}) => {
  const [departments, setDepartments] = useState<DepartmentMetric[]>(DEPARTMENT_METRICS);
  const [selectedDept, setSelectedDept] = useState<DepartmentMetric | null>(null);

  const getDeptIcon = (name: DepartmentName) => {
    switch (name) {
      case 'Electrical Maintenance': return Zap;
      case 'Plumbing & Water Works': return Droplets;
      case 'Campus IT & Networks': return Wifi;
      case 'Sanitation & Facilities': return Trash2;
      case 'Civil & Infrastructure': return HardHat;
      case 'Campus Security': return ShieldAlert;
      case 'HVAC & Energy': return Thermometer;
      default: return Building2;
    }
  };

  const getWorkloadBadge = (workload: string) => {
    switch (workload) {
      case 'Optimal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Elevated':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Near Capacity':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Operational Fleet &amp; Facilities
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Department Operations &amp; Dispatch Rosters
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Automated ticket routing targets, duty shift supervisors, and active crew capacity
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Users className="w-4 h-4 text-blue-600" />
          <span><strong>96 Active Field Technicians</strong> on duty across campus</span>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const Icon = getDeptIcon(dept.name);
          const hasCritical = dept.criticalIssues > 0;

          return (
            <div
              key={dept.id}
              className={`bg-white rounded-xl border p-5 shadow-xs hover:shadow-md transition-all space-y-4 ${
                hasCritical ? 'border-slate-200 hover:border-red-400' : 'border-slate-200/90 hover:border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">Head: {dept.head}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getWorkloadBadge(
                    dept.currentWorkload
                  )}`}
                >
                  {dept.currentWorkload}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Open Issues
                  </span>
                  <span className="text-lg font-extrabold font-mono text-slate-900">
                    {dept.openIssues}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Critical Tickets
                  </span>
                  <span
                    className={`text-lg font-extrabold font-mono ${
                      dept.criticalIssues > 0 ? 'text-red-600' : 'text-slate-700'
                    }`}
                  >
                    {dept.criticalIssues}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Avg Resolution
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {dept.avgResolutionHours} hrs
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    SLA Compliance
                  </span>
                  <span className="text-sm font-extrabold font-mono text-emerald-600">
                    {dept.slaPerformance}%
                  </span>
                </div>
              </div>

              {/* Footer info & action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dept.contactExtension}</span>
                </div>

                {onFilterByDepartment && (
                  <button
                    type="button"
                    onClick={() => onFilterByDepartment(dept.name)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>Queue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
