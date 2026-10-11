import { describe, expect, it } from 'vitest';
import {
  getAuthFormErrors,
  validateAuthField,
  validateConfirmPassword,
  validateEmail,
  validateLoginPassword,
  validateRegisterPassword,
  validateUsername,
} from './validators';

describe('validateEmail', () => {
  it.each(['alex@minigames.com', '  alex@minigames.com ', 'a.b+c@d-e.org'])(
    'accepts %j',
    (value) => {
      expect(validateEmail(value)).toBeUndefined();
    },
  );

  it.each(['', ' '.repeat(3), 'alex', 'alex@', '@mail.com', 'alex@mail', 'a b@mail.com'])(
    'rejects %j',
    (value) => {
      expect(validateEmail(value)).toBeTypeOf('string');
    },
  );
});

describe('validateUsername', () => {
  it.each(['Alex', 'A1', 'Alex99', `A${'a'.repeat(29)}`])('accepts %j', (value) => {
    expect(validateUsername(value)).toBeUndefined();
  });

  it.each(['', 'A', `A${'a'.repeat(30)}`, 'alex', 'Алекс', 'Alex_1', ' Alex', 'Al ex'])(
    'rejects %j',
    (value) => {
      expect(validateUsername(value)).toBeTypeOf('string');
    },
  );
});

describe('validateLoginPassword', () => {
  it.each(['', 'abcde'])('rejects %j', (value) => {
    expect(validateLoginPassword(value)).toBeTypeOf('string');
  });

  it.each(['abcdef', 'abc def'])('accepts %j without complexity rules', (value) => {
    expect(validateLoginPassword(value)).toBeUndefined();
  });
});

describe('validateRegisterPassword', () => {
  it('accepts a strong password', () => {
    expect(validateRegisterPassword('Abc123!')).toBeUndefined();
  });

  it.each([
    ['', 'empty'],
    ['Ab1!', 'too short'],
    ['abcdef1!', 'no uppercase letter'],
    ['Abcdefg!', 'no digit'],
    ['Abcdef12', 'no special character'],
    ['Abc 123!', 'contains a space'],
    ['Пароль1!', 'contains non-English letters'],
  ])('rejects %j (%s)', (value) => {
    expect(validateRegisterPassword(value)).toBeTypeOf('string');
  });
});

describe('validateConfirmPassword', () => {
  it('accepts a matching confirmation', () => {
    expect(validateConfirmPassword('Abc123!', 'Abc123!')).toBeUndefined();
  });

  it('rejects an empty confirmation', () => {
    expect(validateConfirmPassword('Abc123!', '')).toBeTypeOf('string');
  });

  it('rejects a different confirmation', () => {
    expect(validateConfirmPassword('Abc123!', 'abc123!')).toBeTypeOf('string');
  });
});

describe('validateAuthField', () => {
  it('applies different password rules in login and register modes', () => {
    const values = { password: 'abcdef' };

    expect(validateAuthField('login', 'password', values)).toBeUndefined();
    expect(validateAuthField('register', 'password', values)).toBeTypeOf('string');
  });

  it('checks the confirmation against the password field', () => {
    const values = { password: 'Abc123!', confirmPassword: 'Abc123?' };

    expect(validateAuthField('register', 'confirmPassword', values)).toBeTypeOf('string');
  });
});

describe('getAuthFormErrors', () => {
  const validRegisterValues = {
    username: 'Alex',
    email: 'alex@mail.com',
    password: 'Abc123!',
    confirmPassword: 'Abc123!',
  };

  it('returns no errors for a valid login form', () => {
    expect(getAuthFormErrors('login', { email: 'alex@mail.com', password: 'abcdef' })).toEqual({});
  });

  it('returns no errors for a valid register form', () => {
    expect(getAuthFormErrors('register', validRegisterValues)).toEqual({});
  });

  it('reports only fields of the login form', () => {
    const errors = getAuthFormErrors('login', {
      username: '',
      email: 'bad',
      password: '123',
      confirmPassword: 'x',
    });

    expect(Object.keys(errors).toSorted((a, b) => a.localeCompare(b))).toEqual([
      'email',
      'password',
    ]);
  });

  it('treats missing values as empty', () => {
    expect(
      Object.keys(getAuthFormErrors('login', {})).toSorted((a, b) => a.localeCompare(b)),
    ).toEqual(['email', 'password']);
  });

  it('reports every invalid field of the register form', () => {
    const errors = getAuthFormErrors('register', {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    expect(Object.keys(errors).toSorted((a, b) => a.localeCompare(b))).toEqual([
      'confirmPassword',
      'email',
      'password',
      'username',
    ]);
  });

  it('reports only the confirmation when passwords differ', () => {
    const errors = getAuthFormErrors('register', {
      ...validRegisterValues,
      confirmPassword: 'Abc123?',
    });

    expect(Object.keys(errors)).toEqual(['confirmPassword']);
  });
});
