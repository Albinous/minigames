import './games-card.scss';
import { createContainer, createElement } from '../../shared';
import type { IGame } from '../../core';

export class GameCard {

  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game;
  }

  private createCardContainer(): HTMLElement {
    const container = createContainer('game-card__wrapper');
    const img = createElement('img', {
      className: 'game-card__img',
      attributes: {
        src: `${this.game.cardImage}`
      }
    });
    const cardInfo = createContainer('game-card__info');

    container.append(img, cardInfo);

    return container;
  }

  public render(): HTMLElement {
    const gameCard = createElement('div', {
      className: 'game-card'
    });
    const container = this.createCardContainer();

    gameCard.append(container)

    return gameCard;
  }
}