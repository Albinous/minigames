import '../../styles/components/_game-stat.scss';
import { createElement } from "../../shared";
import starIcon from '../../assets/icons/star.svg';

export class Rating {
  private readonly value: number
  constructor(value: number) {
    this.value = value
  }

  public render(): HTMLElement {
    const rating = createElement('div', {
      className: 'game-stat rating'
    });
    const star = createElement('img', {
      className: 'game-stat__img',
      attributes: {
        src: starIcon
      }
    });
    const ratingValue = createElement('span', {
      className: 'game-stat__value',
      text: `${this.value}`
    });

    rating.append(star, ratingValue);

    return rating;
  }
}