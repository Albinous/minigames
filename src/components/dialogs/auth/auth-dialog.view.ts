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
        <button
          class="auth-dialog__close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>
        <div class="auth-dialog__switcher">
         <button
          class="auth-dialog__login"
          type="button"
        >
          Login
        </button>

        <button
          class="auth-dialog__register"
          type="button"
        >
          Register
        </button>
        </div>

        <div class="auth-dialog__content">
          ${getAuthDialogContentView(mode)}
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

function getRegisterFormView(): string {
  return `
    <form class="auth-form">
      <h2>Create Account</h2>

      <p>
        Join MiniGames to track your score &amp; streak.
      </p>

      <div class="auth-form__field">
        <label for="register-username">
          Username
        </label>

        <input
          id="register-username"
          name="username"
          type="text"
          placeholder="e.g. CozyGamer_99"
        />
      </div>

      <div class="auth-form__field">
        <label for="register-email">
          Email Address
        </label>

        <input
          id="register-email"
          name="email"
          type="email"
          placeholder="your.email@domain.com"
        />
      </div>

      <div class="auth-form__field">
        <label for="register-password">
          Password
        </label>

        <input
          id="register-password"
          name="password"
          type="password"
          placeholder="Min. 8 characters"
        />
      </div>

      <div class="auth-form__field">
        <label for="register-confirm-password">
          Confirm Password
        </label>

        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
        />
      </div>

      <button
        class="btn btn-primary auth-form__submit"
        type="submit"
      >
        Create Account
      </button>

      <div class="auth-form__divider">
        <span>OR</span>
      </div>

      <button
        type="button"
        class="auth-form__google"
      >
        Sign up with Google
      </button>

      <p>
        Already have an account?
        <button type="button">
          Login
        </button>
      </p>
    </form>
  `;
}

export function getAuthDialogContentView(mode: AuthMode): string {
  return mode === 'login' ? getLoginFormView() : getRegisterFormView();
}
