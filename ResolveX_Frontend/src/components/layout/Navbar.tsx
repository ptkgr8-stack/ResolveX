import React, { useState } from 'react';
import { 
  Building2,
  Bell, 
  User, 
  PlusCircle, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  Menu,
  X,
  MapPin,
  ClipboardList,
  Sparkles,
  BarChart3,
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (role?: 'student' | 'admin', mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchRole: (role: 'student' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchRole,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicLanding = currentView === 'landing' || (!currentUser && currentView !== 'login' && currentView !== 'register');

  const notifications = [
    { id: 'n1', text: 'Critical: Water leakage near electrical panel isolated by Frank Kowalski.', time: '12m ago', unread: true },
    { id: 'n2', text: 'Predictive: Hostel Block B plumbing inspection work order generated.', time: '1 hr ago', unread: true },
    { id: 'n3', text: 'Resolved: Wi-Fi 6 switch port reboot completed in Library 2nd Floor.', time: '3 hrs ago', unread: false },
  ];

  const handleScrollTo = (id: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing the public landing page without being logged in, render the clean landing navigation
  if (isPublicLanding) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 text-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#1d68f5] transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                  ResolveX
                </span>
                <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 leading-none">
                  Ops Portal
                </span>
              </div>
              <div className="text-xs text-slate-400 font-normal leading-none mt-1">
                Infrastructure &amp; Maintenance Command
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleScrollTo('how-it-works')}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => handleScrollTo('capabilities')}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              type="button"
              onClick={() => handleScrollTo('ai-insights')}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              AI Insights
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth('student', 'login')}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer px-2 py-1.5"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('student', 'register')}
              className="bg-[#1d68f5] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard & Authenticated Navigation (Matches screenshot exactly)
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 text-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Building icon, Campus Facilities [Ops Portal], Infrastructure & Maintenance Command */}
        <button
          type="button"
          onClick={() => onNavigate(currentUser?.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
          className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#1d68f5] transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="hidden xs:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                ResolveX
              </span>
              <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 leading-none">
                Ops Portal
              </span>
            </div>
            <div className="text-xs text-slate-400 font-normal leading-none mt-1">
              Infrastructure &amp; Maintenance Command
            </div>
          </div>
        </button>

        {/* Right Section: Segmented Role Switcher, + Report Issue, Bell, Avatar Alex, Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Segmented Role Switcher (Student View | Facilities Admin) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => onSwitchRole('student')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                currentUser?.role === 'student'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student View
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('admin')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                currentUser?.role === 'admin'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Facilities Admin
            </button>
          </div>

          {/* "+ Report Issue" Button */}
          <button
            type="button"
            onClick={() => onNavigate('report-issue')}
            className="hidden md:flex items-center gap-1.5 bg-[#1d68f5] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Issue</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center relative shadow-2xs transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 p-3 z-50 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">ResolveX Notices</span>
                  <span className="text-[11px] text-slate-500 font-medium">2 unread</span>
                </div>
                <div className="divide-y divide-slate-100 mt-1 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="py-2.5 space-y-1">
                      <p className={`text-xs ${notif.unread ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {notif.text}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile (Avatar Alex ⌵) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={currentUser?.name || 'Alex'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="hidden sm:inline font-semibold text-xs sm:text-sm text-slate-800">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-fade-in text-xs">
                <div className="p-2 border-b border-slate-100 mb-1">
                  <div className="font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser?.email}</div>
                  <div className="text-[10px] text-[#1d68f5] font-semibold mt-0.5 capitalize">
                    {currentUser?.role === 'admin' ? 'Facilities Administrator' : 'Campus Student'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate(currentUser?.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate('landing');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Public Landing Page</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            title="Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Hamburger Navigation Drawer / Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 shadow-xl animate-fade-in">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Primary Views</span>
              <button
                type="button"
                onClick={() => {
                  onNavigate(currentUser?.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView.includes('dashboard') ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Overview Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('report-issue');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView === 'report-issue' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Campus Issue</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {currentUser?.role === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('my-issues');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                    currentView === 'my-issues' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    <span>My Requests ({currentUser?.reportsCount || 6})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Facilities Intelligence</span>
              <button
                type="button"
                onClick={() => {
                  onNavigate('campus-map');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView === 'campus-map' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Digital Twin Map</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('predictive-insights');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView === 'predictive-insights' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Predictive Maintenance</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('campus-analytics');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView === 'campus-analytics' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics &amp; SLA Telemetry</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Operations &amp; Public</span>
              <button
                type="button"
                onClick={() => {
                  onNavigate('issue-management');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView === 'issue-management' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  <span>Work Orders Queue</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('departments');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between ${
                  currentView === 'departments' ? 'bg-blue-50 text-[#1d68f5]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Crew Dispatch &amp; Teams</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-lg font-semibold flex items-center justify-between hover:bg-slate-50 text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Public Landing Page</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
