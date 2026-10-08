import { createElement } from '../../../shared';
import { Skeleton } from '../../skeleton';

export class CommentSkeleton {
  private readonly skeleton = new Skeleton();

  public render(count = 3): HTMLDivElement {
    const container = createElement('div', {
      className: 'comment-skeleton-list',
    });

    for (let index = 0; index < count; index += 1) {
      const author = this.skeleton.render('comment-skeleton__author');
      const text = this.skeleton.render('comment-skeleton__text');
      const meta = this.skeleton.render('comment-skeleton__meta');

      const item = createElement('div', {
        className: 'comment-skeleton',
      });

      item.append(author, text, meta);
      container.append(item);
    }

    return container;
  }
}
