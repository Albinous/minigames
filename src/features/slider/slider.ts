import { getSliderView } from './slider.view';
import gamesData from '../../data/all-games-seed.json';
import type { IGame } from '../../core';

export class Slider {
  private slider: HTMLElement | undefined = undefined;
  private activeIndex: number = 0;
  private games: IGame[];
  private featuredGames: IGame[];

  constructor() {
    this.games = gamesData.data;
    this.featuredGames = this.games.filter((game) => game.featured);
  }

  private next(): void {
    this.activeIndex = (this.activeIndex + 1) % this.featuredGames.length;

    this.update();
  }

  private prev(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.featuredGames.length) % this.featuredGames.length;

    this.update();
  }

  private update(): void {
    if (!this.slider) return;

    this.slider.innerHTML = getSliderView(this.featuredGames, this.activeIndex);

    this.bindEvents();
  }

  private bindEvents() {
    if (!this.slider) return;
    const previousButton = this.slider.querySelector('.games-arrow__previous');
    const nextButton = this.slider.querySelector('.games-arrow__next');

    previousButton?.addEventListener('click', () => {
      this.prev();
    });

    nextButton?.addEventListener('click', () => {
      this.next();
    });
  }

  public render(): HTMLElement {
    this.slider = document.createElement('section');

    this.slider.className = 'games';
    this.slider.innerHTML = getSliderView(this.featuredGames, this.activeIndex);

    this.bindEvents();

    return this.slider;
  }
}
