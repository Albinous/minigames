import { beforeEach, describe, expect, it } from 'vitest';
import { APP_SESSION_KEY, SESSION_LIFETIME_MS } from '../constants';
import type { AppSession } from '../types';
import { clearSession, isSessionExpired, readSession, saveSession } from './session-storage';

const session: AppSession = {
  displayName: 'Alex',
  email: 'alex@mail.com',
  authenticatedAt: 1_000_000,
  avatarUrl: 'https://example.com/a.png',
};

// Записывает значение в хранилище в виде JSON
const writeJson = (value: unknown): void => {
  localStorage.setItem(APP_SESSION_KEY, JSON.stringify(value));
};

beforeEach(() => {
  localStorage.clear();
});

describe('saveSession and readSession', () => {
  it('reads back what was saved', () => {
    saveSession(session);

    expect(readSession()).toEqual(session);
  });

  it('returns undefined when nothing is stored', () => {
    expect(readSession()).toBeUndefined();
  });

  it('returns undefined for invalid JSON', () => {
    localStorage.setItem(APP_SESSION_KEY, '{abc');

    expect(readSession()).toBeUndefined();
  });

  it.each(['123', '"text"', 'null', '[]'])('returns undefined for JSON %s', (raw) => {
    localStorage.setItem(APP_SESSION_KEY, raw);

    expect(readSession()).toBeUndefined();
  });

  it.each([
    ['displayName of a wrong type', { ...session, displayName: 42 }],
    ['missing email', { ...session, email: undefined }],
    ['authenticatedAt as a string', { ...session, authenticatedAt: '1000' }],
    ['authenticatedAt that is not finite', { ...session, authenticatedAt: NaN }],
    ['blank displayName', { ...session, displayName: ' '.repeat(3) }],
    ['empty email', { ...session, email: '' }],
    ['avatarUrl of a wrong type', { ...session, avatarUrl: 123 }],
  ])('returns undefined for %s', (_title, payload) => {
    writeJson(payload);

    expect(readSession()).toBeUndefined();
  });

  it('accepts a session without avatarUrl', () => {
    const { displayName, email, authenticatedAt } = session;

    writeJson({ displayName, email, authenticatedAt });

    expect(readSession()).toEqual({ displayName, email, authenticatedAt });
  });

  it('drops unknown fields from stored data', () => {
    writeJson({ ...session, token: 'secret' });

    expect(readSession()).toEqual(session);
    expect(readSession()).not.toHaveProperty('token');
  });
});

describe('clearSession', () => {
  it('removes only the session key', () => {
    saveSession(session);
    localStorage.setItem('unrelated', 'value');

    clearSession();

    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('value');
  });
});

describe('isSessionExpired', () => {
  const { authenticatedAt } = session;

  it('is not expired right after login', () => {
    expect(isSessionExpired(session, authenticatedAt)).toBe(false);
  });

  it('is not expired just before the lifetime ends', () => {
    expect(isSessionExpired(session, authenticatedAt + SESSION_LIFETIME_MS - 1)).toBe(false);
  });

  it('is expired exactly when the lifetime ends', () => {
    expect(isSessionExpired(session, authenticatedAt + SESSION_LIFETIME_MS)).toBe(true);
  });

  it('is expired long after login', () => {
    expect(isSessionExpired(session, authenticatedAt + SESSION_LIFETIME_MS * 10)).toBe(true);
  });

  it('treats a login time in the future as expired', () => {
    expect(isSessionExpired(session, authenticatedAt - 1)).toBe(true);
  });
});