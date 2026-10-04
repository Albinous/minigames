import { createElement } from '../../../shared';
import { Skeleton } from '../../skeleton';

export class GameDetailsSkeleton {
  private readonly skeleton = new Skeleton();

  public render(): HTMLDivElement {
    const image = this.skeleton.render('game-details-skeleton__image');
    const title = this.skeleton.render('game-details-skeleton__title');
    const category = this.skeleton.render('game-details-skeleton__category');
    const description = this.skeleton.render('game-details-skeleton__description');
    const stats = this.skeleton.render('game-details-skeleton__stats');
    const button = this.skeleton.render('game-details-skeleton__button');

    const content = createElement('div', {
      className: 'game-details-skeleton__content',
    });

    content.append(title, category, description, stats, button);

    const container = createElement('div', {
      className: 'game-details-skeleton',
    });

    container.append(image, content);

    return container;
  }
}
