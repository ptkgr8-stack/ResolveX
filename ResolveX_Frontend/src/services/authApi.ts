
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'
).replace(/\/$/, '');

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'technician';
  is_active: boolean;
  is_email_verified: boolean;
  is_approved: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'POST', body, token } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      typeof data === 'object' && data !== null && 'detail' in data
        ? data.detail
        : undefined;

    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((item: { msg?: string }) =>
                item?.msg ?? 'Invalid input',
              )
              .join(', ')
          : `Request failed (${response.status}). Please try again.`;

    throw new Error(message);
  }

  return data as T;
}

/**
 * Register a student or faculty account.
 * Admin registration is intentionally not supported.
 */
export function registerUser(
  fullName: string,
  email: string,
  password: string,
  role: 'student' | 'faculty',
): Promise<AuthUser> {
  return request<AuthUser>('/auth/register', {
    body: {
      full_name: fullName,
      email,
      password,
      role,
    },
  });
}

/**
 * Verify the user's email using the OTP sent to their email address.
 */
export function verifyEmailOTP(
  email: string,
  otp: string,
): Promise<AuthUser> {
  return request<AuthUser>('/auth/verify-otp', {
    body: { email, otp },
  });
}

/**
 * Request a replacement email verification OTP.
 */
export function resendEmailOTP(
  email: string,
): Promise<{ message: string }> {
  return request<{ message: string }>('/auth/resend-otp', {
    body: { email },
  });
}

/**
 * Log in and receive an access token.
 */
export function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    body: { email, password },
  });
}

/**
 * Get the currently authenticated user's profile.
 */
export function getCurrentUser(
  accessToken: string,
): Promise<AuthUser> {
  return request<AuthUser>('/auth/me', {
    method: 'GET',
    token: accessToken,
  });
}

/**
 * Get verified faculty accounts that are awaiting admin approval.
 * Requires an authenticated admin access token.
 */
export function getPendingFaculty(
  accessToken: string,
): Promise<AuthUser[]> {
  return request<AuthUser[]>('/auth/pending-faculty', {
    method: 'GET',
    token: accessToken,
  });
}

/**
 * Approve a verified faculty account.
 * Requires an authenticated admin access token.
 */
export function approveFaculty(
  userId: number,
  accessToken: string,
): Promise<AuthUser> {
  return request<AuthUser>(`/auth/approve-faculty/${userId}`, {
    body: {},
    token: accessToken,
  });
}
