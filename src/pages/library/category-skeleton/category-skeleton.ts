import './category-skeleton.scss';
import { Skeleton } from '../../../components';
import { createElement } from '../../../shared';

export class CategorySkeleton {
  private readonly skeleton = new Skeleton();

  public render(count = 7): HTMLDivElement {
    const container = createElement('div', {
      className: 'category-skeleton',
    });

    for (let index = 0; index < count; index += 1) {
      const item = this.skeleton.render('category-skeleton__item');

      container.append(item);
    }

    return container;
  }
}
