import type { AuthMode } from './auth-dialog.types';
import { getAuthDialogView } from './auth-dialog.view';

export class AuthDialog {
  private mode: AuthMode = 'login';

  public render(): HTMLElement {
    const root = document.createElement('div');

    root.className = 'auth-dialog-root';
    root.innerHTML = getAuthDialogView(this.mode);

    return root;
  }
}