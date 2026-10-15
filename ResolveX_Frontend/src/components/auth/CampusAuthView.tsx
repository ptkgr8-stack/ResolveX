
import React, { useState } from 'react';
import {
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  X,
  ShieldCheck,
  UserCheck,
  KeyRound,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';

import { CampusLogo } from '../common/CampusLogo';
import { UserProfile } from '../../types';
import {
  loginUser,
  registerUser,
  resendEmailOTP,
  verifyEmailOTP,
  AuthUser,
} from '../../services/authApi';

interface CampusAuthViewProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
}

type AccountRole = 'student' | 'faculty';

export const CampusAuthView: React.FC<CampusAuthViewProps> = ({
  mode,
  onSwitchMode,
  onLoginSuccess,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AccountRole>('student');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const mapUser = (user: AuthUser): UserProfile => ({
    id: String(user.id),
    name: user.full_name,
    email: user.email,
    role: user.role as UserProfile['role'],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.full_name
    )}&background=0a1e42&color=fff`,
    reportsCount: 0,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    // Handle OTP first. OTP verification does not require a password.
    if (!isLogin && otpStep) {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setError('Enter the six-digit verification code.');
        return;
      }

      setLoading(true);

      try {
        const user = await verifyEmailOTP(email.trim(), otp);

        setOtpStep(false);
        setOtp('');
        setPassword('');
        setConfirmPassword('');

        if (user.role === 'faculty' && !user.is_approved) {
          setMessage(
            'Email verified! Your faculty account is awaiting admin approval. You can log in after approval.'
          );
        } else {
          setMessage('Email verified successfully! You can now log in.');
        }

        onSwitchMode('login');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'OTP verification failed.'
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // Validate email and password for login and registration.
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isLogin) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }

      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await loginUser(email.trim(), password);

        // Store the JWT for authenticated API requests.
        if (rememberMe) {
          sessionStorage.removeItem('resolvex_access_token');
          localStorage.setItem(
            'resolvex_access_token',
            response.access_token
          );
        } else {
          localStorage.removeItem('resolvex_access_token');
          sessionStorage.setItem(
            'resolvex_access_token',
            response.access_token
          );
        }

        onLoginSuccess(mapUser(response.user));
      } else {
        await registerUser(
          fullName.trim(),
          email.trim(),
          password,
          role
        );

        setOtpStep(true);
        setMessage(
          `A verification code has been sent to ${email.trim()}.`
        );
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Authentication failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setMessage('');
    setResending(true);

    try {
      const result = await resendEmailOTP(email.trim());
      setMessage(result.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not resend the code.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-white relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Left panel */}
      <div className="lg:w-1/2 bg-[#091b42] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="authGrid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#authGrid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <CampusLogo variant="light" size="lg" />
        </div>

        <div className="my-12 lg:my-0 space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-md text-[11px] font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI MESH ONLINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold tracking-tight leading-[1.15]">
            One campus.
            <br />
            Every issue.
            <br />
            One intelligent system.
          </h1>

          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed">
            AI-powered infrastructure intelligence that understands,
            prioritizes, routes and predicts campus problems before they
            escalate.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/15">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold">47</div>
            <div className="text-[10px] font-mono tracking-wider text-blue-200/70 mt-0.5">
              ACTIVE ISSUES
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold">5.4h</div>
            <div className="text-[10px] font-mono tracking-wider text-blue-200/70 mt-0.5">
              AVG RESOLUTION
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold">98.4%</div>
            <div className="text-[10px] font-mono tracking-wider text-blue-200/70 mt-0.5">
              AI PRECISION
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {otpStep
                ? 'Verify your email'
                : isLogin
                  ? 'Welcome back'
                  : 'Create your account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {otpStep
                ? 'Enter the six-digit code sent to your email.'
                : isLogin
                  ? 'Log in to the campus intelligence system.'
                  : 'Join the campus intelligence network.'}
            </p>
          </div>

          {message && (
            <div
              role="status"
              className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {otpStep ? (
              <>
                <div>
                  <label
                    htmlFor="verification-otp"
                    className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                  >
                    SIX-DIGIT OTP
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="verification-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value.replace(/\D/g, '').slice(0, 6)
                        )
                      }
                      placeholder="Enter verification code"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#0a1e42] hover:bg-[#0f2852] disabled:opacity-60 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  Verify email
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending || loading}
                  className="w-full py-2 text-sm text-blue-700 hover:text-blue-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`}
                  />
                  {resending ? 'Sending code...' : 'Resend verification code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtp('');
                    setError('');
                    setMessage('');
                  }}
                  className="w-full text-sm text-slate-500 hover:text-slate-800"
                >
                  Back to registration
                </button>
              </>
            ) : (
              <>
                {!isLogin && (
                  <>
                    <div>
                      <label
                        htmlFor="full-name"
                        className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                      >
                        FULL NAME
                      </label>
                      <div className="relative">
                        <UserCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          id="full-name"
                          type="text"
                          autoComplete="name"
                          required
                          minLength={2}
                          maxLength={150}
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-sm text-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="account-role"
                        className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                      >
                        ACCOUNT TYPE
                      </label>
                      <select
                        id="account-role"
                        value={role}
                        onChange={(event) =>
                          setRole(event.target.value as AccountRole)
                        }
                        className="w-full px-3.5 py-2.5 border border-slate-300 focus:border-blue-600 rounded-lg text-sm text-slate-900 bg-white"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                      </select>

                      {role === 'faculty' && (
                        <p className="text-xs text-amber-700 mt-1.5">
                          Faculty accounts require admin approval after email
                          verification.
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                  >
                    EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@campus.edu"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="auth-password"
                      className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider"
                    >
                      PASSWORD
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="auth-password"
                      type="password"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      minLength={isLogin ? undefined : 8}
                      maxLength={128}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5"
                    >
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        maxLength={128}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your password"
                        className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg text-sm text-slate-900 outline-none"
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
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="rounded border-slate-300 text-blue-600 w-4 h-4"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-xs text-slate-600 select-none"
                    >
                      Remember me
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#0a1e42] hover:bg-[#0f2852] disabled:opacity-60 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : isLogin ? (
                    <ArrowRight className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {loading
                    ? 'Please wait...'
                    : isLogin
                      ? 'Login'
                      : 'Create account'}
                </button>
              </>
            )}
          </form>

          {!otpStep && (
            <div className="text-center text-xs text-slate-600 pt-2">
              {isLogin ? (
                <span>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMessage('');
                      onSwitchMode('register');
                    }}
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
                    onClick={() => {
                      setError('');
                      setMessage('');
                      onSwitchMode('login');
                    }}
                    className="text-blue-700 hover:text-blue-800 font-bold underline ml-1"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              Secure campus authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
