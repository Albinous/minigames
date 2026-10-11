import { FirebaseError } from 'firebase/app';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type { AuthService, AuthUser } from '../../../core';
import type { Snackbar } from '../../snackbar';
import { AuthDialog } from './auth-dialog';

vi.mock('../../../core', async () => {
  const messages = await import('../../../core/services/auth-error-message');

  return {
    getAuthErrorMessage: messages.getAuthErrorMessage,
    isAuthCancelled: messages.isAuthCancelled,
  };
});

const OPEN_CLASS = 'auth-dialog-backdrop--open';

const user: AuthUser = {
  uid: 'u1',
  email: 'alex@mail.com',
  displayName: 'Alex',
  photoURL: undefined,
};

const loginValues = { email: 'alex@mail.com', password: 'abcdef' };
const registerValues = {
  username: 'Alex',
  email: 'alex@mail.com',
  password: 'Abc123!',
  confirmPassword: 'Abc123!',
};

type Context = ReturnType<typeof createContext>;

const createContext = () => {
  const login = vi.fn<(email: string, password: string) => Promise<AuthUser>>(async () => user);
  const register = vi.fn<(username: string, email: string, password: string) => Promise<AuthUser>>(
    async () => user,
  );
  const loginWithGoogle = vi.fn<() => Promise<AuthUser>>(async () => user);
  const show = vi.fn();
  const onSuccess = vi.fn();
  const dialog = new AuthDialog(
    { login, register, loginWithGoogle } as unknown as AuthService,
    { show } as unknown as Snackbar,
    onSuccess,
  );
  const root = dialog.render();

  document.body.append(root);

  return { login, register, loginWithGoogle, show, onSuccess, dialog, root };
};

const backdrop = (context: Context): HTMLElement | null =>
  context.root.querySelector<HTMLElement>('.auth-dialog-backdrop');

const isOpen = (context: Context): boolean =>
  backdrop(context)?.classList.contains(OPEN_CLASS) ?? false;

const field = (context: Context, name: string): HTMLInputElement | null =>
  context.root.querySelector<HTMLInputElement>(`input[name="${CSS.escape(name)}"]`);

const submitButton = (context: Context): HTMLButtonElement | null =>
  context.root.querySelector<HTMLButtonElement>('.auth-form__submit-btn');

const fill = (context: Context, values: Record<string, string>): void => {
  for (const [name, value] of Object.entries(values)) {
    const input = field(context, name);

    if (!input) throw new Error(`no field ${name}`);

    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

const submit = (context: Context): Event => {
  const event = new Event('submit', { bubbles: true, cancelable: true });

  context.root.querySelector('.auth-form')?.dispatchEvent(event);

  return event;
};

const clickGoogle = (context: Context): void => {
  context.root.querySelector<HTMLButtonElement>('.auth-form__google')?.click();
};

const areAllControlsDisabled = (context: Context): boolean =>
  [...context.root.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button')].every(
    (control) => control.disabled,
  );

const searchParameter = (name: string): string | null =>
  new URLSearchParams(globalThis.location.search).get(name);

beforeEach(() => {
  globalThis.history.replaceState({}, '', '/');
});

afterEach(() => {
  document.body.replaceChildren();
});

describe('AuthDialog opening and closing', () => {
  it('is closed until opened', () => {
    expect(isOpen(createContext())).toBe(false);
  });

  it('opens the login form', () => {
    const context = createContext();

    context.dialog.open('login');

    expect(isOpen(context)).toBe(true);
    expect(context.root.querySelector('.auth-dialog__login')?.classList.contains('active')).toBe(
      true,
    );
    expect(field(context, 'email')).not.toBeNull();
    expect(field(context, 'username')).toBeNull();
  });

  it('opens the register form with all its fields', () => {
    const context = createContext();

    context.dialog.open('register');

    expect(context.root.querySelector('.auth-dialog__register')?.classList.contains('active')).toBe(
      true,
    );
    expect(field(context, 'username')).not.toBeNull();
    expect(field(context, 'confirmPassword')).not.toBeNull();
  });

  it('clears the form when the mode changes', () => {
    const context = createContext();

    context.dialog.open('login');
    fill(context, loginValues);
    context.dialog.open('register');
    context.dialog.open('login');

    expect(field(context, 'email')?.value).toBe('');
  });

  it('closes and removes the auth parameter from the url', () => {
    const context = createContext();

    globalThis.history.replaceState({}, '', '/?auth=login');
    context.dialog.open('login');
    context.dialog.close();

    expect(isOpen(context)).toBe(false);
    expect(searchParameter('auth')).toBeNull();
  });

  it('keeps the url when asked not to update history', () => {
    const context = createContext();

    globalThis.history.replaceState({}, '', '/?auth=login');
    context.dialog.open('login');
    context.dialog.close(false);

    expect(isOpen(context)).toBe(false);
    expect(searchParameter('auth')).toBe('login');
  });

  it('closes when the backdrop is clicked but not when the dialog itself is clicked', () => {
    const context = createContext();

    context.dialog.open('login');
    context.root.querySelector<HTMLElement>('.auth-dialog')?.click();
    expect(isOpen(context)).toBe(true);

    backdrop(context)?.click();
    expect(isOpen(context)).toBe(false);
  });

  it('closes on Escape', () => {
    const context = createContext();

    context.dialog.open('login');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(isOpen(context)).toBe(false);
  });

  it('switches mode with the tabs and writes it to the url', () => {
    const context = createContext();

    context.dialog.open('login');
    context.root.querySelector<HTMLButtonElement>('.auth-dialog__register')?.click();

    expect(field(context, 'username')).not.toBeNull();
    expect(searchParameter('auth')).toBe('register');

    context.root.querySelector<HTMLButtonElement>('.auth-dialog__login')?.click();

    expect(field(context, 'username')).toBeNull();
    expect(searchParameter('auth')).toBe('login');
  });

  it('switches mode with the links inside the form', () => {
    const context = createContext();

    context.dialog.open('login');
    context.root.querySelector<HTMLButtonElement>('.auth-form__register')?.click();

    expect(field(context, 'username')).not.toBeNull();
    expect(searchParameter('auth')).toBe('register');

    context.root.querySelector<HTMLButtonElement>('.auth-form__login')?.click();

    expect(field(context, 'username')).toBeNull();
  });
});

describe('AuthDialog login', () => {
  it('blocks submit until the form is valid', () => {
    const context = createContext();

    context.dialog.open('login');
    expect(submitButton(context)?.disabled).toBe(true);

    fill(context, loginValues);
    expect(submitButton(context)?.disabled).toBe(false);
  });

  it('signs in with a trimmed email, reports success and closes', async () => {
    const context = createContext();

    context.dialog.open('login');
    fill(context, { email: '  alex@mail.com ', password: 'abcdef' });

    expect(submit(context).defaultPrevented).toBe(true);
    await vi.waitFor(() => {
      expect(context.onSuccess).toHaveBeenCalledWith(user);
    });

    expect(context.login).toHaveBeenCalledWith('alex@mail.com', 'abcdef');
    expect(isOpen(context)).toBe(false);
    expect(field(context, 'email')?.disabled).toBe(false);
  });

  it('locks the dialog while the request is pending and ignores a second submit', async () => {
    const context = createContext();
    let isDisabledDuringRequest = false;
    let isOpenDuringRequest = false;

    context.login.mockImplementation(async () => {
      isDisabledDuringRequest = areAllControlsDisabled(context);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      backdrop(context)?.click();
      isOpenDuringRequest = isOpen(context);
      submit(context);

      return user;
    });
    context.dialog.open('login');
    fill(context, loginValues);
    submit(context);
    await vi.waitFor(() => {
      expect(context.onSuccess).toHaveBeenCalled();
    });

    expect(isDisabledDuringRequest).toBe(true);
    expect(isOpenDuringRequest).toBe(true);
    expect(context.login).toHaveBeenCalledTimes(1);
  });

  it('shows a readable error, stays open and unlocks on failure', async () => {
    const context = createContext();

    context.login.mockRejectedValue(new FirebaseError('auth/invalid-credential', 'raw'));
    context.dialog.open('login');
    fill(context, loginValues);
    submit(context);
    await vi.waitFor(() => {
      expect(context.show).toHaveBeenCalledWith('Invalid email or password', 'error');
    });

    expect(context.onSuccess).not.toHaveBeenCalled();
    expect(isOpen(context)).toBe(true);
    expect(field(context, 'email')?.disabled).toBe(false);
  });

  it('shows a generic error for unknown failures', async () => {
    const context = createContext();

    context.login.mockRejectedValue(new Error('boom'));
    context.dialog.open('login');
    fill(context, loginValues);
    submit(context);
    await vi.waitFor(() => {
      expect(context.show).toHaveBeenCalledWith(expect.any(String), 'error');
    });

    expect(isOpen(context)).toBe(true);
  });
});

describe('AuthDialog register', () => {
  it('registers with username, trimmed email and password, then reports success', async () => {
    const context = createContext();

    context.dialog.open('register');
    fill(context, { ...registerValues, email: ' alex@mail.com ' });
    submit(context);
    await vi.waitFor(() => {
      expect(context.onSuccess).toHaveBeenCalledWith(user);
    });

    expect(context.register).toHaveBeenCalledWith('Alex', 'alex@mail.com', 'Abc123!');
    expect(context.login).not.toHaveBeenCalled();
    expect(isOpen(context)).toBe(false);
  });

  it('explains that the email is already registered and stays open', async () => {
    const context = createContext();

    context.register.mockRejectedValue(new FirebaseError('auth/email-already-in-use', 'raw'));
    context.dialog.open('register');
    fill(context, registerValues);
    submit(context);
    await vi.waitFor(() => {
      expect(context.show).toHaveBeenCalledWith(
        expect.stringMatching(/already registered/i),
        'error',
      );
    });

    expect(isOpen(context)).toBe(true);
    expect(context.onSuccess).not.toHaveBeenCalled();
  });
});

describe('AuthDialog Google sign in', () => {
  it('signs in with Google, reports success and closes', async () => {
    const context = createContext();

    context.dialog.open('login');
    clickGoogle(context);
    await vi.waitFor(() => {
      expect(context.onSuccess).toHaveBeenCalledWith(user);
    });

    expect(context.loginWithGoogle).toHaveBeenCalledTimes(1);
    expect(isOpen(context)).toBe(false);
  });

  it('works from the register form too', async () => {
    const context = createContext();

    context.dialog.open('register');
    clickGoogle(context);
    await vi.waitFor(() => {
      expect(context.onSuccess).toHaveBeenCalledWith(user);
    });
  });

  it('locks the dialog while the Google window is open', async () => {
    const context = createContext();
    let isDisabledDuringRequest = false;

    context.loginWithGoogle.mockImplementation(async () => {
      isDisabledDuringRequest = areAllControlsDisabled(context);

      return user;
    });
    context.dialog.open('login');
    clickGoogle(context);
    await vi.waitFor(() => {
      expect(context.onSuccess).toHaveBeenCalled();
    });

    expect(isDisabledDuringRequest).toBe(true);
  });

  it('stays quiet and keeps the dialog usable when the user closes the Google window', async () => {
    const context = createContext();

    context.loginWithGoogle.mockRejectedValue(
      new FirebaseError('auth/popup-closed-by-user', 'raw'),
    );
    context.dialog.open('login');
    clickGoogle(context);
    await vi.waitFor(() => {
      expect(field(context, 'email')?.disabled).toBe(false);
    });

    expect(context.show).not.toHaveBeenCalled();
    expect(context.onSuccess).not.toHaveBeenCalled();
    expect(isOpen(context)).toBe(true);
    expect(submitButton(context)?.disabled).toBe(true);
  });

  it('reports a blocked popup', async () => {
    const context = createContext();

    context.loginWithGoogle.mockRejectedValue(new FirebaseError('auth/popup-blocked', 'raw'));
    context.dialog.open('login');
    clickGoogle(context);
    await vi.waitFor(() => {
      expect(context.show).toHaveBeenCalledWith(expect.stringMatching(/popup/i), 'error');
    });

    expect(isOpen(context)).toBe(true);
  });
});
