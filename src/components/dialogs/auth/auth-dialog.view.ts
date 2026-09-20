import './auth-dialog.scss';
import type { AuthMode } from './auth-dialog.types';

export function getAuthDialogView(mode: AuthMode): string {
  return `
    <div class="auth-dialog-backdrop">
      <div
        class="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
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

export function getAuthDialogContentView(
  mode: AuthMode,
): string {
  return mode === 'login'
    ? getLoginFormView()
    : getRegisterFormView();
}

function getLoginFormView(): string {
  return `
    <form class="auth-form">
      <h2 id="auth-dialog-title">
        Welcome Back!
      </h2>

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
          autocomplete="email"
          placeholder="e.g. alex@minigames.com"
          required
        />
      </div>

      <div class="auth-form__field">
        <label for="login-password">
          Password
        </label>

        <div class="auth-form__password">
          <input
            id="login-password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            minlength="8"
            required
          />

          <button
            class="auth-form__password-toggle"
            type="button"
            data-password-for="login-password"
            aria-label="Show password"
          >
            Show
          </button>
        </div>
      </div>

      <a
        class="auth-form__forgot"
        href="#"
      >
        Forgot Password?
      </a>

      <button
        class="btn btn-primary"
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
        <button
          class="auth-form__register"
          type="button"
        >
          Register
        </button>
      </p>
    </form>
  `;
}

function getRegisterFormView(): string {
  return `
    <form class="auth-form">
      <h2 id="auth-dialog-title">
        Create Account
      </h2>

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
          autocomplete="username"
          placeholder="e.g. CozyGamer_99"
          required
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
          autocomplete="email"
          placeholder="your.email@domain.com"
          required
        />
      </div>

      <div class="auth-form__field">
        <label for="register-password">
          Password
        </label>

        <div class="auth-form__password">
          <input
            id="register-password"
            name="password"
            type="password"
            autocomplete="new-password"
            placeholder="Min. 8 characters"
            minlength="8"
            required
          />

          <button
            class="auth-form__password-toggle"
            type="button"
            data-password-for="register-password"
            aria-label="Show password"
          >
            Show
          </button>
        </div>
      </div>

      <div class="auth-form__field">
        <label for="register-confirm-password">
          Confirm Password
        </label>

        <div class="auth-form__password">
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Repeat your password"
            minlength="8"
            required
          />

          <button
            class="auth-form__password-toggle"
            type="button"
            data-password-for="register-confirm-password"
            aria-label="Show password"
          >
            Show
          </button>
        </div>
      </div>

      <button
        class="btn btn-primary"
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
        <button
          class="auth-form__login"
          type="button"
        >
          Login
        </button>
      </p>
    </form>
  `;
}