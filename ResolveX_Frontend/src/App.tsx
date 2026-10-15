
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
} from './data/mockData';

import {
  getIssues,
  updateIssueStatus,
} from './services/issueApi';

import {
  getCurrentUser,
} from './services/authApi';

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
import FacultyApprovalView from './components/admin/FacultyApprovalView';

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

  // Convert the backend user to the frontend profile.
  const mapBackendUser = (
    user: Awaited<ReturnType<typeof getCurrentUser>>,
  ): UserProfile => ({
    id: String(user.id),
    name: user.full_name,
    email: user.email,
    role: user.role as UserProfile['role'],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.full_name,
    )}&background=0a1e42&color=fff`,
    reportsCount: 0,
  });

  // Fetch issues only for an authenticated user.
  const refreshIssues = useCallback(async () => {
    if (!currentUser) {
      setIssues([]);
      setIssuesLoading(false);
      return;
    }

    try {
      const data = await getIssues();
      setIssues(data as unknown as CampusIssue[]);
    } catch (error) {
      console.error('Failed to load campus issues:', error);

      showToast(
        error instanceof Error
          ? error.message
          : 'Could not load issues. Check your login and backend.',
      );
    } finally {
      setIssuesLoading(false);
    }
  }, [currentUser]);

  // Restore the session from a saved token after a page refresh.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token =
        localStorage.getItem('resolvex_access_token') ??
        sessionStorage.getItem('resolvex_access_token');

      if (!token) {
        if (!cancelled) setIssuesLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser(token);

        if (cancelled) return;

        if (
          !user.is_active ||
          !user.is_email_verified ||
          (user.role === 'faculty' && !user.is_approved)
        ) {
          localStorage.removeItem('resolvex_access_token');
          sessionStorage.removeItem('resolvex_access_token');
          setIssuesLoading(false);
          return;
        }

        setCurrentUser(mapBackendUser(user));

        setCurrentView(
          user.role === 'admin'
            ? 'admin-dashboard'
            : user.role === 'faculty'
              ? 'issue-management'
              : 'student-dashboard',
        );
      } catch (error) {
        if (cancelled) return;

        localStorage.removeItem('resolvex_access_token');
        sessionStorage.removeItem('resolvex_access_token');

        console.warn('Could not restore ResolveX session:', error);
      } finally {
        if (!cancelled) setIssuesLoading(false);
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh issues when the authenticated user changes.
  useEffect(() => {
    if (currentUser) {
      void refreshIssues();
    } else {
      setIssues([]);
      setIssuesLoading(false);
    }
  }, [currentUser, refreshIssues]);

  // Called after a new issue is submitted.
  const handleIssueCreated = (newIssue: CampusIssue) => {
    setIssues((previous) => [
      newIssue,
      ...previous.filter((issue) => issue.id !== newIssue.id),
    ]);

    setSelectedIssue(newIssue);
    setCurrentView('issue-details');

    showToast(
      `Issue ${newIssue.trackingNumber ?? newIssue.id} submitted successfully.`,
    );

    void refreshIssues();
  };

  // Persist an issue status change through the backend.
  const handleUpdateIssueStatus = async (
    issueId: string,
    status: IssueStatus,
  ) => {
    if (
      currentUser?.role !== 'admin' &&
      currentUser?.role !== 'faculty'
    ) {
      showToast('You are not authorized to update issue statuses.');
      return;
    }

    try {
      const savedIssue = await updateIssueStatus(
        Number(issueId),
        String(status),
      );

      await refreshIssues();

      setSelectedIssue((previous) =>
        previous && String(previous.id) === String(savedIssue.id)
          ? {
              ...previous,
              status: savedIssue.status as IssueStatus,
            }
          : previous,
      );

      showToast(`Ticket status saved: ${savedIssue.status}`);
    } catch (error) {
      console.error('Failed to update issue status:', error);

      showToast(
        error instanceof Error
          ? error.message
          : 'Could not update the issue status.',
      );
    }
  };

  const handleScheduleInspection = (alert: PredictiveAlert) => {
    showToast(
      `Preventive inspection work order created for ${alert.targetLocation}! Assigned to ${alert.department}`,
    );
  };

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
    setSelectedIssue(null);

    setCurrentView(
      user.role === 'admin'
        ? 'admin-dashboard'
        : user.role === 'faculty'
          ? 'issue-management'
          : 'student-dashboard',
    );

    showToast(`Welcome to ResolveX, ${user.name}!`);
    setIssuesLoading(true);
    void refreshIssues();
  };

  const handleLogout = () => {
    localStorage.removeItem('resolvex_access_token');
    sessionStorage.removeItem('resolvex_access_token');

    setCurrentUser(null);
    setSelectedIssue(null);
    setCurrentView('landing');
    setIsAuthModalOpen(false);
    setIssues([]);
    setIssuesLoading(false);

    showToast('Signed out of ResolveX.');
  };

  // Prevent non-admin users from opening admin-only pages.
  const adminOnlyViews = [
    'admin-dashboard',
    'predictive-insights',
    'campus-analytics',
    'departments',
  ];

  const staffViews = [
    'issue-management',
    'campus-map',
  ];

  useEffect(() => {
    if (!currentUser) return;

    if (
      adminOnlyViews.includes(currentView) &&
      currentUser.role !== 'admin'
    ) {
      setCurrentView(
        currentUser.role === 'faculty'
          ? 'issue-management'
          : 'student-dashboard',
      );

      showToast('You are not authorized to access that page.');
      return;
    }

    if (
      staffViews.includes(currentView) &&
      currentUser.role !== 'admin' &&
      currentUser.role !== 'faculty'
    ) {
      setCurrentView('student-dashboard');
      showToast('You are not authorized to access that page.');
    }
  }, [currentUser, currentView]);

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
        onLogout={handleLogout}
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
            isAdmin={
              currentUser?.role === 'admin' ||
              currentUser?.role === 'faculty'
            }
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
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'student-dashboard' && currentUser && (
              <StudentDashboard
                user={currentUser}
                issues={issues}
                onNavigateToReport={() => setCurrentView('report-issue')}
                onNavigateToMyIssues={() => setCurrentView('my-issues')}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
              />
            )}

            {currentView === 'report-issue' && currentUser && (
              <ReportIssueView
                existingIssues={issues}
                onSubmitNewIssue={handleIssueCreated}
                onCancel={() =>
                  setCurrentView(
                    currentUser.role === 'admin'
                      ? 'admin-dashboard'
                      : currentUser.role === 'faculty'
                        ? 'issue-management'
                        : 'student-dashboard',
                  )
                }
              />
            )}

            {currentView === 'my-issues' &&
              currentUser?.role === 'student' && (
                <MyIssuesView
                  issues={issues}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  onNavigateToReport={() => setCurrentView('report-issue')}
                  userEmail={currentUser.email}
                />
              )}

            {currentView === 'admin-dashboard' &&
              currentUser?.role === 'admin' && (
                <>
                  <AdminDashboard
                    issues={issues}
                    kpis={kpis}
                    onNavigateToIssues={() => setCurrentView('issue-management')}
                    onNavigateToMap={() => setCurrentView('campus-map')}
                    onNavigateToPredictions={() =>
                      setCurrentView('predictive-insights')
                    }
                    onNavigateToDepartments={() =>
                      setCurrentView('departments')
                    }
                    onSelectIssue={(issue) => setSelectedIssue(issue)}
                  />

                  <div className="mt-8">
                    <FacultyApprovalView
                      accessToken={
                        localStorage.getItem('resolvex_access_token') ??
                        sessionStorage.getItem('resolvex_access_token') ??
                        ''
                      }
                    />
                  </div>
                </>
              )}

            {currentView === 'issue-management' &&
              (currentUser?.role === 'admin' ||
                currentUser?.role === 'faculty') && (
                <IssueManagement
                  issues={issues}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  onUpdateIssueStatus={handleUpdateIssueStatus}
                />
              )}

            {currentView === 'campus-map' &&
              (currentUser?.role === 'admin' ||
                currentUser?.role === 'faculty') && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Campus Facilities GIS &amp; Incident Map
                      </h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Explore building zones, active maintenance requests,
                        and spatial density clusters
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

            {currentView === 'predictive-insights' &&
              currentUser?.role === 'admin' && (
                <PredictiveInsightsView
                  onScheduleInspection={handleScheduleInspection}
                />
              )}

            {currentView === 'campus-analytics' &&
              currentUser?.role === 'admin' && (
                <CampusAnalyticsView issues={issues} />
              )}

            {currentView === 'departments' &&
              currentUser?.role === 'admin' && (
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
              <div className="flex flex-wrap items-center gap-3">
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
