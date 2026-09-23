import type { IGameStatOptions } from "../../core";
import { createElement } from "../../shared";

export class GameStat {
  private readonly options: IGameStatOptions;
  constructor(options: IGameStatOptions) {
    this.options = options
  }

  public render(): HTMLElement {
    const stat = createElement('div', {
      className: `game-stat ${this.options.className ?? ''}`,
    });

    const icon = createElement('img', {
      className: 'game-stat__img',
      attributes: {
        src: this.options.icon,
        alt: '',
      },
    });

    const value = createElement('span', {
      className: 'game-stat__value',
      text: `${this.options.value}`,
    });

    stat.append(icon, value);

    return stat;
  }
}