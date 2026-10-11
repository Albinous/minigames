import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatRelativeDate } from './format-relative-date';

const NOW = new Date('2026-01-01T12:00:00Z').getTime();
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Дата, отстоящая от «сейчас» на заданное число миллисекунд назад
const ago = (milliseconds: number): string => new Date(NOW - milliseconds).toISOString();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('formatRelativeDate', () => {
  it.each([
    [MINUTE, '1 minute ago'],
    [5 * MINUTE, '5 minutes ago'],
    [59 * MINUTE, '59 minutes ago'],
    [HOUR, '1 hour ago'],
    [23 * HOUR, '23 hours ago'],
    [DAY, '1 day ago'],
    [6 * DAY, '6 days ago'],
    [7 * DAY, '1 week ago'],
    [29 * DAY, '4 weeks ago'],
    [30 * DAY, '1 month ago'],
    [90 * DAY, '3 months ago'],
  ])('formats %i ms ago as "%s"', (age, expected) => {
    expect(formatRelativeDate(ago(age))).toBe(expected);
  });
});
