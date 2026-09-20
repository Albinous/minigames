import './auth-dialog.scss';
import type { AuthMode } from './auth-dialog.types';

export function getAuthDialogView(mode: AuthMode): string {
  return `
    <div class="auth-dialog-backdrop">
      <div
        class="auth-dialog"
        role="dialog"
        aria-modal="true"
      >
        <div class="auth-dialog__switcher">
          <button class="auth-dialog__btn auth-dialog__login">
            Login
          </button>

          <button class="auth-dialog__btn auth-dialog__login">
            Register
          </button>
        </div>

        <div class="auth-dialog__content">
          ${mode === 'login' ? 'Login' : 'Register'}
        </div>
      </div>
    </div>
  `;
}