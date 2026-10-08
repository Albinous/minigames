import type { AuthMode } from "../../components/dialogs/auth/auth-dialog.types";

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

export const validateConfirmPassword = (password: string, confirmation: string): string | undefined => {
  if (!confirmation) return 'Please confirm your password'
  return (password === confirmation) ? undefined : `Passwords don't match`
}

const FIELD_BY_MODE: Record<AuthMode, readonly AuthField[]> = {
  'login': ['email', 'password'],
  'register': ['username', 'email', 'password', 'confirmPassword']
};

const FIELD_VALIDATORS: Record<AuthField, (value: string, values: AuthFormValues, mode: AuthMode) => string | undefined> = {
  username: (value) => validateUsername(value),
  email: (value) => validateEmail(value),
  password: (value, _values, mode) => mode === 'login' ? validateLoginPassword(value) : validateRegisterPassword(value),
  confirmPassword: (value, values) => validateConfirmPassword(values.password ?? '', value),
}

const validateAuthField = (
  mode: AuthMode,
  field: AuthField,
  values: AuthFormValues
): string | undefined => FIELD_VALIDATORS[field](values[field] ?? '', values, mode);


export const getAuthFormErrors = (mode: AuthMode, values: AuthFormValues): AuthFormErrors => {
  const errors: AuthFormErrors = {};
  const fields = FIELD_BY_MODE[mode]
  for (const field of fields) {
    const error = validateAuthField(mode, field, values);
    if (error) errors[field] = error;
  }

  return errors;
}