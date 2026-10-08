import type { AuthMode } from './auth-dialog.types';
import { getAuthDialogContentView, getAuthDialogView } from './auth-dialog.view';
import { updateUrlAuth } from '../../../shared/utils/update-url';

export class AuthDialog {
  private mode: AuthMode = 'login';
  private dialogElement: HTMLElement | undefined;

  private updateSwitcherState(): void {
    const loginButton = this.dialogElement?.querySelector('.auth-dialog__login');
    const registerButton = this.dialogElement?.querySelector('.auth-dialog__register');

    loginButton?.classList.toggle('active', this.mode === 'login');
    registerButton?.classList.toggle('active', this.mode === 'register');
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
  }

  public close(isUpdateHistory = true): void {
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

    this.bindBackdrop();
    this.bindEscape();
    this.bindSwitcher();
    this.bindFormSwitcher();
    this.updateSwitcherState();

    return root;
  }
}
