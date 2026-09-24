import { createContainer, createElement } from "../../../shared";
import type { IGameDetails } from "../../../core/services/models/game-details";
import closeIconImg from '../../../assets/icons/close.svg';

export class GameDetails {

  private dialogElement: HTMLElement | undefined;
  private readonly game: IGameDetails;

  constructor(game: IGameDetails) {
    this.game = game;
  }

  private createHero(): HTMLElement {
    const container = createContainer('game-dialog__hero');
    const img = createElement('img', {
      className: 'game-dialog__img',
      attributes: {
        src: this.game.heroImage,
        alt: this.game.name
      }
    });
    const closeButton = createElement('button', {
      className: 'game-dialog__close',
      attributes: {
        type: 'button',
        'aria-label': 'Close'
      }
    });

    const closeIcon = createElement('img', {
      className: 'game-dialog__close-icon',
      attributes: {
        src: closeIconImg,
        alt: 'close'
      }
    });

    closeButton.append(closeIcon);
    container.append(img, closeButton);

    return container
  }

  public render(): HTMLElement {
    const root = createElement('dialog', {
      className: 'game-dialog__root'
    });

    this.dialogElement = root;

    const hero = this.createHero();

    root.append(hero);

    return root;
  }
}