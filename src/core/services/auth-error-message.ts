import { FirebaseError } from 'firebase/app';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again';

const ERROR_MESSAGES: Partial<Record<string, string>> = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/email-already-in-use': 'This email is already registered. Please log in',
  'auth/invalid-email': 'Invalid email',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/network-request-failed': 'No network connection. Check your internet and try again',
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] ?? DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
};
