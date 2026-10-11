import { describe, expect, it, vi } from 'vitest';
import { LeaderboardSkeleton } from './leaderboard-skeleton';

vi.mock('../../components', () => ({
  Skeleton: class Skeleton {
    public render(className = ''): HTMLElement {
      const element = document.createElement('div');

      element.className = `skeleton ${className}`.trim();

      return element;
    }
  },
}));

const rows = (container: HTMLElement): Element[] => [
  ...container.querySelectorAll('.leaderboard-skeleton__row'),
];

describe('LeaderboardSkeleton', () => {
  it('renders five rows by default', () => {
    const container = new LeaderboardSkeleton().render();

    expect(container.className).toBe('leaderboard-skeleton');
    expect(rows(container)).toHaveLength(5);
  });

  it('renders the requested number of rows', () => {
    expect(rows(new LeaderboardSkeleton().render(2))).toHaveLength(2);
  });

  it('renders no rows for zero', () => {
    expect(rows(new LeaderboardSkeleton().render(0))).toHaveLength(0);
  });

  it('builds every row from a rank, a name and a score', () => {
    const [row] = rows(new LeaderboardSkeleton().render(1));

    expect([...row.children].map((child) => child.className)).toEqual([
      'skeleton leaderboard-skeleton__rank',
      'skeleton leaderboard-skeleton__name',
      'skeleton leaderboard-skeleton__score',
    ]);
  });
});
