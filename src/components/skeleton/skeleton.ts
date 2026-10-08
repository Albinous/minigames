import './skeleton.scss';
import { createElement } from '../../shared';

export class Skeleton {
  public render(className = ''): HTMLDivElement {
    return createElement('div', {
      className: `skeleton ${className}`.trim(),
    });
  }
}
