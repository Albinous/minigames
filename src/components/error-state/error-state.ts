import './error-state.scss';
import { createElement } from '../../shared';

export class ErrorState {
  public render(message: string, onRetry: () => void): HTMLDivElement {
    const messageElement = createElement('p', {
      className: 'error-state__message',
      text: message,
    });

    const retryButton = createElement('button', {
      className: 'btn btn-primary error-state__retry',
      text: 'Retry',
      attributes: {
        type: 'button',
      },
    });

    retryButton.addEventListener('click', onRetry);

    const container = createElement('div', {
      className: 'error-state',
    });

    container.append(messageElement, retryButton);

    return container;
  }
}
