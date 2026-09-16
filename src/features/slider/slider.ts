import { getSliderView } from './slider.view';
import gamesData from '../../data/all-games-seed.json';
import type { IGame } from '../../core';

export class Slider {
  public render(): HTMLElement {
    const games: IGame[] = gamesData.data;
    const slider = document.createElement('section');

    slider.className = 'games';
    slider.innerHTML = getSliderView(games);

    return slider;
  }
}
