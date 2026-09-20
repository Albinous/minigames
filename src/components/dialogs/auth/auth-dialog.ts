import type { AuthMode } from './auth-dialog.types';
import { getAuthDialogContentView, getAuthDialogView } from './auth-dialog.view';

export class AuthDialog {
  private mode: AuthMode = 'login';
  private dialogElement: HTMLElement | undefined;

  private bindCloseButton(): void {
    const closeButton = this.dialogElement?.querySelector('.auth-dialog__close');

    closeButton?.addEventListener('click', () => {
      this.close();
    });
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
    });

    registerButton?.addEventListener('click', () => {
      this.open('register');
    });
  }

  private bindFormSwitcher(): void {
    const registerButton = this.dialogElement?.querySelector('.auth-form__register');

    registerButton?.addEventListener('click', () => {
      this.open('register');
    });

    const loginButton = this.dialogElement?.querySelector('.auth-form__login');

    loginButton?.addEventListener('click', () => {
      this.open('login');
    });
  }

   private bindPasswordToggles(): void {
    const passwordButtons = this.dialogElement?.querySelectorAll(
      '.auth-form__password-toggle',
    );

    passwordButtons?.forEach((button) => {
      button.addEventListener('click', () => {
        const inputId = button.getAttribute('data-password-for');

        if (!inputId) {
          return;
        }

        const input = this.dialogElement?.querySelector(
          `#${inputId}`,
        );

        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        const isPassword = input.type === 'password';

        input.type = isPassword ? 'text' : 'password';

        button.setAttribute(
          'aria-label',
          isPassword
            ? 'Hide password'
            : 'Show password',
        );
      });
    });
  }

  public open(mode: AuthMode): void {
    this.mode = mode;

    const content = this.dialogElement?.querySelector('.auth-dialog__content');

    if (content) {
      content.innerHTML = getAuthDialogContentView(this.mode);
      this.bindFormSwitcher();
    }

    const backdrop = this.dialogElement?.querySelector('.auth-dialog-backdrop');

    backdrop?.classList.add('auth-dialog-backdrop--open');
  }

  public close(): void {
    const backdrop = this.dialogElement?.querySelector('.auth-dialog-backdrop');

    backdrop?.classList.remove('auth-dialog-backdrop--open');
  }

  public render(): HTMLElement {
    const root = document.createElement('div');

    root.className = 'auth-dialog-root';
    root.innerHTML = getAuthDialogView(this.mode);

    this.dialogElement = root;
    this.bindCloseButton();
    this.bindBackdrop();
    this.bindEscape();
    this.bindSwitcher();
    this.bindFormSwitcher();
    this.bindPasswordToggles();

    return root;
  }
}
