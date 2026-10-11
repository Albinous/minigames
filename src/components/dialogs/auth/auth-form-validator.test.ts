import { beforeEach, describe, expect, it } from 'vitest';
import { AuthFormValidator } from './auth-form-validator';

const LOGIN_FORM = `
  <form>
    <input name="email" />
    <p data-error-for="email"></p>
    <input name="password" />
    <p data-error-for="password"></p>
    <input name="other" />
    <button class="auth-form__submit-btn" type="submit"></button>
  </form>
`;

const REGISTER_FORM = `
  <form>
    <input name="username" />
    <p data-error-for="username"></p>
    <input name="email" />
    <p data-error-for="email"></p>
    <input name="password" />
    <p data-error-for="password"></p>
    <input name="confirmPassword" />
    <p data-error-for="confirmPassword"></p>
    <button class="auth-form__submit-btn" type="submit"></button>
  </form>
`;

const createForm = (html: string): HTMLFormElement => {
  document.body.innerHTML = html;

  const form = document.querySelector<HTMLFormElement>('form');

  if (!form) throw new Error('fixture is broken');

  return form;
};

const input = (form: HTMLFormElement, name: string): HTMLInputElement => {
  const element = form.querySelector<HTMLInputElement>(`input[name="${CSS.escape(name)}"]`);

  if (!element) throw new Error(`no input ${name}`);

  return element;
};

const type = (form: HTMLFormElement, name: string, value: string): void => {
  const element = input(form, name);

  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

const leave = (form: HTMLFormElement, name: string): void => {
  input(form, name).dispatchEvent(new Event('focusout', { bubbles: true }));
};

const errorOf = (form: HTMLFormElement, name: string): string | null | undefined =>
  form.querySelector(`[data-error-for="${CSS.escape(name)}"]`)?.textContent;

const submitButton = (form: HTMLFormElement): HTMLButtonElement | null =>
  form.querySelector<HTMLButtonElement>('.auth-form__submit-btn');

beforeEach(() => {
  document.body.replaceChildren();
});

describe('AuthFormValidator', () => {
  it('blocks submit and shows no errors on an untouched empty form', () => {
    const form = createForm(LOGIN_FORM);

    new AuthFormValidator('login', form).bind();

    expect(submitButton(form)?.disabled).toBe(true);
    expect(errorOf(form, 'email')).toBe('');
    expect(errorOf(form, 'password')).toBe('');
  });

  it('shows the error of a typed field only and marks it invalid', () => {
    const form = createForm(LOGIN_FORM);

    new AuthFormValidator('login', form).bind();
    type(form, 'email', 'bad');

    expect(errorOf(form, 'email')).not.toBe('');
    expect(input(form, 'email').classList.contains('auth-form__input--invalid')).toBe(true);
    expect(input(form, 'email').getAttribute('aria-invalid')).toBe('true');
    expect(errorOf(form, 'password')).toBe('');
  });

  it('shows a required error when an empty field is left', () => {
    const form = createForm(LOGIN_FORM);

    new AuthFormValidator('login', form).bind();
    leave(form, 'email');

    expect(errorOf(form, 'email')).toMatch(/required/i);
  });

  it('clears errors and enables submit once the form is valid', () => {
    const form = createForm(LOGIN_FORM);

    new AuthFormValidator('login', form).bind();
    type(form, 'email', 'bad');
    type(form, 'password', '123');
    type(form, 'email', 'alex@mail.com');
    type(form, 'password', 'abcdef');

    expect(errorOf(form, 'email')).toBe('');
    expect(errorOf(form, 'password')).toBe('');
    expect(input(form, 'email').getAttribute('aria-invalid')).toBe('false');
    expect(submitButton(form)?.disabled).toBe(false);
  });

  it('reads only the fields that exist in the form', () => {
    const form = createForm(LOGIN_FORM);
    const validator = new AuthFormValidator('login', form);

    type(form, 'email', 'alex@mail.com');
    type(form, 'password', 'abcdef');

    expect(validator.getValues()).toEqual({ email: 'alex@mail.com', password: 'abcdef' });
  });

  it('ignores inputs that are not auth fields', () => {
    const form = createForm(LOGIN_FORM);

    new AuthFormValidator('login', form).bind();
    type(form, 'other', 'anything');

    expect(errorOf(form, 'email')).toBe('');
    expect(errorOf(form, 'password')).toBe('');
  });

  it('works when the error placeholders are missing', () => {
    const form = createForm(
      '<form><input name="email" /><input name="password" /><button class="auth-form__submit-btn"></button></form>',
    );

    new AuthFormValidator('login', form).bind();

    expect(() => {
      type(form, 'email', 'bad');
    }).not.toThrow();
    expect(submitButton(form)?.disabled).toBe(true);
  });

  it('validates the confirmation again when the password changes', () => {
    const form = createForm(REGISTER_FORM);

    new AuthFormValidator('register', form).bind();
    type(form, 'password', 'Abc123!');
    type(form, 'confirmPassword', 'Abc123!');

    expect(errorOf(form, 'confirmPassword')).toBe('');

    type(form, 'password', 'Abc123?');

    expect(errorOf(form, 'confirmPassword')).toMatch(/match/i);
  });

  it('enables submit for a valid register form', () => {
    const form = createForm(REGISTER_FORM);

    new AuthFormValidator('register', form).bind();
    type(form, 'username', 'Alex');
    type(form, 'email', 'alex@mail.com');
    type(form, 'password', 'Abc123!');
    type(form, 'confirmPassword', 'Abc123!');

    expect(submitButton(form)?.disabled).toBe(false);
  });

  it('recomputes the submit state on demand', () => {
    const form = createForm(LOGIN_FORM);
    const validator = new AuthFormValidator('login', form);

    validator.bind();
    input(form, 'email').value = 'alex@mail.com';
    input(form, 'password').value = 'abcdef';

    expect(submitButton(form)?.disabled).toBe(true);

    validator.update();

    expect(submitButton(form)?.disabled).toBe(false);
  });
});