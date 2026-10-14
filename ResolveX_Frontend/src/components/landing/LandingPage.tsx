import React from 'react';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  Scan, 
  Copy, 
  GitFork, 
  TrendingUp, 
  BarChart3, 
  Flame, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin,
  Cpu
} from 'lucide-react';
import { CampusLogo } from '../common/CampusLogo';

interface LandingPageProps {
  onStartReporting: () => void;
  onExploreHowItWorks: () => void;
  onLogin: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartReporting,
  onExploreHowItWorks,
  onLogin,
  onGetStarted,
}) => {
  return (
    <div className="bg-white text-slate-900 selection:bg-[#0b1f44] selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (Matches Screenshot 1) */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle coordinate grid background */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#campusGrid)" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status Tag Pill */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200/90 rounded-md px-3 py-1 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-slate-600 font-medium tracking-tight">
                AI MESH ONLINE — 98.4% PRECISION ROUTING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0a1e42] tracking-tight leading-[1.08]">
              Turn Campus<br />
              Problems Into<br />
              Intelligent Action.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              An AI-powered campus issue reporting platform that automatically understands, prioritizes and routes problems — while predicting recurring issues before they become bigger.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartReporting}
                className="inline-flex items-center gap-2 bg-[#0a1e42] hover:bg-[#0f2852] text-white font-semibold px-6 py-3.5 rounded-lg text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreHowItWorks}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-lg border border-slate-300 text-sm shadow-2xs transition-colors cursor-pointer"
              >
                <span>View How It Works</span>
              </button>
            </div>

            {/* Stats Row (47 ACTIVE ISSUES | 5.4h AVG RESOLUTION | 12 PREDICTIONS ACTIVE) */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200/80 max-w-lg">
              <div className="border-l-2 border-[#0a1e42] pl-3">
                <div className="text-3xl font-extrabold text-[#0a1e42] font-sans tracking-tight">
                  47
                </div>
                <div className="text-[10px] font-mono font-medium tracking-wider text-slate-500 uppercase mt-1">
                  ACTIVE ISSUES
                </div>
              </div>

              <div className="border-l-2 border-[#0a1e42] pl-3">
                <div className="text-3xl font-extrabold text-[#0a1e42] font-sans tracking-tight">
                  5.4h
                </div>
                <div className="text-[10px] font-mono font-medium tracking-wider text-slate-500 uppercase mt-1">
                  AVG RESOLUTION
                </div>
              </div>

              <div className="border-l-2 border-[#0a1e42] pl-3">
                <div className="text-3xl font-extrabold text-[#0a1e42] font-sans tracking-tight">
                  12
                </div>
                <div className="text-[10px] font-mono font-medium tracking-wider text-slate-500 uppercase mt-1">
                  PREDICTIONS ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Mockup ("campus-twin.live") */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Window Titlebar */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
                {/* 3 Window Dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                </div>

                {/* Center Title */}
                <div className="font-mono text-slate-500 text-[11px]">
                  campus-twin.live
                </div>

                {/* Right Status */}
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>REAL-TIME</span>
                </div>
              </div>

              {/* Window Body: Map + Side Panels */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 bg-white">
                {/* Left Side: Campus Issue Density GIS Coordinate Map */}
                <div className="md:col-span-7 flex flex-col justify-between border border-slate-200/90 rounded-xl p-3 bg-white relative">
                  <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      CAMPUS ISSUE DENSITY
                    </span>
                    <span className="font-mono text-[11px] font-bold text-red-600">
                      4 Critical
                    </span>
                  </div>

                  {/* Visual Coordinate Map with Bullets and Translucent Halos */}
                  <div className="relative h-64 sm:h-72 w-full bg-slate-50/50 rounded-lg overflow-hidden border border-slate-100 p-2">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="twinGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#CBD5E1" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#twinGrid)" />
                      </svg>
                    </div>

                    {/* Building Nodes with Halos matching Image 1 */}
                    {/* 1. Admin Building */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center group cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-blue-400/20 mx-auto flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      </div>
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight mt-0.5">
                        Admin Building
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">4 issues</div>
                    </div>

                    {/* 2. Engineering Block */}
                    <div className="absolute top-16 right-12 text-center group cursor-pointer">
                      <div className="w-14 h-14 rounded-full bg-amber-500/20 mx-auto flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-amber-600" />
                      </div>
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Engineering Block
                      </div>
                      <div className="text-[9px] font-mono font-bold text-amber-700">12 issues</div>
                    </div>

                    {/* 3. Hostel Block A */}
                    <div className="absolute top-20 left-4 text-center group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-amber-500/15 mx-auto flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      </div>
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Hostel Block A
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">9 issues</div>
                    </div>

                    {/* 4. Hostel Block B (Prominent RED Hotspot with Pulsing Rings) */}
                    <div className="absolute bottom-12 left-16 text-center group cursor-pointer z-10">
                      <div className="relative w-16 h-16 rounded-full bg-red-500/20 mx-auto flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-60" />
                        <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-xs" />
                      </div>
                      <div className="text-[10px] font-bold text-red-900 leading-tight">
                        Hostel Block B
                      </div>
                      <div className="text-[9px] font-mono font-bold text-red-600">17 issues</div>
                    </div>

                    {/* 5. Library 2nd Floor & Central Library */}
                    <div className="absolute top-28 right-8 text-center group cursor-pointer">
                      <div className="w-14 h-14 rounded-full bg-amber-500/20 mx-auto flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      </div>
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Library 2nd Floor
                      </div>
                      <div className="text-[9px] font-mono font-medium text-slate-600">11 issues</div>
                      <div className="text-[9px] font-mono text-slate-400">8 issues</div>
                    </div>

                    {/* 6. Central Cafeteria */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      </div>
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Central Cafeteria
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">6 issues</div>
                    </div>

                    {/* 7. Parking Lot A */}
                    <div className="absolute bottom-2 left-2 text-center group cursor-pointer">
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Parking Lot A
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">7 issues</div>
                    </div>

                    {/* 8. Auditorium */}
                    <div className="absolute bottom-1 left-1/3 text-center group cursor-pointer">
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Auditorium
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">5 issues</div>
                    </div>

                    {/* 9. Sports Complex */}
                    <div className="absolute bottom-2 right-4 text-center group cursor-pointer">
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                        Sports Complex
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">3 issues</div>
                    </div>
                  </div>

                  {/* Bottom Map Legend (CRITICAL / HIGH / MEDIUM / LOW) */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-[10px] font-mono uppercase text-slate-600">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>CRITICAL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>HIGH</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>MEDIUM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>LOW</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Stacked 3 Cards */}
                <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
                  {/* Card 1: AI CLASSIFICATION FEED */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>AI CLASSIFICATION FEED</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>LIVE</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">
                          Washroom plumbing le...
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        P74
                      </span>
                    </div>

                    {/* Segmented status line */}
                    <div className="grid grid-cols-6 gap-1 pt-1">
                      <div className="h-1 bg-slate-200 rounded-full" />
                      <div className="h-1 bg-slate-200 rounded-full" />
                      <div className="h-1 bg-slate-200 rounded-full" />
                      <div className="h-1 bg-slate-200 rounded-full" />
                      <div className="h-1 bg-blue-600 rounded-full" />
                      <div className="h-1 bg-blue-600 rounded-full" />
                    </div>
                  </div>

                  {/* Card 2: SYSTEM STATUS (Dark Navy Box) */}
                  <div className="bg-[#0b1f44] text-white rounded-xl p-3.5 shadow-sm space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-blue-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>SYSTEM STATUS</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div>
                        <div className="text-2xl font-extrabold text-white font-sans tracking-tight">
                          96%
                        </div>
                        <div className="text-[9px] font-mono tracking-wider text-blue-200/70 uppercase">
                          AI ACCURACY
                        </div>
                      </div>

                      <div>
                        <div className="text-2xl font-extrabold text-white font-sans tracking-tight">
                          14
                        </div>
                        <div className="text-[9px] font-mono tracking-wider text-blue-200/70 uppercase">
                          RESOLVED TODAY
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: TOP HOTSPOT */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1">
                    <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      TOP HOTSPOT
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Hostel Block B</span>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-red-600">
                      17 issues · ↑ 42% MoM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. HOW IT WORKS / INTELLIGENCE PIPELINE (Matches Screenshot 2) */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center space-y-2 mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
            THE INTELLIGENCE PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1e42] tracking-tight">
            How It Works
          </h2>
        </div>

        {/* 4 Connected Cards in a Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Card 01: Report */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-extrabold text-slate-300 font-sans">
                01
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Scan className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Report
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Student submits a problem with text, image and location.
            </p>
          </div>

          {/* Card 02: AI Understands */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-extrabold text-slate-300 font-sans">
                02
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              AI Understands
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              AI identifies issue type, severity and relevant department.
            </p>
          </div>

          {/* Card 03: Intelligent Prioritization */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-extrabold text-slate-300 font-sans">
                03
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Intelligent Prioritization
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Priority calculated from severity, impact, urgency and recurrence.
            </p>
          </div>

          {/* Card 04: Predict & Prevent */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-extrabold text-slate-300 font-sans">
                04
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Predict &amp; Prevent
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Historical data analyzed to flag recurring problems and recommend action.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. CORE CAPABILITIES (Matches Screenshot 3) */}
      {/* ------------------------------------------------------------- */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center space-y-2 mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
            CORE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1e42] tracking-tight">
            Built for Intelligent Campus Operations
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
            Eight AI systems working together to understand, prioritize, route and predict — so nothing falls through the cracks.
          </p>
        </div>

        {/* 8 Cards in 4x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. AI Issue Classification */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              AI Issue Classification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Natural language understanding auto-categorizes every report.
            </p>
          </div>

          {/* 2. Smart Priority Scoring */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Smart Priority Scoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Weighted scoring across severity, impact and urgency.
            </p>
          </div>

          {/* 3. Image-Based Analysis */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Image-Based Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Computer vision detects hazards from uploaded photos.
            </p>
          </div>

          {/* 4. Duplicate Detection */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Duplicate Detection
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Similar reports merged to prevent redundant dispatch.
            </p>
          </div>

          {/* 5. Automatic Department Routing */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Automatic Department Routing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Issues routed to the right team instantly.
            </p>
          </div>

          {/* 6. Predictive Maintenance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Predictive Maintenance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              ML forecasts recurring failures before they happen.
            </p>
          </div>

          {/* 7. Real-Time Analytics */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Real-Time Analytics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Live operational metrics across the entire campus.
            </p>
          </div>

          {/* 8. Campus Issue Heatmaps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Campus Issue Heatmaps
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Spatial density reveals infrastructure hotspots.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. ALWAYS-ON INTELLIGENCE (Matches Screenshot 4) */}
      {/* ------------------------------------------------------------- */}
      <section id="ai-insights" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading + 4 Notification Pills */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
                ALWAYS-ON INTELLIGENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1e42] tracking-tight">
                An AI assistant that never stops watching.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                ResolveX continuously analyzes issue patterns, surfaces anomalies, and recommends preventive action — embedded directly into your operations dashboard.
              </p>
            </div>

            {/* 4 Notification Cards */}
            <div className="space-y-3 pt-2">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Electrical issues increased 23% this week.
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  3 high-risk issues require immediate attention.
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Hostel Block B shows a recurring plumbing pattern.
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  Average resolution time improved by 14%.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy AI Campus Insights Card with Grid Lines */}
          <div className="lg:col-span-6">
            <div className="bg-[#091b42] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#162d66] relative overflow-hidden">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="insightsGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#insightsGrid)" />
                </svg>
              </div>

              <div className="relative z-10 space-y-6">
                {/* Header: AI Campus Insights with Blue Dot */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <span className="font-bold text-base text-white tracking-tight">
                    AI Campus Insights
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse ml-0.5" />
                </div>

                {/* Prediction Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-200/80">Prediction Confidence</span>
                    <span className="font-bold text-white">78%</span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-950 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[78%]" />
                  </div>
                </div>

                {/* RECURRING ALERT */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-300">
                    RECURRING ALERT
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Hostel Block B — Plumbing.{' '}
                    <span className="text-blue-400 font-semibold">
                      78% probability
                    </span>{' '}
                    of recurring issue within 14 days.
                  </p>
                </div>

                {/* RECOMMENDATION */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-300">
                    RECOMMENDATION
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Schedule preventive plumbing inspection across Hostel Block B washrooms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. READY TO MAKE YOUR CAMPUS INTELLIGENT? CTA (Matches Screenshot 5) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1e42] tracking-tight">
          Ready to make your campus intelligent?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Join the infrastructure intelligence network. Report, route and predict — all in one system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-[#0a1e42] hover:bg-[#0f2852] text-white font-semibold px-6 py-3.5 rounded-lg text-sm shadow-xs transition-colors cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-lg border border-slate-300 text-sm shadow-2xs transition-colors cursor-pointer"
          >
            <span>Log in to Dashboard</span>
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. CLEAN FOOTER (Matches Screenshot 5) */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#0b1f44] text-white flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900">ResolveX</span>
              <span className="text-slate-400 font-mono text-[11px]">
                © 2026 — Infrastructure Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={() => alert('ResolveX Privacy Policy: End-to-end data encryption and strict campus privacy compliance.')}
              className="hover:text-slate-900 transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => alert('Security: Protected by TLS 1.3 encryption and institutional multi-factor verification.')}
              className="hover:text-slate-900 transition-colors"
            >
              Security
            </button>
            <button
              type="button"
              onClick={() => alert('All ResolveX telemetry clusters are currently 100% operational.')}
              className="hover:text-slate-900 transition-colors"
            >
              Status
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
