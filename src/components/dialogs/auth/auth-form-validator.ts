import {
  AUTH_FIELDS,
  getAuthFormErrors,
  type AuthField,
  type AuthFormValues,
} from '../../../shared';
import type { AuthMode } from './auth-dialog.types';

const isAuthField = (name: string): name is AuthField => AUTH_FIELDS.includes(name as AuthField);

export class AuthFormValidator {
  private readonly form: HTMLFormElement;
  private readonly mode: AuthMode;
  private readonly touched = new Set<AuthField>();

  constructor(mode: AuthMode, form: HTMLFormElement) {
    this.mode = mode;
    this.form = form;
  }

  private handleEvent(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const name = target.name;

    if (!isAuthField(name)) return;

    this.touched.add(name);

    this.update();
  }

  private update(): void {
    const errors = getAuthFormErrors(this.mode, this.getValues());

    for (const field of AUTH_FIELDS) {
      if (this.touched.has(field)) {
        this.renderError(field, errors[field]);
      }
    }

    const submitButton = this.form.querySelector<HTMLButtonElement>('.auth-form__submit-btn');
    const hasErrors = Object.keys(errors).length > 0;

    if (submitButton) {
      submitButton.disabled = hasErrors;
    }
  }

  private renderError(field: AuthField, error: string | undefined): void {
    const input = this.form.elements.namedItem(field);
    const message = this.form.querySelector<HTMLElement>(`[data-error-for="${CSS.escape(field)}"]`);

    if (!message || !(input instanceof HTMLInputElement)) return;
    message.textContent = error ?? '';

    const hasError = Boolean(error);

    input.classList.toggle('auth-form__input--invalid', hasError);
    input.setAttribute('aria-invalid', String(hasError));
  }

  public getValues(): AuthFormValues {
    const values: AuthFormValues = {};

    for (const field of AUTH_FIELDS) {
      const element = this.form.elements.namedItem(field);

      if (element instanceof HTMLInputElement) {
        values[field] = element.value;
      }
    }

    return values;
  }

  public bind(): void {
    this.form.addEventListener('input', (event) => {
      this.handleEvent(event);
    });

    this.form.addEventListener('focusout', (event) => {
      this.handleEvent(event);
    });

    this.update();
  }
}
