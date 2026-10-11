import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_SESSION_KEY, SESSION_LIFETIME_MS } from '../constants';
import { Store } from '../state';
import type { AuthUser } from '../types';
import type { AuthService } from './auth.service';
import { createSession, SessionService } from './session.service';
import { readSession, saveSession } from './session-storage';

const NOW = 1_700_000_000_000;

const user: AuthUser = {
  uid: 'u1',
  email: 'alex@mail.com',
  displayName: 'Alex',
  photoURL: 'https://example.com/a.png',
};

const createContext = () => {
  const store = new Store();
  const signOut = vi.fn().mockResolvedValue(undefined);
  const onExpire = vi.fn();
  const authService = { signOut } as unknown as AuthService;
  const service = new SessionService(store, authService, onExpire);

  return { store, signOut, onExpire, service };
};

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createSession', () => {
  it('keeps only the profile fields and stamps the login time', () => {
    expect(createSession(user, NOW)).toEqual({
      displayName: 'Alex',
      email: 'alex@mail.com',
      authenticatedAt: NOW,
      avatarUrl: 'https://example.com/a.png',
    });
  });

  it('uses the current time by default', () => {
    expect(createSession(user).authenticatedAt).toBe(NOW);
  });

  it('has no avatar when the user has no photo', () => {
    expect(createSession({ ...user, photoURL: undefined }, NOW).avatarUrl).toBeUndefined();
  });

  it('takes the name from the email when display name is missing', () => {
    expect(createSession({ ...user, displayName: undefined }, NOW).displayName).toBe('alex');
  });

  it('falls back to a generic name and email when the profile is empty', () => {
    const empty: AuthUser = {
      uid: 'u2',
      email: undefined,
      displayName: undefined,
      photoURL: undefined,
    };
    const session = createSession(empty, NOW);

    expect(session.displayName).toBe('Player');
    expect(session.email).toBeTruthy();
  });
});

describe('SessionService.start', () => {
  it('persists the session and puts it into the store', () => {
    const { store, service } = createContext();

    service.start(user);

    expect(store.isAuthenticated).toBe(true);
    expect(store.session?.authenticatedAt).toBe(NOW);
    expect(store.session).toEqual(readSession());
  });
});

describe('SessionService.end', () => {
  it('clears storage, returns to guest and signs out', async () => {
    const { store, signOut, service } = createContext();

    service.start(user);

    expect(await service.end()).toBe(true);
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(store.session).toBeUndefined();
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('keeps unrelated storage keys', async () => {
    const { service } = createContext();

    service.start(user);
    localStorage.setItem('unrelated', 'value');
    await service.end();

    expect(localStorage.getItem('unrelated')).toBe('value');
  });

  it('stays in guest mode and reports failure when firebase sign out fails', async () => {
    const { store, signOut, service } = createContext();

    signOut.mockRejectedValueOnce(new Error('network'));
    service.start(user);

    expect(await service.end()).toBe(false);
    expect(store.session).toBeUndefined();
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
  });
});

describe('SessionService.restore', () => {
  it('stays a guest when nothing is stored and does not notify', () => {
    const { store, signOut, onExpire, service } = createContext();

    service.restore();

    expect(store.isAuthenticated).toBe(false);
    expect(signOut).toHaveBeenCalled();
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('restores a valid session without extending it', () => {
    const { store, signOut, onExpire, service } = createContext();
    const authenticatedAt = NOW - 60_000;

    saveSession({ displayName: 'Alex', email: 'alex@mail.com', authenticatedAt });
    service.restore();

    expect(store.session?.authenticatedAt).toBe(authenticatedAt);
    expect(readSession()?.authenticatedAt).toBe(authenticatedAt);
    expect(signOut).not.toHaveBeenCalled();
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('ends an expired session and notifies once', () => {
    const { store, signOut, onExpire, service } = createContext();

    saveSession({
      displayName: 'Alex',
      email: 'alex@mail.com',
      authenticatedAt: NOW - SESSION_LIFETIME_MS - 1,
    });
    service.restore();

    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(signOut).toHaveBeenCalled();
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('removes invalid stored data silently and becomes a guest', () => {
    const { store, signOut, onExpire, service } = createContext();

    localStorage.setItem(APP_SESSION_KEY, '{abc');
    service.restore();

    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(signOut).toHaveBeenCalled();
    expect(onExpire).not.toHaveBeenCalled();
  });
});

describe('SessionService.checkExpiration', () => {
  it('returns false for a guest without side effects', () => {
    const { signOut, onExpire, service } = createContext();

    expect(service.checkExpiration()).toBe(false);
    expect(signOut).not.toHaveBeenCalled();
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('returns true while the session is valid', () => {
    const { service } = createContext();

    service.start(user);

    expect(service.checkExpiration()).toBe(true);
  });

  it('ends the session once the lifetime has passed and notifies once', () => {
    const { store, onExpire, service } = createContext();

    service.start(user);
    vi.setSystemTime(NOW + SESSION_LIFETIME_MS);

    expect(service.checkExpiration()).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('does not notify twice after the session has already expired', () => {
    const { signOut, onExpire, service } = createContext();

    service.start(user);
    vi.setSystemTime(NOW + SESSION_LIFETIME_MS);
    service.checkExpiration();
    service.checkExpiration();

    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('detects stored data that was removed behind the apps back', () => {
    const { store, signOut, onExpire, service } = createContext();

    service.start(user);
    localStorage.removeItem(APP_SESSION_KEY);

    expect(service.checkExpiration()).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(signOut).toHaveBeenCalled();
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('treats a login time in the future as expired', () => {
    const { store, onExpire, service } = createContext();

    service.start(user);
    saveSession({
      displayName: 'Alex',
      email: 'alex@mail.com',
      authenticatedAt: NOW + 100_000,
    });

    expect(service.checkExpiration()).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});
