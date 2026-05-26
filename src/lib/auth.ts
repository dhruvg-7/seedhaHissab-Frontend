import { setDemoMode } from '@/lib/demo';

const TOKEN_KEY = 'seedhahisaab_token';
const PROFILE_KEY = 'seedhahisaab_profile';

export interface CurrentUserProfile {
  name: string | null;
  email: string | null;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setCurrentUserProfile(profile: CurrentUserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getCurrentUserProfile(): CurrentUserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: null, email: null };
    return JSON.parse(raw) as CurrentUserProfile;
  } catch {
    return { name: null, email: null };
  }
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  setDemoMode(false);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Returns the current user's UUID by decoding the JWT subject claim, or
 * null if not authenticated / the token is malformed. Used by the
 * collaboration UI to highlight the caller's own membership row.
 */
export function getCurrentUserId(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(json) as { sub?: string };
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}
