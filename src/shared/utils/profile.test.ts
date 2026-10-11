import { describe, expect, it } from 'vitest';
import { getInitials, getProfileName } from './profile';

describe('getInitials', () => {
  it.each([
    ['John Doe', 'JD'],
    ['john', 'J'],
    ['  anna   maria  lopez ', 'AM'],
    ['Jean-Luc Picard', 'JP'],
    ['Éva Ünal', 'ÉÜ'],
    ['Иван Петров', 'ИП'],
    ['123 456', '14'],
    ['- John', 'J'],
  ])('builds initials for %j', (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });

  it.each(['@@@', '', ' '.repeat(3)])(
    'returns undefined when %j has no letters or digits',
    (name) => {
      expect(getInitials(name)).toBeUndefined();
    },
  );
});

describe('getProfileName', () => {
  it('uses the display name when it is present', () => {
    expect(getProfileName('John', 'j@mail.com')).toBe('John');
  });

  it('trims the display name', () => {
    expect(getProfileName('  John  ', 'j@mail.com')).toBe('John');
  });

  it.each(['', ' '.repeat(3)])(
    'falls back to the email name when display name is %j',
    (displayName) => {
      expect(getProfileName(displayName, 'john@mail.com')).toBe('john');
    },
  );

  it.each([
    ['', '@mail.com'],
    ['', ''],
  ])('falls back to a generic name for (%j, %j)', (displayName, email) => {
    expect(getProfileName(displayName, email)).toBe('Player');
  });
});
