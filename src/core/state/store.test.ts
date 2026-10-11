import { describe, expect, it, vi } from 'vitest';
import type { AppSession } from '../types';
import { Store } from './store';

const session: AppSession = {
  displayName: 'Alex',
  email: 'alex@mail.com',
  authenticatedAt: 1000,
};

describe('Store', () => {
  it('starts as a guest', () => {
    const store = new Store();

    expect(store.session).toBeUndefined();
    expect(store.isAuthenticated).toBe(false);
  });

  it('exposes empty resource states initially', () => {
    const store = new Store();
    const resources = [
      store.games,
      store.game,
      store.categories,
      store.comments,
      store.leaderboard,
    ];

    for (const resource of resources) {
      expect(resource).toEqual({ data: undefined, isLoading: false, error: undefined });
    }
  });

  it('keeps the session and reports authenticated', () => {
    const store = new Store();

    store.setSession(session);

    expect(store.session).toEqual(session);
    expect(store.isAuthenticated).toBe(true);
  });

  it('returns to guest when the session is cleared', () => {
    const store = new Store();

    store.setSession(session);
    store.setSession(undefined);

    expect(store.session).toBeUndefined();
    expect(store.isAuthenticated).toBe(false);
  });

  it('notifies subscribers on every session change', () => {
    const store = new Store();
    const listener = vi.fn();

    store.subscribe(listener);
    store.setSession(session);
    store.setSession(undefined);

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('stops notifying after unsubscribe', () => {
    const store = new Store();
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setSession(session);

    expect(listener).not.toHaveBeenCalled();
  });

  it('does not share the session between store instances', () => {
    const first = new Store();

    first.setSession(session);

    expect(new Store().session).toBeUndefined();
  });
});