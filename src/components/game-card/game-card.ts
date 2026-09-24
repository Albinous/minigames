import './games-card.scss';
import {
  createContainer,
  createElement,
  firstLetterToUppercase,
  formatLikesCount,
} from '../../shared';
import type { IGame } from '../../core';
import { GameStat } from '../game-stat';
import starIcon from '../../assets/icons/star.svg';
import likeIcon from '../../assets/icons/like.svg';

export class GameCard {
  private readonly game: IGame;

  constructor(game: IGame) {
    this.game = game;
  }

  private createCardInfo(): HTMLElement {
    const container = createContainer('game-card__info');
    const cardHeader = this.createHeader();
    const description = createElement('p', {
      className: 'game-card__descr',
      text: this.game.shortDescription,
    });
    const stats = this.createStats();

    container.append(cardHeader, description, stats);

    return container;
  }

  private createHeader(): HTMLElement {
    const container = createContainer('game-card__header');
    const containerLeft = createContainer('game-card__header-left');
    const title = createElement('h3', {
      className: 'game-card__title',
      text: this.game.name,
    });
    const category = createElement('span', {
      className: 'game-card__category',
      text: firstLetterToUppercase(this.game.category),
    });
    const price = createElement('h4', {
      className: 'game-card__price',
      text: this.game.price,
    });

    containerLeft.append(title, category);
    container.append(containerLeft, price);

    return container;
  }

  private createStats(): HTMLElement {
    const container = createContainer('game-card__end');
    const stats = createContainer('game-card__stats');
    const rating = new GameStat({
      icon: starIcon,
      value: `${this.game.rating}`,
      className: 'rating',
    });
    const likes = new GameStat({
      icon: likeIcon,
      value: formatLikesCount(this.game.likesCount),
      className: 'likes',
    });
    const buttonDetails = createElement('button', {
      className: 'btn btn-primary game-card__btn',
      text: 'Details',
      attributes: {
        type: 'button',
      },
    });

    stats.append(rating.render(), likes.render());
    container.append(stats, buttonDetails);

    return container;
  }

  public render(): HTMLElement {
    const gameCard = createElement('div', {
      className: 'game-card',
    });
    const img = createElement('img', {
      className: 'game-card__img',
      attributes: {
        src: this.game.cardImage,
      },
    });
    const cardInfo = this.createCardInfo();

    gameCard.append(img, cardInfo);

    return gameCard;
  }
}
