import type { IGameStatOptions } from '../../core';
import { createElement, iconToSvg } from '../../shared';

export class GameStat {
  private readonly options: IGameStatOptions;
  constructor(options: IGameStatOptions) {
    this.options = options;
  }

  public render(): HTMLElement {
    const stat = createElement('div', {
      className: `game-stat ${this.options.className ?? ''}`,
    });

    iconToSvg(this.options.icon, stat);

    const value = createElement('span', {
      className: 'game-stat__value',
      text: `${this.options.value}`,
    });

    stat.append(value);

    return stat;
  }
}
