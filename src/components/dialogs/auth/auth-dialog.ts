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

  public open(mode: AuthMode): void {
    this.mode = mode;

    const content = this.dialogElement?.querySelector('.auth-dialog__content');

    if (content) {
      content.innerHTML = getAuthDialogContentView(this.mode);
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

    return root;
  }
}
