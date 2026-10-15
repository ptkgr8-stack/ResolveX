
const API_BASE = 'http://127.0.0.1:8000/api/auth';

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'technician';
  is_active: boolean;
  is_email_verified: boolean;
  is_approved: boolean;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

async function request<T>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Something went wrong. Please try again.');
  }

  return data as T;
}

export function registerUser(
  fullName: string,
  email: string,
  password: string,
  role: 'student' | 'faculty',
) {
  return request<AuthUser>('/register', {
    full_name: fullName,
    email,
    password,
    role,
  });
}

export function verifyEmailOTP(email: string, otp: string) {
  return request<AuthUser>('/verify-otp', { email, otp });
}

export function resendEmailOTP(email: string) {
  return request<{ message: string }>('/resend-otp', { email });
}

export function loginUser(email: string, password: string) {
  return request<AuthResponse>('/login', { email, password });
}
