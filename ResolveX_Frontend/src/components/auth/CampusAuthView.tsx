import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowRight, X, UserCheck, ShieldCheck } from 'lucide-react';
import { CampusLogo } from '../common/CampusLogo';
import { UserProfile } from '../../types';
import { CURRENT_USER, ADMIN_USER } from '../../data/mockData';

interface CampusAuthViewProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
}

export const CampusAuthView: React.FC<CampusAuthViewProps> = ({
  mode,
  onSwitchMode,
  onLoginSuccess,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const isLogin = mode === 'login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('vance')) {
      onLoginSuccess(ADMIN_USER);
    } else {
      onLoginSuccess({
        ...CURRENT_USER,
        email: email || CURRENT_USER.email,
      });
    }
  };

  const handleGoogleAuth = () => {
    onLoginSuccess(CURRENT_USER);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-white relative">
      {/* Optional Close / Back button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Left Column: Deep Rich Blue with Coordinate Grid Pattern (Matches Image 6 & 7) */}
      <div className="lg:w-1/2 bg-[#091b42] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="authGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#authGrid)" />
          </svg>
        </div>

        {/* Top Logo */}
        <div className="relative z-10">
          <CampusLogo variant="light" size="lg" />
        </div>

        {/* Middle Hero Statement */}
        <div className="my-12 lg:my-0 space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-md text-[11px] font-mono text-emerald-300 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI MESH ONLINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.15]">
            One campus.<br />
            Every issue.<br />
            One intelligent system.
          </h1>

          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-normal">
            AI-powered infrastructure intelligence that understands, prioritizes, routes and predicts campus problems — before they escalate.
          </p>
        </div>

        {/* Bottom Stats Row (47 ACTIVE ISSUES | 5.4h AVG RESOLUTION | 98.4% AI PRECISION) */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/15">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              47
            </div>
            <div className="text-[10px] font-mono tracking-wider text-blue-200/70 uppercase mt-0.5">
              ACTIVE ISSUES
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              5.4h
            </div>
            <div className="text-[10px] font-mono tracking-wider text-blue-200/70 uppercase mt-0.5">
              AVG RESOLUTION
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              98.4%
            </div>
            <div className="text-[10px] font-mono tracking-wider text-blue-200/70 uppercase mt-0.5">
              AI PRECISION
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean White Auth Form (Matches Image 6 & 7) */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isLogin
                ? 'Log in to the campus intelligence system.'
                : 'Join the campus intelligence network.'}
            </p>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs flex items-center justify-center gap-3 transition-colors"
          >
            {/* Official Google G Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              OR
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                EMAIL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@campus.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                  PASSWORD
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered campus email.')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 select-none">
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0a1e42] hover:bg-[#0f2852] text-white rounded-lg font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
            >
              {isLogin ? (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create account</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center text-xs text-slate-600 pt-2">
            {isLogin ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  className="text-blue-700 hover:text-blue-800 font-bold underline ml-1"
                >
                  Create one
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  className="text-blue-700 hover:text-blue-800 font-bold underline ml-1"
                >
                  Log in
                </button>
              </span>
            )}
          </div>

          {/* Convenient 1-Click Demo Profiles for testing */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold text-center">
              Quick 1-Click Demo Sign-in
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLoginSuccess(CURRENT_USER)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-blue-50 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student Profile</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Alex Rivera (STU)</div>
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess(ADMIN_USER)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-purple-50 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Facilities Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Dr. Vance (Operations)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
