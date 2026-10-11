import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GamesService } from '../../core';
import { Store } from '../../core/state';
import { Slider } from './slider';

const { show } = vi.hoisted(() => ({ show: vi.fn() }));

vi.mock('../../components', () => ({
  EmptyState: class EmptyState {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'empty-state';

      return element;
    }
  },
  ErrorState: class ErrorState {
    public render(message: string, onRetry: () => void): HTMLElement {
      const element = document.createElement('div');
      const retry = document.createElement('button');

      element.className = 'error-state';
      element.textContent = message;
      retry.className = 'error-state__retry';
      retry.addEventListener('click', onRetry);
      element.append(retry);

      return element;
    }
  },
  Snackbar: class Snackbar {
    public show = show;
  },
}));

vi.mock('./slider-skeleton', () => ({
  SliderSkeleton: class SliderSkeleton {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'slider-skeleton';

      return element;
    }
  },
}));

// Разметка, которая нужна слайдеру: стрелки, дорожка и карточки с адресом игры
vi.mock('./slider.view', () => ({
  getSliderView: (games: { slug: string }[]): string => `
    <button class="games-arrow__previous" type="button"></button>
    <div class="games-slider__track">
      ${games.map((game) => `<div class="slider-game-card" data-game-slug="${game.slug}"></div>`).join('')}
    </div>
    <button class="games-arrow__next" type="button"></button>
  `,
}));

const AUTOPLAY_INTERVAL = 4000;
const ROLES = ['active', 'near', 'far', 'hidden'];

type Context = ReturnType<typeof createContext>;

const resizeCallbacks: ResizeObserverCallback[] = [];

const notifyResize = (card: HTMLElement, width: number): void => {
  const entries = [{ target: card, contentRect: { width } }] as unknown as ResizeObserverEntry[];

  resizeCallbacks.at(-1)?.(entries, {} as ResizeObserver);
};

const createGames = (count: number): { slug: string; name: string }[] =>
  Array.from({ length: count }, (_, index) => ({ slug: `game-${index}`, name: `Game ${index}` }));

const createContext = (count = 7) => {
  const store = new Store();
  const onDetailsClick = vi.fn();
  const loadGames = vi.fn<(query: unknown) => Promise<void>>(async () => {
    store.games.isLoading = true;
    store.games.error = undefined;
    await Promise.resolve();
    store.games.data = { data: createGames(count) } as never;
    store.games.isLoading = false;
  });
  const slider = new Slider(store, { loadGames } as unknown as GamesService, onDetailsClick);

  return { store, loadGames, onDetailsClick, slider };
};

const renderSlider = async (context: Context = createContext()) => {
  const section = context.slider.render();

  await vi.advanceTimersByTimeAsync(0);

  return { ...context, section };
};

const cards = (section: HTMLElement): HTMLElement[] => [
  ...section.querySelectorAll<HTMLElement>('.slider-game-card'),
];

const activeSlug = (section: HTMLElement): string | undefined =>
  section.querySelector<HTMLElement>('.slider-game-card.active')?.dataset.gameSlug;

const track = (section: HTMLElement): HTMLElement => {
  const element = section.querySelector<HTMLElement>('.games-slider__track');

  if (!element) throw new Error('track is not rendered');

  return element;
};

const pointer = (target: HTMLElement, type: string, clientX: number): void => {
  target.dispatchEvent(new MouseEvent(type, { clientX, bubbles: true }));
};

const clickArrow = (section: HTMLElement, type: 'previous' | 'next'): void => {
  section.querySelector<HTMLButtonElement>(`.games-arrow__${type}`)?.click();
};

beforeEach(() => {
  vi.useFakeTimers();
  show.mockClear();
  resizeCallbacks.length = 0;
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserverStub {
      public constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback);
      }

      public observe(): void {}

      public unobserve(): void {}

      public disconnect(): void {}
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Slider rendering', () => {
  it('shows a skeleton while loading and slides afterwards', async () => {
    const context = createContext();
    const section = context.slider.render();

    expect(section.className).toBe('games');
    expect(section.querySelector('.slider-skeleton')).not.toBeNull();

    await vi.advanceTimersByTimeAsync(0);

    expect(section.querySelector('.slider-skeleton')).toBeNull();
    expect(cards(section)).toHaveLength(7);
  });

  it('requests featured games', async () => {
    const { loadGames } = await renderSlider();

    expect(loadGames).toHaveBeenCalledWith({ featured: true });
  });

  it('places cards around the active one with roles and order', async () => {
    const { section } = await renderSlider();
    const roles = cards(section).map((card) => ROLES.find((role) => card.classList.contains(role)));

    expect(roles).toEqual(['active', 'near', 'far', 'hidden', 'hidden', 'far', 'near']);
    expect(cards(section).map((card) => card.style.order)).toEqual([
      '0',
      '1',
      '2',
      '3',
      '-3',
      '-2',
      '-1',
    ]);
  });

  it('shows card info only on wide cards', async () => {
    const narrow = await renderSlider();

    expect(cards(narrow.section).some((card) => card.classList.contains('show-info'))).toBe(false);

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 300,
    } as DOMRect);

    const wide = await renderSlider();

    expect(cards(wide.section).every((card) => card.classList.contains('show-info'))).toBe(true);
  });

  it('updates card info when a card is resized', async () => {
    const { section } = await renderSlider();
    const [card] = cards(section);

    notifyResize(card, 300);
    expect(card.classList.contains('show-info')).toBe(true);

    notifyResize(card, 200);
    expect(card.classList.contains('show-info')).toBe(false);
  });

  it('shows an empty state when there are no featured games', async () => {
    const { section } = await renderSlider(createContext(0));

    expect(section.querySelector('.empty-state')).not.toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('Slider errors', () => {
  it('shows an error with a snackbar and recovers on retry', async () => {
    const context = createContext();

    context.loadGames.mockImplementationOnce(async () => {
      context.store.games.isLoading = true;
      await Promise.resolve();
      context.store.games.error = 'Failed to load games';
      context.store.games.isLoading = false;
    });

    const { section } = await renderSlider(context);

    expect(section.querySelector('.error-state')).not.toBeNull();
    expect(show).toHaveBeenCalledWith('Failed to load featured games', 'error');
    expect(vi.getTimerCount()).toBe(0);

    section.querySelector<HTMLButtonElement>('.error-state__retry')?.click();
    await vi.advanceTimersByTimeAsync(0);

    expect(section.querySelector('.error-state')).toBeNull();
    expect(cards(section)).toHaveLength(7);
  });
});

describe('Slider navigation', () => {
  it('moves to the next and the previous slide with the arrows', async () => {
    const { section } = await renderSlider();

    clickArrow(section, 'next');
    expect(activeSlug(section)).toBe('game-1');

    clickArrow(section, 'previous');
    expect(activeSlug(section)).toBe('game-0');
  });

  it('wraps around at both ends', async () => {
    const { section } = await renderSlider();

    clickArrow(section, 'previous');
    expect(activeSlug(section)).toBe('game-6');

    clickArrow(section, 'next');
    expect(activeSlug(section)).toBe('game-0');
  });

  it('opens the details of a clicked card', async () => {
    const { section, onDetailsClick } = await renderSlider();

    cards(section)[2].click();

    expect(onDetailsClick).toHaveBeenCalledWith('game-2');
  });
});

describe('Slider autoplay', () => {
  it('advances slides on a timer', async () => {
    const { section } = await renderSlider();

    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(AUTOPLAY_INTERVAL);
    expect(activeSlug(section)).toBe('game-1');

    await vi.advanceTimersByTimeAsync(AUTOPLAY_INTERVAL);
    expect(activeSlug(section)).toBe('game-2');
  });

  it('restarts the full interval after using an arrow', async () => {
    const { section } = await renderSlider();

    await vi.advanceTimersByTimeAsync(3000);
    clickArrow(section, 'next');
    expect(activeSlug(section)).toBe('game-1');

    await vi.advanceTimersByTimeAsync(AUTOPLAY_INTERVAL - 1);
    expect(activeSlug(section)).toBe('game-1');

    await vi.advanceTimersByTimeAsync(1);
    expect(activeSlug(section)).toBe('game-2');
  });

  it('pauses while a pointer is down and continues with the remaining time', async () => {
    const { section } = await renderSlider();

    await vi.advanceTimersByTimeAsync(1000);
    pointer(track(section), 'pointerdown', 100);
    expect(vi.getTimerCount()).toBe(0);

    await vi.advanceTimersByTimeAsync(10_000);
    expect(activeSlug(section)).toBe('game-0');

    pointer(track(section), 'pointerup', 105);
    await vi.advanceTimersByTimeAsync(2999);
    expect(activeSlug(section)).toBe('game-0');

    await vi.advanceTimersByTimeAsync(1);
    expect(activeSlug(section)).toBe('game-1');
  });

  it('does not start a second timer when resumed while running', async () => {
    const { section } = await renderSlider();

    pointer(track(section), 'pointercancel', 0);

    expect(vi.getTimerCount()).toBe(1);
  });

  it('resumes after a cancelled pointer', async () => {
    const { section } = await renderSlider();

    pointer(track(section), 'pointerdown', 100);
    expect(vi.getTimerCount()).toBe(0);

    pointer(track(section), 'pointercancel', 100);
    expect(vi.getTimerCount()).toBe(1);
  });
});

describe('Slider swipe', () => {
  it('goes to the next slide on a swipe to the left', async () => {
    const { section } = await renderSlider();

    pointer(track(section), 'pointerdown', 200);
    pointer(track(section), 'pointerup', 100);

    expect(activeSlug(section)).toBe('game-1');
  });

  it('goes to the previous slide on a swipe to the right', async () => {
    const { section } = await renderSlider();

    pointer(track(section), 'pointerdown', 100);
    pointer(track(section), 'pointerup', 200);

    expect(activeSlug(section)).toBe('game-6');
  });

  it('does not change the slide on a short move', async () => {
    const { section } = await renderSlider();

    pointer(track(section), 'pointerdown', 100);
    pointer(track(section), 'pointerup', 130);

    expect(activeSlug(section)).toBe('game-0');
  });

  it('does not open details after dragging, but opens them on the next click', async () => {
    const { section, onDetailsClick } = await renderSlider();

    pointer(track(section), 'pointerdown', 0);
    pointer(track(section), 'pointermove', 20);
    pointer(track(section), 'pointerup', 20);
    cards(section)[1].click();

    expect(onDetailsClick).not.toHaveBeenCalled();

    cards(section)[1].click();

    expect(onDetailsClick).toHaveBeenCalledWith('game-1');
  });

  it('does not treat a tiny move as dragging', async () => {
    const { section, onDetailsClick } = await renderSlider();

    pointer(track(section), 'pointerdown', 0);
    pointer(track(section), 'pointermove', 5);
    cards(section)[0].click();

    expect(onDetailsClick).toHaveBeenCalledWith('game-0');
  });
});
