import type { AuthMode } from './auth-dialog.types';
import { getAuthDialogContentView, getAuthDialogView } from './auth-dialog.view';

export class AuthDialog {
  private mode: AuthMode = 'login';
  private dialogElement: HTMLElement | undefined;

  public render(): HTMLElement {
    const root = document.createElement('div');

    root.className = 'auth-dialog-root';
    root.innerHTML = getAuthDialogView(this.mode);

    this.dialogElement = root;

    return root;
  }

   public open(mode: AuthMode): void {
    this.mode = mode;

    const content = this.dialogElement?.querySelector(
      '.auth-dialog__content',
    );

    if (content) {
      content.innerHTML = getAuthDialogContentView(
        this.mode,
      );
    }

    const backdrop =
      this.dialogElement?.querySelector(
        '.auth-dialog-backdrop',
      );

    backdrop?.classList.add(
      'auth-dialog-backdrop--open',
    );
  }
}