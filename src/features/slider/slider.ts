import { getSliderView } from "./slider.view";
import gamesData from '../../data/all-games-seed.json';
import type { IGame } from "../../core";

const games: IGame[] = gamesData.data

export class Slider {
  public render(): HTMLElement {
    const slider = document.createElement('games');

    slider.className = 'slider';
    slider.innerHTML = getSliderView(games);

    return slider;
  }
}