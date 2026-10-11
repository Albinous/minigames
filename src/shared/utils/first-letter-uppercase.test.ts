import { describe, expect, it } from 'vitest';
import { firstLetterToUppercase } from './first-letter-uppercase';

describe('firstLetterToUppercase', () => {
  it.each([
    ['hello', 'Hello'],
    ['Hello', 'Hello'],
    ['a', 'A'],
    ['élan', 'Élan'],
    ['hello world', 'Hello world'],
  ])('turns %j into %j', (input, expected) => {
    expect(firstLetterToUppercase(input)).toBe(expected);
  });
});
