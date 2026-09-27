import { getSliderView } from './slider.view';
import gamesData from '../../data/all-games-seed.json';
import type { IGame } from '../../core';

export class Slider {
  private slider: HTMLElement | undefined = undefined;
  private viewport: HTMLElement | undefined = undefined;
  private track: HTMLElement | undefined = undefined;
  private activeIndex: number = 0;
  private games: IGame[];
  private featuredGames: IGame[];

  constructor() {
    this.games = gamesData.data;
    this.featuredGames = this.games.filter((game) => game.featured);
  }

  private getCards(): HTMLElement[] {
    if (!this.track) return [];

    return [...this.track.querySelectorAll<HTMLElement>('.slider-game-card')];
  }

  private updateCards(): void {
    const cards = this.getCards();

    for (const [index, card] of cards.entries()) {
      const distance = this.getDistance(index);
      const role = this.getCardRole(distance);

      card.style.order = String(distance);

      card.classList.remove('active', 'near', 'far', 'hidden');

      card.classList.add(role);
    }
  }

  private getDistance(index: number): number {
    const count = this.featuredGames.length;
    const difference = index - this.activeIndex;

    if (difference > count / 2) {
      return difference - count;
    }

    if (difference < -count / 2) {
      return difference + count;
    }

    return difference;
  }

  private getCardRole(distance: number): string {
    switch (Math.abs(distance)) {
      case 0: {
        return 'active';
      }

      case 1: {
        return 'near';
      }

      case 2: {
        return 'far';
      }

      default: {
        return 'hidden';
      }
    }
  }

  private next(): void {
    this.activeIndex = (this.activeIndex + 1) % this.featuredGames.length;

    this.updateCards();
  }

  private prev(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.featuredGames.length) % this.featuredGames.length;

    this.updateCards();
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
    this.slider.innerHTML = getSliderView(this.featuredGames);

    const viewport = this.slider.querySelector<HTMLElement>('.games-slider__viewport');

    if (viewport) {
      this.viewport = viewport;
    }

    const track = this.slider.querySelector<HTMLElement>('.games-slider__track');

    if (track) {
      this.track = track;
    }

    this.updateCards();
    this.bindEvents();

    return this.slider;
  }
}
