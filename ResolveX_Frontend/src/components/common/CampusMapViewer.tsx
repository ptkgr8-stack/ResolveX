import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  Flame, 
  Compass, 
  CheckCircle2, 
  Crosshair, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { CampusIssue, CampusLocation } from '../../types';
import { CAMPUS_LOCATIONS } from '../../data/mockData';
import { PriorityBadge } from './PriorityBadge';

interface CampusMapViewerProps {
  issues?: CampusIssue[];
  selectedLocationId?: string;
  onSelectLocation?: (location: CampusLocation) => void;
  interactiveSelectMode?: boolean; // When in Report form
  showHeatmapDefault?: boolean;
  onViewIssueDetails?: (issue: CampusIssue) => void;
}

export const CampusMapViewer: React.FC<CampusMapViewerProps> = ({
  issues = [],
  selectedLocationId,
  onSelectLocation,
  interactiveSelectMode = false,
  showHeatmapDefault = false,
  onViewIssueDetails,
}) => {
  const [showHeatmap, setShowHeatmap] = useState(showHeatmapDefault);
  const [activeZone, setActiveZone] = useState<string>('all');
  const [inspectedLocation, setInspectedLocation] = useState<CampusLocation | null>(null);

  // Group issues by location ID
  const issuesByLocation = issues.reduce<Record<string, CampusIssue[]>>((acc, issue) => {
    const locId = issue.location.id;
    if (!acc[locId]) acc[locId] = [];
    acc[locId].push(issue);
    return acc;
  }, {});

  const handleBuildingClick = (loc: CampusLocation) => {
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
    setInspectedLocation(loc);
  };

  const getHeatmapColor = (count: number) => {
    if (count >= 5) return 'rgba(239, 68, 68, 0.45)'; // Red
    if (count >= 3) return 'rgba(249, 115, 22, 0.4)'; // Orange
    if (count >= 1) return 'rgba(245, 158, 11, 0.35)'; // Amber
    return 'rgba(59, 130, 246, 0.15)'; // Blue subtle
  };

  const selectedLoc = CAMPUS_LOCATIONS.find(l => l.id === selectedLocationId);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 text-white overflow-hidden shadow-lg flex flex-col">
      {/* Map Control Toolbar */}
      <div className="bg-slate-950/80 backdrop-blur-xs border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Campus Infrastructure Digital Twin
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            Grid Scale 1:500
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zone filter */}
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveZone('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeZone === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All Zones
            </button>
            <button
              type="button"
              onClick={() => setActiveZone('South Campus')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeZone === 'South Campus'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              South (Hostels)
            </button>
            <button
              type="button"
              onClick={() => setActiveZone('North Campus')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeZone === 'North Campus'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              North (Labs)
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Heatmap Toggle */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
              showHeatmap
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Density Heatmap</span>
          </button>
        </div>
      </div>

      {/* Main Map SVG Stage */}
      <div className="relative w-full aspect-16/10 min-h-[380px] bg-slate-950 overflow-hidden select-none">
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
            </pattern>
            <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#campusGlow)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Campus Road / Pathways SVG Layers */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Main Academic Ring Road */}
          <path
            d="M 150 120 Q 500 80 850 140 T 900 480 Q 500 520 180 480 Z"
            fill="none"
            stroke="#1e293b"
            strokeWidth="24"
            strokeLinejoin="round"
          />
          <path
            d="M 150 120 Q 500 80 850 140 T 900 480 Q 500 520 180 480 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Central Promenade */}
          <line x1="500" y1="90" x2="500" y2="500" stroke="#1e293b" strokeWidth="16" />
          <line x1="200" y1="300" x2="850" y2="300" stroke="#1e293b" strokeWidth="12" />

          {/* Campus Green Quadrangles */}
          <rect x="360" y="160" width="130" height="90" rx="8" fill="#064e3b" opacity="0.25" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="520" y="320" width="140" height="110" rx="8" fill="#064e3b" opacity="0.25" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Zone Labels */}
        <div className="absolute top-4 left-6 pointer-events-none text-[11px] font-mono uppercase text-slate-500 tracking-widest">
          North Academic Sector
        </div>
        <div className="absolute bottom-4 left-6 pointer-events-none text-[11px] font-mono uppercase text-slate-500 tracking-widest">
          South Residential Sector
        </div>
        <div className="absolute top-4 right-6 pointer-events-none text-[11px] font-mono uppercase text-slate-500 tracking-widest">
          East Athletics &amp; Labs
        </div>

        {/* Heatmap Layer Overlays */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none">
            {CAMPUS_LOCATIONS.map(loc => {
              const locIssues = issuesByLocation[loc.id] || [];
              const count = locIssues.length;
              if (count === 0) return null;

              const isHostelB = loc.code === 'HBB';
              const radius = isHostelB ? 90 : Math.max(50, count * 22);

              return (
                <div
                  key={`heat-${loc.id}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 blur-xl pointer-events-none animate-pulse"
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`,
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    backgroundColor: getHeatmapColor(isHostelB ? 17 : count),
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Building Footprints and Interactive Nodes */}
        {CAMPUS_LOCATIONS.map(loc => {
          const locIssues = issuesByLocation[loc.id] || [];
          const count = locIssues.length;
          const isSelected = selectedLocationId === loc.id;
          const isInspected = inspectedLocation?.id === loc.id;
          const hasCritical = locIssues.some(i => i.priority === 'critical');
          const isDimmed = activeZone !== 'all' && loc.zone !== activeZone;

          return (
            <div
              key={loc.id}
              onClick={() => handleBuildingClick(loc)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                isDimmed ? 'opacity-30 pointer-events-none' : 'opacity-100 hover:z-30'
              }`}
              style={{
                left: `${loc.coordinates.x}%`,
                top: `${loc.coordinates.y}%`,
              }}
            >
              {/* Critical Pulse Ring */}
              {hasCritical && (
                <div className="absolute inset-0 -m-3 rounded-xl border border-red-500/80 animate-ping pointer-events-none" />
              )}

              {/* Building Card Node */}
              <div
                className={`relative px-3 py-2 rounded-lg border text-left transition-all duration-200 shadow-md ${
                  isSelected || isInspected
                    ? 'bg-blue-600 border-blue-400 text-white scale-105 ring-2 ring-blue-400/50 z-20'
                    : hasCritical
                    ? 'bg-red-950/90 border-red-500/80 text-white hover:border-red-400'
                    : count > 0
                    ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-blue-500 hover:bg-slate-800'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${hasCritical ? 'text-red-400' : 'text-blue-400'}`} />
                  <span className="font-mono text-xs font-bold tracking-tight">
                    {loc.code}
                  </span>

                  {/* Issue Counter Badge */}
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                        hasCritical ? 'bg-red-600 text-white' : 'bg-slate-700 text-blue-200'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-medium text-slate-300 whitespace-nowrap mt-0.5 max-w-[130px] truncate">
                  {loc.name}
                </div>

                {/* Pin indicator when in report mode */}
                {isSelected && (
                  <div className="absolute -top-3 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Selected or Interactive helper notice */}
        {interactiveSelectMode && (
          <div className="absolute bottom-3 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span className="text-slate-300">Click any campus building or node to pin location</span>
          </div>
        )}
      </div>

      {/* Inspected Area Drawer / Bottom Summary */}
      {inspectedLocation && (
        <div className="bg-slate-950 border-t border-slate-800 p-4 transition-all">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 text-xs font-mono font-bold border border-blue-800">
                  {inspectedLocation.code}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {inspectedLocation.name}
                </h4>
                <span className="text-xs text-slate-400">
                  ({inspectedLocation.zone})
                </span>
              </div>

              {/* Special insight callout if Hostel Block B */}
              {inspectedLocation.code === 'HBB' && (
                <div className="mt-2 inline-flex items-center gap-2 bg-red-950/60 border border-red-800/80 px-2.5 py-1 rounded text-xs text-red-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>
                    <strong>Hostel Block B:</strong> 17 issues recorded · <span className="text-red-300 font-semibold">↑ 42% from last month</span> (Plumbing recurrence hotspot)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {(issuesByLocation[inspectedLocation.id] || []).length} Active Reports
              </span>
              <button
                type="button"
                onClick={() => setInspectedLocation(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded border border-slate-800"
              >
                Close
              </button>
            </div>
          </div>

          {/* List of active issues in this location */}
          {(issuesByLocation[inspectedLocation.id] || []).length > 0 && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {(issuesByLocation[inspectedLocation.id] || []).map(iss => (
                <div
                  key={iss.id}
                  onClick={() => onViewIssueDetails && onViewIssueDetails(iss)}
                  className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <PriorityBadge priority={iss.priority} size="sm" />
                      <span className="text-[11px] font-mono text-slate-400">
                        {iss.trackingNumber}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {iss.title}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
