import { getProfileName } from '../../shared';
import type { Store } from '../state';
import type { AppSession, AuthUser } from '../types';
import type { AuthService } from './auth.service';
import { clearSession, isSessionExpired, readSession, saveSession } from './session-storage';

const FALLBACK_EMAIL = 'no-email@example.com';

export const createSession = (user: AuthUser, now = Date.now()): AppSession => {
  const email = user.email ?? FALLBACK_EMAIL;
  const displayName = getProfileName(user.displayName ?? '', user.email ?? '');
  const authenticatedAt = now;
  const avatarUrl = user.photoURL;

  return {
    displayName,
    email,
    authenticatedAt,
    avatarUrl,
  };
};

export class SessionService {
  private readonly store: Store;
  private readonly authService: AuthService;
  private readonly onExpire: () => void;

  constructor(store: Store, authService: AuthService, onExpire: () => void) {
    this.store = store;
    this.authService = authService;
    this.onExpire = onExpire;
  }

  private expire(): void {
    void this.end();
    this.onExpire();
  }

  public start(user: AuthUser): void {
    const session = createSession(user);
    saveSession(session);
    this.store.setSession(session);
  }

  public async end(): Promise<void> {
    clearSession();
    this.store.setSession(undefined);
    try {
      await this.authService.signOut();
    } catch {
      // At this time user is already in the Guest mode, so signOut wouldn't help
    }
  }

  public checkExpiration(): boolean {
    const session = readSession();
    if (!session) {
      if (this.store.isAuthenticated) {
        void this.end();
      }
      return false;
    }
    if (session && isSessionExpired(session)) {
      this.expire();
      return false;
    }

    return true;
  }

  public restore(): void {
    const session = readSession();
    if (!session) {
      void this.end();
      return;
    }
    if (isSessionExpired(session)) {
      this.expire();
      return;
    }
    this.store.setSession(session);
  }
}
