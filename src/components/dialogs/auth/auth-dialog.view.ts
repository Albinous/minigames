import './auth-dialog.scss';
import type { AuthMode } from './auth-dialog.types';

function getFieldErrorView(name: string): string {
  return `<p class="auth-form__error" data-error-for="${name}" aria-live="polite"></p>`;
}

export function getAuthDialogView(mode: AuthMode): string {
  return `
    <div class="auth-dialog-backdrop">
      <div
        class="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >

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

export function getAuthDialogContentView(mode: AuthMode): string {
  return mode === 'login' ? getLoginFormView() : getRegisterFormView();
}

function getLoginFormView(): string {
  return `
    <form class="auth-form" novalidate>
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
          class="auth-form__input auth-form__email"
          id="login-email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="e.g. alex@minigames.com"
          required
        />

        ${getFieldErrorView('email')}
      </div>

      <div class="auth-form__field">
        <label for="login-password">
          Password
        </label>

        <div class="auth-form__password">
          <input
            class="auth-form__input"
            id="login-password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            required
          />

          <button
            class="auth-form__password-toggle"
            type="button"
            data-password-for="login-password"
            aria-label="Show password"
          >
            <img src="src/assets/icons/visibility.svg">
          </button>
        </div>
        ${getFieldErrorView('password')}
      </div>

      <a
        class="auth-form__forgot auth-form__underline"
        href="#"
      >
        Forgot Password?
      </a>

      <button
        class="auth-form__submit-btn btn btn-primary auth-form__btn"
        type="submit" disabled
      >
        Login
      </button>

      <div class="auth-form__divider">
        <span>OR</span>
      </div>

      <button
        type="button"
        class="auth-form__google btn btn-secondary auth-form__btn"
      >
        <img src=src/assets/icons/google.svg>
        <span>Continue with Google</span>
      </button>

      <p class="auth-form__switcher">
        Don't have an account?
        <button
          class="auth-form__register auth-form__underline"
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
    <form class="auth-form" novalidate>
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
          class="auth-form__input auth-form__username"
          name="username"
          type="text"
          autocomplete="username"
          placeholder="e.g. CozyGamer_99"
          required
        />
        ${getFieldErrorView('username')}
      </div>

      <div class="auth-form__field">
        <label for="register-email">
          Email Address
        </label>

        <input
          class="auth-form__input auth-form__email"
          id="register-email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="your.email@domain.com"
          required
        />
        ${getFieldErrorView('email')}
      </div>

      <div class="auth-form__field">
        <label for="register-password">
          Password
        </label>

        <div class="auth-form__password">
          <input
            class="auth-form__input"
            id="register-password"
            name="password"
            type="password"
            autocomplete="new-password"
            placeholder="Min. 6 characters"
            required
          />

          <button
            class="auth-form__password-toggle"
            type="button"
            data-password-for="register-password"
            aria-label="Show password"
          >
          <img src="src/assets/icons/visibility.svg">

          </button>
        </div>
        
        ${getFieldErrorView('password')}
      </div>

      <div class="auth-form__field">
        <label for="register-confirm-password">
          Confirm Password
        </label>

        <div class="auth-form__password">
          <input
            class="auth-form__input"
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Repeat your password"
            required
          />

          <button
            class="auth-form__password-toggle"
            type="button"
            data-password-for="register-confirm-password"
            aria-label="Show password"
          >
          <img src="src/assets/icons/visibility.svg">

          </button>
        </div>
        
        ${getFieldErrorView('confirmPassword')}
      </div>

      <button
        class="btn btn-primary auth-form__btn auth-form__submit-btn"
        type="submit" disabled
      >
        Create Account
      </button>

      <div class="auth-form__divider">
        <span>OR</span>
      </div>

      <button
        type="button"
        class="btn btn-secondary auth-form__google auth-form__btn"
      >
        <img src=src/assets/icons/google.svg>

        <span>Sign up with Google</span>
      </button>

      <p class="auth-form__switcher">
        Already have an account?
        <button
          class="auth-form__login auth-form__underline"
          type="button"
        >
          Login
        </button>
      </p>
    </form>
  `;
}
