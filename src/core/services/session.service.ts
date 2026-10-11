import type { AppSession, AuthUser } from '../types';

const FALLBACK_EMAIL = 'no-email@example.com';
const FALLBACK_DISPLAY_NAME = 'Player';

export const createSession = (user: AuthUser, now = Date.now()): AppSession => {
  const isEmailEmpty = user.email ? user.email.split('@', 1)[0] : FALLBACK_DISPLAY_NAME;
  const email = FALLBACK_EMAIL;
  const displayName = user.displayName ?? isEmailEmpty;
  const authenticatedAt = now;
  const avatarUrl = user.photoURL;

  return {
    displayName,
    email,
    authenticatedAt,
    avatarUrl,
  };
};

export class SessionService {}
