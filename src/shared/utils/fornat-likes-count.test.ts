import { describe, expect, it } from 'vitest';
import { formatLikesCount } from './format-likes-count';

describe('formatLikesCount', () => {
  it.each([
    [0, '0K'],
    [99, '0K'],
    [100, '0.1K'],
    [999, '0.9K'],
    [1000, '1K'],
    [1500, '1.5K'],
    [12_345, '12.3K'],
  ])('formats %i as %s', (likes, expected) => {
    expect(formatLikesCount(likes)).toBe(expected);
  });
});
