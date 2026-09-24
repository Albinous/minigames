import { createContainer, createElement } from '../../../shared';
import type { IGameDetails } from '../../../core/services/models/game-details';
import closeIconImg from '../../../assets/icons/close.svg';
import gameDetailsData from '../../../data/game-tukoni-forest-keepers.json';

export class GameDialog {
  private dialogElement: HTMLDialogElement | undefined;
  private readonly game: IGameDetails = gameDetailsData.data;

  private createHero(): HTMLElement {
    const container = createContainer('game-dialog__hero');
    const img = createElement('img', {
      className: 'game-dialog__img',
      attributes: {
        src: this.game.heroImage,
        alt: this.game.name,
      },
    });
    const closeButton = createElement('button', {
      className: 'game-dialog__close',
      attributes: {
        type: 'button',
        'aria-label': 'Close',
      },
    });

    const closeIcon = createElement('img', {
      className: 'game-dialog__close-icon',
      attributes: {
        src: closeIconImg,
        alt: 'close',
      },
    });

    closeButton.append(closeIcon);
    container.append(img, closeButton);

    return container;
  }

  public open(): void {
    if (!this.dialogElement) return;
    this.dialogElement.showModal();
  }

  public render(): HTMLDialogElement {
    const root = createElement('dialog', {
      className: 'game-dialog',
    });

    this.dialogElement = root;

    const hero = this.createHero();

    root.append(hero);

    return root;
  }
}
