import { Skeleton } from '../../components';
import { createElement } from '../../shared';

export class SliderSkeleton {
  private readonly skeleton = new Skeleton();

  public render(count = 3): HTMLDivElement {
    const container = createElement('div', {
      className: 'slider-skeleton',
    });

    const header = createElement('div', {
      className: 'slider-skeleton__header',
    });

    const title = this.skeleton.render('slider-skeleton__title');

    const arrows = createElement('div', {
      className: 'slider-skeleton__arrows',
    });

    const previous = this.skeleton.render('slider-skeleton__arrow');

    const next = this.skeleton.render('slider-skeleton__arrow');

    arrows.append(previous, next);
    header.append(title, arrows);

    const cards = createElement('div', {
      className: 'slider-skeleton__cards',
    });

    for (let index = 0; index < count; index += 1) {
      const card = this.skeleton.render('slider-skeleton__card');

      cards.append(card);
    }

    container.append(header, cards);

    return container;
  }
}
