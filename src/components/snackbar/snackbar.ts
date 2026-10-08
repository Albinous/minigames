import { createElement } from '../../shared';
import './snackbar.scss';

export type SnackbarType = 'success' | 'error';

export class Snackbar {
  private element: HTMLDivElement | undefined;
  private timeoutId: number | undefined;

  private hide(): void {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.element?.remove();
    this.element = undefined;
  }

  public show(message: string, type: SnackbarType): void {
    this.hide();

    const messageElement = createElement('span', {
      className: 'snackbar__message',
      text: message,
    });

    const closeButton = createElement('button', {
      className: 'snackbar__close',
      text: '×',
      attributes: {
        type: 'button',
        'aria-label': 'Close notification',
      },
    });

    const snackbar = createElement('div', {
      className: `snackbar snackbar--${type}`,
    });

    snackbar.append(messageElement, closeButton);
    document.body.append(snackbar);

    this.element = snackbar;

    closeButton.addEventListener('click', () => this.hide());

    this.timeoutId = globalThis.setTimeout(() => {
      this.hide();
    }, 3000);
  }
}
