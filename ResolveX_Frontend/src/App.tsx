import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  X, 
  Phone, 
  ShieldCheck 
} from 'lucide-react';
import { CampusIssue, IssueStatus, PredictiveAlert, UserProfile, CampusKPIs } from './types';
import { 
  INITIAL_ISSUES, 
  INITIAL_KPIS, 
  CURRENT_USER, 
  ADMIN_USER, 
  CAMPUS_LOCATIONS 
} from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ReportIssueView } from './components/student/ReportIssueView';
import { MyIssuesView } from './components/student/MyIssuesView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { IssueManagement } from './components/admin/IssueManagement';
import { PredictiveInsightsView } from './components/admin/PredictiveInsightsView';
import { CampusAnalyticsView } from './components/admin/CampusAnalyticsView';
import { DepartmentManagement } from './components/admin/DepartmentManagement';
import { CampusMapViewer } from './components/common/CampusMapViewer';
import { IssueDetailsView } from './components/common/IssueDetailsView';
import { AuthModal } from './components/auth/AuthModal';
import { CampusAuthView } from './components/auth/CampusAuthView';

export default function App() {
  const [issues, setIssues] = useState<CampusIssue[]>(INITIAL_ISSUES);
  const [kpis, setKpis] = useState<CampusKPIs>(INITIAL_KPIS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(CURRENT_USER);
  const [currentView, setCurrentView] = useState<string>('student-dashboard');
  const [selectedIssue, setSelectedIssue] = useState<CampusIssue | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'student' | 'admin'>('student');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handle new issue created from ReportIssueView
  const handleIssueCreated = (newIssue: CampusIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setKpis((prev) => ({
      ...prev,
      totalOpenIssues: prev.totalOpenIssues + 1,
      criticalIssues: newIssue.priority === 'critical' ? prev.criticalIssues + 1 : prev.criticalIssues,
    }));
    setSelectedIssue(newIssue);
    setCurrentView('issue-details');
    showToast(`Issue ${newIssue.trackingNumber} submitted & queued for ${newIssue.assignedDepartment}`);
  };

  // Handle updating an issue's status
  const handleUpdateIssueStatus = (issueId: string, status: IssueStatus) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          return {
            ...i,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
    }

    showToast(`Ticket status transitioned to: ${status.replace('_', ' ').toUpperCase()}`);
  };

  // Handle scheduling preventive inspection from Predictive view
  const handleScheduleInspection = (alert: PredictiveAlert) => {
    showToast(`Preventive inspection work order created for ${alert.targetLocation}! Assigned to ${alert.department}`);
  };

  // Switch role helper
  const handleSwitchRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_USER);
      setCurrentView('admin-dashboard');
    } else {
      setCurrentUser(CURRENT_USER);
      setCurrentView('student-dashboard');
    }
    showToast(`Switched active view to: ${role === 'admin' ? 'Admin Operations Command' : 'Student Portal'}`);
  };

  const isLandingView = currentView === 'landing';
  const isAuthView = currentView === 'login' || currentView === 'register';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-[#0b1f44] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedIssue(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={(role, mode) => {
          setAuthModalRole(role || 'student');
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setCurrentView('landing');
          showToast('Signed out of ResolveX.');
        }}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${isLandingView || isAuthView ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}`}>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0a1e42] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dynamic View Rendering */}
        {selectedIssue ? (
          <IssueDetailsView
            issue={selectedIssue}
            onBack={() => setSelectedIssue(null)}
            onUpdateStatus={handleUpdateIssueStatus}
            isAdmin={currentUser?.role === 'admin'}
          />
        ) : (
          <>
            {isLandingView && (
              <LandingPage
                onStartReporting={() => {
                  if (currentUser) {
                    setCurrentView('report-issue');
                  } else {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }
                }}
                onExploreHowItWorks={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onLogin={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                onGetStarted={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {isAuthView && (
              <CampusAuthView
                mode={currentView === 'register' ? 'register' : 'login'}
                onSwitchMode={(mode) => setCurrentView(mode)}
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setCurrentView(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
                  showToast(`Welcome to ResolveX, ${user.name}!`);
                }}
                onClose={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'student-dashboard' && (
              <StudentDashboard
                user={currentUser || CURRENT_USER}
                issues={issues}
                onNavigateToReport={() => setCurrentView('report-issue')}
                onNavigateToMyIssues={() => setCurrentView('my-issues')}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
              />
            )}

{currentView === 'report-issue' && (
  <ReportIssueView
    existingIssues={issues}
    onSubmitNewIssue={handleIssueCreated}
    onCancel={() => {
      setCurrentView(
        currentUser?.role === 'admin'
          ? 'admin-dashboard'
          : 'student-dashboard'
      );
    }}
  />
)}
{currentView === 'report-issue' && (
  <ReportIssueView
    existingIssues={issues}
    onSubmitNewIssue={handleIssueCreated}
    onCancel={() => {
      setCurrentView(
        currentUser?.role === 'admin'
          ? 'admin-dashboard'
          : 'student-dashboard'
      );
    }}
  />
)}
```
            {currentView === 'admin-dashboard' && (
              <AdminDashboard
                issues={issues}
                kpis={kpis}
                onNavigateToIssues={() => setCurrentView('issue-management')}
                onNavigateToMap={() => setCurrentView('campus-map')}
                onNavigateToPredictions={() => setCurrentView('predictive-insights')}
                onNavigateToDepartments={() => setCurrentView('departments')}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
              />
            )}

            {currentView === 'issue-management' && (
              <IssueManagement
                issues={issues}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                onUpdateIssueStatus={handleUpdateIssueStatus}
              />
            )}

            {currentView === 'campus-map' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Campus Facilities GIS &amp; Incident Map
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Explore building zones, active maintenance requests, and spatial density clusters
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('report-issue')}
                    className="inline-flex items-center gap-1.5 bg-[#0b1f44] hover:bg-[#0f2a5e] text-white font-semibold px-3.5 py-2 rounded-lg text-xs self-start sm:self-auto shadow-2xs transition-colors"
                  >
                    <span>+ Report Issue at Location</span>
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
                  <CampusMapViewer
                    issues={issues}
                    showHeatmapDefault={true}
                    onViewIssueDetails={(issue) => setSelectedIssue(issue)}
                  />
                </div>
              </div>
            )}

            {currentView === 'predictive-insights' && (
              <PredictiveInsightsView
                onScheduleInspection={handleScheduleInspection}
              />
            )}

            {currentView === 'campus-analytics' && (
              <CampusAnalyticsView
                issues={issues}
              />
            )}

            {currentView === 'departments' && (
              <DepartmentManagement
                onFilterByDepartment={() => {
                  setCurrentView('issue-management');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Split-Screen Authentication Modal (Matches Images 6 & 7) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        initialMode={authModalMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          setCurrentView(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
          showToast(`Welcome back, ${user.name}!`);
        }}
      />

      {/* Enterprise University Footer (Only on authenticated dashboard pages, not on landing page) */}
      {!isLandingView && !isAuthView && (
        <footer className="bg-white border-t border-slate-200/90 text-slate-500 text-xs mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#0b1f44] text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 tracking-tight block">
                    ResolveX Facilities Management
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Physical Plant &amp; Infrastructure Intelligence Operations
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>Urgent Facilities Dispatch: <strong>Ext 4444</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authorized Institutional Access</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
              <div>
                &copy; 2026 ResolveX Infrastructure Intelligence.
              </div>
              <div className="flex items-center gap-3">
                <span>Telemetry Grid v4.2</span>
                <span>•</span>
                <span>10 Campus Zones Monitored</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('landing')}
                  className="text-slate-500 hover:text-slate-800 underline"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
