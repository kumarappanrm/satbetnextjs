// Storage utilities — NEXTJS_GUIDE_06: API Integration
// Replaces CI: $this->session->userdata() calls

import { config } from '@/config/constants';
import type { User, AuthState } from '@/types';

// ─── Token ────────────────────────────────────────────────────────────────
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(config.auth.tokenKey, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(config.auth.tokenKey);
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(config.auth.tokenKey);
  }
}

// ─── User Session ─────────────────────────────────────────────────────────
const USER_KEY = 'satbet_user';

export function saveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
  return null;
}

export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

// ─── Auth State ──────────────────────────────────────────────────────────

export function getDefaultAuthState(): AuthState {
  return {
    isLoggedIn: false,
    user: null,
    balance: 0,
    messageCount: 0,
    tierValue: 0,
  };
}

export function clearSession(): void {
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('_cltk');
    sessionStorage.removeItem('fcmtoken');
  }
}
