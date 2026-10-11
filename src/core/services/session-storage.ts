import { APP_SESSION_KEY, SESSION_LIFETIME_MS } from '../constants';
import type { AppSession } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseJson = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

export const saveSession = (session: AppSession): void => {
  localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
};

export const readSession = (): AppSession | undefined => {
  const raw = localStorage.getItem(APP_SESSION_KEY);
  if (!raw) return undefined;

  const parsed = parseJson(raw);

  if (!isRecord(parsed)) return undefined;

  const { displayName, email, authenticatedAt, avatarUrl } = parsed;

  if (typeof displayName !== 'string' || typeof email !== 'string') return undefined;
  if (!displayName.trim() || !email.trim()) return undefined;

  if (typeof authenticatedAt !== 'number' || !Number.isFinite(authenticatedAt)) return undefined;

  if (typeof avatarUrl !== 'string' && avatarUrl !== undefined) return undefined;

  const appSession: AppSession = {
    displayName,
    email,
    authenticatedAt,
    avatarUrl,
  };

  return appSession;
};

export const clearSession = (): void => {
  localStorage.removeItem(APP_SESSION_KEY);
};

export const isSessionExpired = (session: AppSession, now = Date.now()): boolean => {
  const elapsed = now - session.authenticatedAt;

  return elapsed >= SESSION_LIFETIME_MS || elapsed < 0;
};
