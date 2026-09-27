import { getSliderView } from './slider.view';
import gamesData from '../../data/all-games-seed.json';
import type { IGame } from '../../core';

const AUTOPLAY_INTERVAL = 4000;

export class Slider {
  private slider: HTMLElement | undefined = undefined;
  private viewport: HTMLElement | undefined = undefined;
  private track: HTMLElement | undefined = undefined;
  private activeIndex: number = 0;
  private games: IGame[];
  private featuredGames: IGame[];
  private autoplayId: number | undefined = undefined;
  private autoplayStartedAt = 0;
  private remainingTime = AUTOPLAY_INTERVAL;
  private swipeStartX = 0;

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

  private startAutoplay(): void {
    this.autoplayStartedAt = Date.now();

    this.autoplayId = globalThis.setTimeout(() => {
      this.next();
      this.remainingTime = AUTOPLAY_INTERVAL;
      this.startAutoplay();
    }, this.remainingTime);
  }

  private stopAutoplay(): void {
    if (this.autoplayId === undefined) return;

    globalThis.clearTimeout(this.autoplayId);
    this.autoplayId = undefined;

    const elapsed = Date.now() - this.autoplayStartedAt;

    this.remainingTime = Math.max(this.remainingTime - elapsed, 0);
  }

  private pauseAutoplay(): void {
    this.stopAutoplay();
  }

  private resumeAutoplay(): void {
    if (this.autoplayId !== undefined) return;

    this.startAutoplay();
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.remainingTime = AUTOPLAY_INTERVAL;
    this.startAutoplay();
  }

  private bindEvents() {
    if (!this.slider) return;
    const previousButton = this.slider.querySelector('.games-arrow__previous');
    const nextButton = this.slider.querySelector('.games-arrow__next');

    previousButton?.addEventListener('click', () => {
      this.prev();
      this.resetAutoplay();
    });

    nextButton?.addEventListener('click', () => {
      this.next();
      this.resetAutoplay();
    });
  }

  private bindSwipe(): void {
    if (!this.track) return;

    this.track.addEventListener(
      'pointerdown',
      (event: PointerEvent) => {
        this.swipeStartX = event.clientX;
        this.pauseAutoplay();
      },
      { capture: true },
    );

    this.track.addEventListener(
      'pointerup',
      (event: PointerEvent) => {
        const difference = event.clientX - this.swipeStartX;
        const swipeThreshold = 50;

        if (Math.abs(difference) < swipeThreshold) {
          this.resumeAutoplay();
          return;
        }

        if (difference < 0) {
          this.next();
        } else {
          this.prev();
        }

        this.resetAutoplay();
      },
    );

    this.track.addEventListener(
      'pointercancel',
      () => {
        this.resumeAutoplay();
      },
    );
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
    this.bindSwipe();
    this.startAutoplay();

    return this.slider;
  }
}
