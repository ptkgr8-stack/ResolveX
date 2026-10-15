
import React, { useCallback, useEffect, useState } from 'react';

import {
  Building2,
  CheckCircle2,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import {
  CampusIssue,
  IssueStatus,
  PredictiveAlert,
  UserProfile,
  CampusKPIs,
} from './types';

import {
  INITIAL_KPIS,
  CURRENT_USER,
} from './data/mockData';

import {
  getIssues,
  updateIssueStatus,
} from './services/issueApi';

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
  const [issues, setIssues] = useState<CampusIssue[]>([]);
  const [kpis, setKpis] = useState<CampusKPIs>(INITIAL_KPIS);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedIssue, setSelectedIssue] = useState<CampusIssue | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] =
    useState<'student' | 'admin'>('student');
  const [authModalMode, setAuthModalMode] =
    useState<'login' | 'register'>('login');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [issuesLoading, setIssuesLoading] = useState(true);

  const showToast = (message: string) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch the latest issue records from FastAPI/PostgreSQL.
  const refreshIssues = useCallback(async () => {
    try {
      const data = await getIssues();
      setIssues(data as unknown as CampusIssue[]);
    } catch (error) {
      console.error('Failed to load campus issues:', error);

      showToast(
        'Could not load issues from the server. Check your login and backend.'
      );
    } finally {
      setIssuesLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshIssues();
  }, [refreshIssues]);

  // Called after ReportIssueView successfully creates an issue.
  const handleIssueCreated = (newIssue: CampusIssue) => {
    setIssues((previous) => [
      newIssue,
      ...previous.filter((issue) => issue.id !== newIssue.id),
    ]);

    setSelectedIssue(newIssue);
    setCurrentView('issue-details');

    showToast(
      `Issue ${newIssue.trackingNumber ?? newIssue.id} submitted successfully.`
    );

    void refreshIssues();
  };

  // Save the status through the API before updating the selected issue.
  const handleUpdateIssueStatus = async (
    issueId: string,
    status: IssueStatus
  ) => {
    try {
      const savedIssue = await updateIssueStatus(
        Number(issueId),
        String(status)
      );

      // Refresh the issue list from the server after a successful save.
      await refreshIssues();

      // Keep the currently selected issue in sync with the saved status.
      setSelectedIssue((previous) =>
        previous && String(previous.id) === String(savedIssue.id)
          ? {
              ...previous,
              status: savedIssue.status as IssueStatus,
            }
          : previous
      );

      showToast(`Ticket status saved: ${savedIssue.status}`);
    } catch (error) {
      console.error('Failed to update issue status:', error);

      showToast(
        error instanceof Error
          ? error.message
          : 'Could not update the issue status.'
      );
    }
  };

  const handleScheduleInspection = (alert: PredictiveAlert) => {
    showToast(
      `Preventive inspection work order created for ${alert.targetLocation}! Assigned to ${alert.department}`
    );
  };

  // Role switching opens authentication instead of using mock accounts.
  const handleSwitchRole = (role: 'student' | 'admin') => {
    setAuthModalRole(role);
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const isLandingView = currentView === 'landing';
  const isAuthView =
    currentView === 'login' || currentView === 'register';

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    setCurrentView(
      user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard'
    );

    showToast(`Welcome to ResolveX, ${user.name}!`);
    void refreshIssues();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-[#0b1f44] selection:text-white">
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
          setSelectedIssue(null);

          localStorage.removeItem('resolvex_access_token');
          sessionStorage.removeItem('resolvex_access_token');

          showToast('Signed out of ResolveX.');
        }}
        onSwitchRole={handleSwitchRole}
      />

      <main
        className={`flex-1 w-full ${
          isLandingView || isAuthView
            ? ''
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
        }`}
      >
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0a1e42] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

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
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
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
                  setCurrentView(
                    user.role === 'admin'
                      ? 'admin-dashboard'
                      : 'student-dashboard'
                  );
                  showToast(`Welcome to ResolveX, ${user.name}!`);
                  void refreshIssues();
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
                onCancel={() =>
                  setCurrentView(
                    currentUser?.role === 'admin'
                      ? 'admin-dashboard'
                      : 'student-dashboard'
                  )
                }
              />
            )}       
{currentView === 'my-issues' && (
  <MyIssuesView
    issues={issues}
    onSelectIssue={(issue) => setSelectedIssue(issue)}
    onNavigateToReport={() => setCurrentView('report-issue')}
    userEmail={currentUser?.email ?? ''}
  />
)}
            {currentView === 'admin-dashboard' && (
              <AdminDashboard
                issues={issues}
                kpis={kpis}
                onNavigateToIssues={() => setCurrentView('issue-management')}
                onNavigateToMap={() => setCurrentView('campus-map')}
                onNavigateToPredictions={() =>
                  setCurrentView('predictive-insights')
                }
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
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    className="inline-flex items-center gap-1.5 bg-[#0b1f44] hover:bg-[#0f2a5e] text-white font-semibold px-3.5 py-2 rounded-lg text-xs self-start sm:self-auto"
                  >
                    + Report Issue at Location
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200/90 overflow-hidden shadow-sm">
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
              <CampusAnalyticsView issues={issues} />
            )}

            {currentView === 'departments' && (
              <DepartmentManagement
                onFilterByDepartment={() =>
                  setCurrentView('issue-management')
                }
              />
            )}

            {issuesLoading && currentView !== 'landing' && (
              <p className="text-xs text-slate-500 mt-4">
                Loading campus issues from the server...
              </p>
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />

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
                  <span>
                    Urgent Facilities Dispatch: <strong>Ext 4444</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authorized Institutional Access</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
              <div>© 2026 ResolveX Infrastructure Intelligence.</div>
              <div className="flex items-center gap-3">
                <span>Telemetry Grid v4.2</span>
                <span>•</span>
                <span>10 Campus Zones Monitored</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssue(null);
                    setCurrentView('landing');
                  }}
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
