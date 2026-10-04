import { createElement } from '../../shared';

export class EmptyState {
  public render(message = 'Data Not Found'): HTMLDivElement {
    const messageElement = createElement('p', {
      className: 'empty-state__message',
      text: message,
    });

    const container = createElement('div', {
      className: 'empty-state',
    });

    container.append(messageElement);

    return container;
  }
}
