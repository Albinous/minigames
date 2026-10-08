export const AUTH_FIELDS = ['username', 'email', 'password', 'confirmPassword'] as const;
export type AuthField = (typeof AUTH_FIELDS)[number];
export type AuthFormValues = Partial<Record<AuthField, string>>;
export type AuthFormErrors = Partial<Record<AuthField, string>>;

const EMAIL_PATTERN = /^[\w%+.-]+@[\dA-Za-z.-]+\.[A-Za-z]{2,}$/;
const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 30;

const MIN_PASSWORD_LENGTH = 6
const PASSWORD_ALLOWED_PATTERN = /^[!-~]+$/;

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();

  if (!email) return 'Email is required';

  return EMAIL_PATTERN.test(value) ? undefined : 'Enter a valid email address';
}

export const validateUsername = (value: string) : string | undefined => {

  if (!value) return 'Username is required';

  if (value.length < MIN_USERNAME_LENGTH || value.length > MAX_USERNAME_LENGTH) {
    return `Username must be ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters long`
  };

  if (!/^[A-Z]/.test(value)) return 'Username must start with an uppercase English letter';
  if (!/^[\dA-Za-z]+$/.test(value)) {
    return 'Username can contain only English letters and digits';
  }

  return undefined;
}

export const validateLoginPassword = (value: string): string | undefined => {
  if (!value) return 'Password is required';

  return value.length < MIN_PASSWORD_LENGTH ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` : undefined;
}

export const validateRegisterPassword = (value: string): string | undefined => {
  const basicError = validateLoginPassword(value);

   if (basicError) return basicError;
  if (!PASSWORD_ALLOWED_PATTERN.test(value)) {
    return 'Password can contain only English letters, digits and special characters';
  }
  if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase English letter';
  if (!/\d/.test(value)) return 'Password must contain a digit';
  if (!/[^\dA-Za-z]/.test(value)) return 'Password must contain a special character';

  return undefined;
}

export const validateConfirmPassword = (value: string, confirmation: string): string | undefined => {
  if (!confirmation) return 'Please confirm your password'
  return (value === confirmation) ? undefined : `Passwords don't match`
}