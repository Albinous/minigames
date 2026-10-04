import { getSliderView } from './slider.view';
import type { GamesService, IGame, Store } from '../../core';
import { EmptyState, ErrorState } from '../../components';
import { SliderSkeleton } from './slider-skeleton';
import { Snackbar } from '../../components/snackbar/snackbar';

const AUTOPLAY_INTERVAL = 4000;

export class Slider {
  private readonly store: Store;
  private readonly gamesService: GamesService;
  private readonly errorState = new ErrorState();
  private readonly emptyState = new EmptyState();
  private readonly skeleton = new SliderSkeleton();
  private readonly snackbar = new Snackbar();

  private slider: HTMLElement | undefined = undefined;
  private track: HTMLElement | undefined = undefined;
  private activeIndex: number = 0;
  private autoplayId: number | undefined = undefined;
  private autoplayStartedAt = 0;
  private remainingTime = AUTOPLAY_INTERVAL;
  private swipeStartX = 0;
  private isDragging = false;
  private resizeObserver: ResizeObserver | undefined = undefined;

  private readonly onDetailsClick: (slug: string) => void;

  constructor(store: Store, gamesService: GamesService, onDetailsClick: (slug: string) => void) {
    this.store = store;
    this.gamesService = gamesService;
    this.onDetailsClick = onDetailsClick;
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

      this.updateCardContent(card);
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

  private updateCardContent(card: HTMLElement): void {
    const isShowInfo = card.getBoundingClientRect().width >= 288;

    card.classList.toggle('show-info', isShowInfo);
  }

  private observeCards(): void {
    if (!this.track) return;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const card = entry.target as HTMLElement;

        const isShowInfo = entry.contentRect.width >= 288;

        card.classList.toggle('show-info', isShowInfo);
      }
    });

    const cards = this.getCards();

    for (const card of cards) {
      this.resizeObserver.observe(card);
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
        this.isDragging = false;
        this.swipeStartX = event.clientX;
        this.pauseAutoplay();
      },
      { capture: true },
    );

    this.track.addEventListener(
      'pointermove',
      (event: PointerEvent) => {
        if (Math.abs(event.clientX - this.swipeStartX) >= 10) {
          this.isDragging = true;
        }
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
      { capture: true },
    );

    this.track.addEventListener(
      'pointercancel',
      () => {
        this.isDragging = false;
        this.resumeAutoplay();
      },
      { capture: true },
    );

    this.track.addEventListener(
      'click',
      (event: MouseEvent) => {
        if (!this.isDragging) return;

        event.preventDefault();
        event.stopPropagation();

        this.isDragging = false;
      },
      { capture: true },
    );

    const cards = this.getCards();

    for (const card of cards) {
      card.addEventListener('click', () => {
        if (this.isDragging) return;
        const slug = card.dataset.gameSlug;

        if (!slug) return;

        this.onDetailsClick?.(slug);
      });
    }
  }

  private async loadFeaturedGames(): Promise<void> {
    await this.gamesService.loadGames({ featured: true });

    if (this.store.games.error) {
      this.snackbar.show('Failed to load featured games', 'error');
      return;
    }

    this.snackbar.show('Featured games loaded successfully', 'success');
  }

  private get featuredGames(): IGame[] {
    return this.store.games.data?.data ?? [];
  }

  private renderState(): void {
    if (!this.slider) return;

    if (this.store.games.isLoading) {
      this.stopAutoplay();
      this.track = undefined;

      this.slider.replaceChildren(this.skeleton.render());
      return;
    }

    if (this.store.games.error) {
      this.stopAutoplay();
      this.track = undefined;

      this.slider.replaceChildren(
        this.errorState.render(this.store.games.error, () => this.retryLoad()),
      );

      return;
    }

    if (this.featuredGames.length === 0) {
      this.stopAutoplay();
      this.track = undefined;

      this.slider.replaceChildren(this.emptyState.render());
      return;
    }

    this.slider.innerHTML = getSliderView(this.featuredGames);
    const track = this.slider.querySelector<HTMLElement>('.games-slider__track');

    if (!track) return;

    this.track = track;

    this.activeIndex = 0;

    this.updateCards();
    this.observeCards();
    this.bindEvents();
    this.bindSwipe();
    this.startAutoplay();
  }

  private async retryLoad(): Promise<void> {
    const loadPromise = this.loadFeaturedGames();

    this.renderState();

    await loadPromise;

    this.renderState();
  }

  public async render(): Promise<HTMLElement> {
    this.slider = document.createElement('section');
    this.slider.className = 'games';

    const loadPromise = this.loadFeaturedGames();

    this.renderState();

    await loadPromise;

    this.renderState();

    return this.slider;
  }
}
