import { describe, expect, it } from 'vitest';
import { formatTotalScore } from './format-numbers';

describe('formatTotalScore', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1,000'],
    [1_234_567, '1,234,567'],
  ])('formats %i as %s', (score, expected) => {
    expect(formatTotalScore(score)).toBe(expected);
  });
});
