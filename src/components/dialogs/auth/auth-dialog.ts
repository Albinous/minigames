import type { AuthMode } from './auth-dialog.types';
import { getAuthDialogContentView, getAuthDialogView } from './auth-dialog.view';
import { AuthFormValidator } from './auth-form-validator';
import { getAuthErrorMessage, type AuthService, type AuthUser } from '../../../core';
import { updateUrlAuth } from '../../../shared';
import type { Snackbar } from '../../snackbar';

export class AuthDialog {
  private authService: AuthService;
  private snackbar: Snackbar;
  private onSuccess: (user: AuthUser) => void;
  private mode: AuthMode = 'login';
  private dialogElement: HTMLElement | undefined;
  private validator: AuthFormValidator | undefined;
  private isPending = false;

  constructor(authService: AuthService, snackbar: Snackbar, onSuccess: (user: AuthUser) => void) {
    this.authService = authService;
    this.snackbar = snackbar;
    this.onSuccess = onSuccess;
  }

  private updateSwitcherState(): void {
    const loginButton = this.dialogElement?.querySelector('.auth-dialog__login');
    const registerButton = this.dialogElement?.querySelector('.auth-dialog__register');

    loginButton?.classList.toggle('active', this.mode === 'login');
    registerButton?.classList.toggle('active', this.mode === 'register');
  }

  private async submit(): Promise<void> {
    if (this.isPending) return;
    const values = this.validator?.getValues();
    this.setPending(true);

    const username = values?.username ?? '';
    const email = values?.email?.trim() ?? '';
    const password = values?.password ?? '';

    try {
      const user =
        this.mode === 'login'
          ? await this.authService.login(email, password)
          : await this.authService.register(username, email, password);
      this.setPending(false);
      this.onSuccess(user);
      this.close();
    } catch (error) {
      this.setPending(false);
      this.snackbar.show(getAuthErrorMessage(error), 'error');
    }
  }

  private bindBackdrop(): void {
    const backdrop = this.dialogElement?.querySelector('.auth-dialog-backdrop');

    backdrop?.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        this.close();
      }
    });
  }

  private bindEscape(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  private bindSwitcher(): void {
    const loginButton = this.dialogElement?.querySelector('.auth-dialog__login');
    const registerButton = this.dialogElement?.querySelector('.auth-dialog__register');

    loginButton?.addEventListener('click', () => {
      this.open('login');
      updateUrlAuth(globalThis.location.pathname, 'login');
    });

    registerButton?.addEventListener('click', () => {
      this.open('register');
      updateUrlAuth(globalThis.location.pathname, 'register');
    });
  }

  private bindFormSwitcher(): void {
    const registerButton = this.dialogElement?.querySelector('.auth-form__register');
    const loginButton = this.dialogElement?.querySelector('.auth-form__login');

    loginButton?.classList.toggle('active', this.mode === 'login');
    registerButton?.classList.toggle('active', this.mode === 'register');

    registerButton?.addEventListener('click', () => {
      this.open('register');
      updateUrlAuth(globalThis.location.pathname, 'register');
    });

    loginButton?.addEventListener('click', () => {
      this.open('login');
      updateUrlAuth(globalThis.location.pathname, 'login');
    });
  }

  private bindValidation(form: HTMLFormElement): void {
    this.validator = new AuthFormValidator(this.mode, form);
    this.validator.bind();
  }

  private bindSubmit(form: HTMLFormElement): void {
    console.log('binsubmit', form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      void this.submit();
    });
  }

  private setPending(isPending: boolean): void {
    this.isPending = isPending;

    const controls = this.dialogElement?.querySelectorAll('input, button');
    if (!controls) return;
    for (const control of controls) {
      if (control instanceof HTMLInputElement || control instanceof HTMLButtonElement) {
        control.disabled = isPending;
      }
    }
  }

  public open(mode: AuthMode): void {
    this.mode = mode;

    const content = this.dialogElement?.querySelector('.auth-dialog__content');

    if (content) {
      content.innerHTML = getAuthDialogContentView(this.mode);
      this.bindFormSwitcher();
    }

    this.updateSwitcherState();

    const backdrop = this.dialogElement?.querySelector('.auth-dialog-backdrop');

    backdrop?.classList.add('auth-dialog-backdrop--open');
    const form = this.dialogElement?.querySelector<HTMLFormElement>('.auth-form');

    if (!form) return;
    this.bindValidation(form);
    this.bindSubmit(form);
  }

  public close(isUpdateHistory = true): void {
    if (this.isPending) return;
    const backdrop = this.dialogElement?.querySelector('.auth-dialog-backdrop');

    backdrop?.classList.remove('auth-dialog-backdrop--open');

    if (isUpdateHistory) {
      updateUrlAuth(globalThis.location.pathname, undefined);
    }
  }

  public render(): HTMLElement {
    const root = document.createElement('div');

    root.className = 'auth-dialog-root';
    root.innerHTML = getAuthDialogView(this.mode);

    this.dialogElement = root;

    const form = this.dialogElement?.querySelector<HTMLFormElement>('.auth-form');
    console.log(form);

    this.bindBackdrop();
    this.bindEscape();
    this.bindSwitcher();
    this.bindFormSwitcher();
    this.updateSwitcherState();

    if (form) {
      this.bindValidation(form);
    }

    return root;
  }
}
