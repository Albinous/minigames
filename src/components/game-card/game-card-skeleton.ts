import { createElement } from '../../shared';
import { Skeleton } from '../skeleton';

export class GameCardSkeleton {
  private readonly skeleton = new Skeleton();

  public render(): HTMLDivElement {
    const image = this.skeleton.render('game-card-skeleton__image');
    const title = this.skeleton.render('game-card-skeleton__title');
    const category = this.skeleton.render('game-card-skeleton__category');
    const description = this.skeleton.render('game-card-skeleton__description');
    const stats = this.skeleton.render('game-card-skeleton__stats');
    const button = this.skeleton.render('game-card-skeleton__button');

    const header = createElement('div', {
      className: 'game-card-skeleton__header',
    });

    header.append(title, category);

    const footer = createElement('div', {
      className: 'game-card-skeleton__footer',
    });

    footer.append(stats, button);

    const info = createElement('div', {
      className: 'game-card-skeleton__info',
    });

    info.append(header, description, footer);

    const card = createElement('div', {
      className: 'game-card-skeleton',
    });

    card.append(image, info);

    return card;
  }
}
