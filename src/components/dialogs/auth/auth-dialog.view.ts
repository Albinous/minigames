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
          ${getLoginFormView()}
        </div>
      </div>
    </div>
  `;
}

function getLoginFormView(): string {
  return `
    <form class="auth-form">
      <h2>Welcome Back!</h2>

      <p>
        Sign in to resume your games and progress.
      </p>

      <div class="auth-form__field">
        <label for="login-email">
          Email Address
        </label>

        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="e.g. alex@minigames.com"
        />
      </div>

      <div class="auth-form__field">
        <label for="login-password">
          Password
        </label>

        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <a href="#">Forgot Password?</a>

      <button
        class="btn btn-primary auth-form__submit"
        type="submit"
      >
        Login
      </button>

      <div class="auth-form__divider">
        <span>OR</span>
      </div>

      <button
        type="button"
        class="auth-form__google"
      >
        Continue with Google
      </button>

      <p>
        Don't have an account?
        <button type="button">
          Register
        </button>
      </p>
    </form>
  `;
}