import { Skeleton } from '../../components';
import { createElement } from '../../shared';

export class LeaderboardSkeleton {
  private readonly skeleton = new Skeleton();

  public render(count = 5): HTMLDivElement {
    const container = createElement('div', {
      className: 'leaderboard-skeleton',
    });

    for (let index = 0; index < count; index += 1) {
      const rank = this.skeleton.render('leaderboard-skeleton__rank');
      const name = this.skeleton.render('leaderboard-skeleton__name');
      const score = this.skeleton.render('leaderboard-skeleton__score');

      const row = createElement('div', {
        className: 'leaderboard-skeleton__row',
      });

      row.append(rank, name, score);
      container.append(row);
    }

    return container;
  }
}
