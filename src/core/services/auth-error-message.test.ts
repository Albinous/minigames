import { FirebaseError } from 'firebase/app';
import { describe, expect, it } from 'vitest';
import { getAuthErrorMessage, isAuthCancelled } from './auth-error-message';

const firebaseError = (code: string): FirebaseError =>
  new FirebaseError(code, 'raw firebase message');

const defaultMessage = getAuthErrorMessage(new Error('anything'));

describe('getAuthErrorMessage', () => {
  it('returns a readable message for invalid credentials', () => {
    expect(getAuthErrorMessage(firebaseError('auth/invalid-credential'))).toBe(
      'Invalid email or password',
    );
  });

  it.each([
    'auth/invalid-credential',
    'auth/email-already-in-use',
    'auth/invalid-email',
    'auth/too-many-requests',
    'auth/network-request-failed',
    'auth/popup-blocked',
  ])('has a dedicated message for %s', (code) => {
    const message = getAuthErrorMessage(firebaseError(code));

    expect(message).not.toBe(defaultMessage);
    expect(message).not.toBe('raw firebase message');
  });

  it('returns the default message for an unknown firebase code', () => {
    expect(getAuthErrorMessage(firebaseError('auth/something-new'))).toBe(defaultMessage);
  });

  it.each([new Error('boom'), 'text', undefined, 42])(
    'returns the default message for non-firebase value %j',
    (value) => {
      expect(getAuthErrorMessage(value)).toBe(defaultMessage);
    },
  );
});

describe('isAuthCancelled', () => {
  it.each(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])(
    'treats %s as a cancellation',
    (code) => {
      expect(isAuthCancelled(firebaseError(code))).toBe(true);
    },
  );

  it('does not treat other firebase errors as a cancellation', () => {
    expect(isAuthCancelled(firebaseError('auth/invalid-credential'))).toBe(false);
  });

  it.each([new Error('boom'), 'text', undefined])(
    'does not treat non-firebase value %j as a cancellation',
    (value) => {
      expect(isAuthCancelled(value)).toBe(false);
    },
  );
});
