import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CategoriesService, GamesService } from '../../core';
import { Store } from '../../core/state';
import { LibraryPage } from './library-page';

const { show } = vi.hoisted(() => ({ show: vi.fn() }));

vi.mock('../../core', () => ({ CategoriesService: class CategoriesService {} }));

vi.mock('../../assets/icons', () => ({ arrowLeftIcon: 'left.svg', arrowRightIcon: 'right.svg' }));

vi.mock('../../components/snackbar/snackbar', () => ({
  Snackbar: class Snackbar {
    public show = show;
  },
}));

vi.mock('./category-skeleton/category-skeleton', () => ({
  CategorySkeleton: class CategorySkeleton {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'category-skeleton';

      return element;
    }
  },
}));

vi.mock('../../components', () => ({
  EmptyState: class EmptyState {
    public render(message?: string): HTMLElement {
      const element = document.createElement('div');

      element.className = 'empty-state';
      element.textContent = message ?? '';

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
  GameCard: class GameCard {
    private readonly game: { slug: string; name: string };
    private readonly onDetailsClick: (slug: string) => void;

    public constructor(
      game: { slug: string; name: string },
      onDetailsClick: (slug: string) => void,
    ) {
      this.game = game;
      this.onDetailsClick = onDetailsClick;
    }

    public render(): HTMLElement {
      const element = document.createElement('article');

      element.className = 'game-card';
      element.textContent = this.game.name;
      element.addEventListener('click', () => {
        this.onDetailsClick(this.game.slug);
      });

      return element;
    }
  },
  GameCardSkeleton: class GameCardSkeleton {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'game-card-skeleton';

      return element;
    }
  },
}));

const games = [
  { slug: 'alpha', name: 'Alpha' },
  { slug: 'beta', name: 'Beta' },
];

const categories = [
  { slug: 'all', label: 'All' },
  { slug: 'puzzle', label: 'Puzzle' },
];

type Context = ReturnType<typeof createContext>;

const createContext = () => {
  const store = new Store();
  const onDetailsClick = vi.fn();
  const loadGames = vi.fn<(query: unknown) => Promise<void>>(async () => {
    store.games.error = undefined;
    store.games.data = { data: games, meta: { page: 1, totalPages: 1 } } as never;
  });
  const loadCategories = vi.fn(async () => {
    store.categories.error = undefined;
    store.categories.data = { data: categories } as never;
  });
  const library = new LibraryPage(
    store,
    { loadGames } as unknown as GamesService,
    { loadCategories } as unknown as CategoriesService,
    onDetailsClick,
  );

  return { store, loadGames, loadCategories, onDetailsClick, library };
};

const flush = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

const renderLibrary = async (context: Context = createContext()) => {
  const main = await context.library.render();

  await flush();

  return { ...context, main };
};

const usePagination = (context: Context, page: number, totalPages: number): void => {
  context.loadGames.mockImplementation(async () => {
    context.store.games.data = { data: games, meta: { page, totalPages } } as never;
  });
};

const setWidth = (width: number): void => {
  Object.defineProperty(globalThis, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  });
};

const urlParameter = (name: string): string | null =>
  new URLSearchParams(globalThis.location.search).get(name);

const pageNumbers = (main: HTMLElement): (string | null)[] =>
  [...main.querySelectorAll('.library-pagination__page')].map((button) => button.textContent);

const arrow = (main: HTMLElement, type: 'prev' | 'next'): HTMLButtonElement | null =>
  main.querySelector<HTMLButtonElement>(`.library-pagination__arrow-${type}`);

beforeEach(() => {
  show.mockClear();
  setWidth(1024);
  globalThis.history.replaceState({}, '', '/library');
});

afterEach(() => {
  document.body.replaceChildren();
});

describe('LibraryPage rendering', () => {
  it('renders the title and a card for every game', async () => {
    const { main } = await renderLibrary();
    const cards = [...main.querySelectorAll('.game-card')];

    expect(main.className).toBe('main');
    expect(main.querySelector('.library-title')?.textContent).toBe('Game Library');
    expect(cards.map((card) => card.textContent)).toEqual(['Alpha', 'Beta']);
  });

  it('renders a button for every category and marks the first one active', async () => {
    const { main } = await renderLibrary();
    const buttons = [...main.querySelectorAll('.library-category')];

    expect(buttons.map((button) => button.textContent)).toEqual(['All', 'Puzzle']);
    expect(buttons.map((button) => button.classList.contains('active'))).toEqual([true, false]);
  });

  it('renders every sort option with the default one selected', async () => {
    const { main } = await renderLibrary();

    expect(main.querySelectorAll('.library-sort__option')).toHaveLength(4);
    expect(main.querySelector('.library-sort__btn')?.textContent).toBe('Sort by: Rating ↓');
    expect(main.querySelector('[data-sort="rating-desc"]')?.classList.contains('active')).toBe(
      true,
    );
  });

  it('opens the details of a clicked card', async () => {
    const { main, onDetailsClick } = await renderLibrary();

    main.querySelector<HTMLElement>('.game-card')?.click();

    expect(onDetailsClick).toHaveBeenCalledWith('alpha');
  });

  it('shows skeletons while games are loading', async () => {
    const context = createContext();

    context.loadGames.mockImplementation(() => {
      context.store.games.isLoading = true;

      return new Promise<void>(() => {});
    });

    const main = await context.library.render();

    expect(main.querySelectorAll('.game-card-skeleton')).toHaveLength(6);
  });

  it('shows a skeleton while categories are loading', async () => {
    const context = createContext();

    context.loadCategories.mockImplementation(() => {
      context.store.categories.isLoading = true;

      return new Promise<void>(() => {});
    });

    const main = await context.library.render();

    expect(main.querySelectorAll('.category-skeleton')).toHaveLength(1);
  });

  it('shows empty states when there are no games or categories', async () => {
    const context = createContext();

    context.loadGames.mockImplementation(async () => {
      context.store.games.data = { data: [], meta: { page: 1, totalPages: 1 } } as never;
    });
    context.loadCategories.mockImplementation(async () => {
      context.store.categories.data = { data: [] } as never;
    });

    const { main } = await renderLibrary(context);

    expect(main.querySelector(':scope .game-cards .empty-state')).not.toBeNull();
    expect(main.querySelector(':scope .library-categories .empty-state')).not.toBeNull();
  });
});

describe('LibraryPage url state', () => {
  it('loads the page, category and sort given in the url', async () => {
    globalThis.history.replaceState({}, '', '/library?category=puzzle&sort=name-asc&page=2');

    const { loadGames, main } = await renderLibrary();

    expect(loadGames).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 6, category: 'puzzle', sort: 'name-asc' }),
    );
    expect(main.querySelector('[data-category="puzzle"]')?.classList.contains('active')).toBe(true);
    expect(main.querySelector('.library-sort__btn')?.textContent).toBe('Sort by: Name A→Z');
  });

  it('falls back to defaults for unknown url values', async () => {
    globalThis.history.replaceState({}, '', '/library?category=nonsense&sort=bad');

    const { loadGames } = await renderLibrary();

    expect(loadGames).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, category: 'all', sort: 'rating-desc' }),
    );
  });
});

describe('LibraryPage category and sort', () => {
  it('loads the first page of the chosen category and updates the url', async () => {
    const { main, loadGames } = await renderLibrary();

    main.querySelector<HTMLButtonElement>('[data-category="puzzle"]')?.click();
    await flush();

    expect(loadGames.mock.lastCall?.[0]).toMatchObject({ category: 'puzzle', page: 1 });
    expect(main.querySelector('[data-category="puzzle"]')?.classList.contains('active')).toBe(true);
    expect(main.querySelector('[data-category="all"]')?.classList.contains('active')).toBe(false);
    expect(urlParameter('category')).toBe('puzzle');
  });

  it('ignores clicks that are not on a category button', async () => {
    const { main, loadGames } = await renderLibrary();
    const callsBefore = loadGames.mock.calls.length;

    main.querySelector<HTMLElement>('.library-categories')?.click();
    await flush();

    expect(loadGames.mock.calls).toHaveLength(callsBefore);
  });

  it('shows an error when loading a category fails', async () => {
    const { main, store, loadGames } = await renderLibrary();

    loadGames.mockImplementationOnce(async () => {
      store.games.error = 'Failed to load games';
    });
    main.querySelector<HTMLButtonElement>('[data-category="puzzle"]')?.click();
    await flush();

    expect(show).toHaveBeenCalledWith('Failed to load games', 'error');
  });

  it('opens and closes the sort menu', async () => {
    const { main } = await renderLibrary();
    const sort = main.querySelector('.library-sort');

    main.querySelector<HTMLButtonElement>('.library-sort__btn')?.click();
    expect(sort?.classList.contains('is-open')).toBe(true);

    main.querySelector<HTMLButtonElement>('.library-sort__btn')?.click();
    expect(sort?.classList.contains('is-open')).toBe(false);
  });

  it('applies the chosen sort option', async () => {
    const { main, loadGames } = await renderLibrary();
    const sort = main.querySelector('.library-sort');

    main.querySelector<HTMLButtonElement>('.library-sort__btn')?.click();
    main.querySelector<HTMLButtonElement>('[data-sort="name-asc"]')?.click();
    await flush();

    expect(main.querySelector('.library-sort__btn')?.textContent).toBe('Sort by: Name A→Z');
    expect(sort?.classList.contains('is-open')).toBe(false);
    expect(main.querySelector('[data-sort="name-asc"]')?.classList.contains('active')).toBe(true);
    expect(main.querySelector('[data-sort="rating-desc"]')?.classList.contains('active')).toBe(
      false,
    );
    expect(loadGames.mock.lastCall?.[0]).toMatchObject({ sort: 'name-asc', page: 1 });
    expect(urlParameter('sort')).toBe('name-asc');
  });

  it('shows an error when loading a sorted list fails', async () => {
    const { main, store, loadGames } = await renderLibrary();

    loadGames.mockImplementationOnce(async () => {
      store.games.error = 'Failed to load games';
    });
    main.querySelector<HTMLButtonElement>('[data-sort="name-desc"]')?.click();
    await flush();

    expect(show).toHaveBeenCalledWith('Failed to load games', 'error');
  });
});

describe('LibraryPage pagination', () => {
  it('shows a window of page buttons around the current page', async () => {
    const context = createContext();

    usePagination(context, 2, 5);

    const { main } = await renderLibrary(context);

    expect(pageNumbers(main)).toEqual(['1', '2', '3', '4']);
    expect(main.querySelector('.library-pagination__page.active')?.textContent).toBe('2');
    expect(arrow(main, 'prev')?.disabled).toBe(false);
    expect(arrow(main, 'next')?.disabled).toBe(false);
  });

  it('disables the previous arrow on the first page', async () => {
    const context = createContext();

    usePagination(context, 1, 5);

    const { main } = await renderLibrary(context);

    expect(arrow(main, 'prev')?.disabled).toBe(true);
    expect(arrow(main, 'next')?.disabled).toBe(false);
  });

  it('disables the next arrow on the last page', async () => {
    const context = createContext();

    usePagination(context, 5, 5);

    const { main } = await renderLibrary(context);

    expect(pageNumbers(main)).toEqual(['2', '3', '4', '5']);
    expect(arrow(main, 'next')?.disabled).toBe(true);
  });

  it('shows one page and disables both arrows without pagination data', async () => {
    const context = createContext();

    context.loadGames.mockImplementation(async () => {
      context.store.games.data = { data: games } as never;
    });

    const { main } = await renderLibrary(context);

    expect(pageNumbers(main)).toEqual(['1']);
    expect(arrow(main, 'prev')?.disabled).toBe(true);
    expect(arrow(main, 'next')?.disabled).toBe(true);
  });

  it('loads the clicked page and writes it to the url', async () => {
    const context = createContext();

    usePagination(context, 2, 5);

    const { main, loadGames } = await renderLibrary(context);

    main.querySelector<HTMLButtonElement>('[data-page="3"]')?.click();
    await flush();

    expect(loadGames.mock.lastCall?.[0]).toMatchObject({ page: 3 });
    expect(urlParameter('page')).toBe('3');
  });

  it('ignores clicks inside pagination that are not on a page button', async () => {
    const context = createContext();

    usePagination(context, 2, 5);

    const { main, loadGames } = await renderLibrary(context);
    const callsBefore = loadGames.mock.calls.length;

    main.querySelector<HTMLElement>('.library-pagination__pages')?.click();
    await flush();

    expect(loadGames.mock.calls).toHaveLength(callsBefore);
  });

  it('goes to the next and the previous page with the arrows', async () => {
    const context = createContext();

    usePagination(context, 2, 5);

    const { main, loadGames } = await renderLibrary(context);

    arrow(main, 'next')?.click();
    await flush();
    expect(loadGames.mock.lastCall?.[0]).toMatchObject({ page: 3 });
    expect(urlParameter('page')).toBe('3');

    arrow(main, 'prev')?.click();
    await flush();
    expect(loadGames.mock.lastCall?.[0]).toMatchObject({ page: 1 });
    expect(urlParameter('page')).toBeNull();
  });

  it('shows fewer page buttons on narrow screens and updates on resize', async () => {
    const context = createContext();

    usePagination(context, 1, 5);
    setWidth(500);

    const { main } = await renderLibrary(context);

    expect(pageNumbers(main)).toEqual(['1', '2', '3']);

    setWidth(1024);
    globalThis.dispatchEvent(new Event('resize'));

    expect(pageNumbers(main)).toEqual(['1', '2', '3', '4']);
  });
});

describe('LibraryPage errors', () => {
  it('shows an error for games, a snackbar, and recovers on retry', async () => {
    const context = createContext();

    context.loadGames.mockImplementationOnce(async () => {
      context.store.games.data = undefined;
      context.store.games.error = 'Failed to load games';
    });

    const { main } = await renderLibrary(context);

    expect(main.querySelector(':scope .game-cards .error-state')).not.toBeNull();
    expect(show).toHaveBeenCalledWith('Failed to load games', 'error');
    expect(show).toHaveBeenCalledTimes(1);

    main.querySelector<HTMLButtonElement>(':scope .game-cards .error-state__retry')?.click();
    await flush();

    expect(main.querySelector(':scope .game-cards .error-state')).toBeNull();
    expect(main.querySelectorAll('.game-card')).toHaveLength(2);
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('keeps the error and reports it again when the retry fails too', async () => {
    const context = createContext();

    context.loadGames.mockImplementation(async () => {
      context.store.games.error = 'Failed to load games';
    });

    const { main } = await renderLibrary(context);

    main.querySelector<HTMLButtonElement>(':scope .game-cards .error-state__retry')?.click();
    await flush();

    expect(main.querySelector(':scope .game-cards .error-state')).not.toBeNull();
    expect(show).toHaveBeenCalledTimes(2);
  });

  it('shows an error for categories, a snackbar, and recovers on retry', async () => {
    const context = createContext();

    context.loadCategories.mockImplementationOnce(async () => {
      context.store.categories.error = 'Failed to load categories';
    });

    const { main } = await renderLibrary(context);

    expect(main.querySelector(':scope .library-categories .error-state')).not.toBeNull();
    expect(show).toHaveBeenCalledWith('Failed to load categories', 'error');

    main
      .querySelector<HTMLButtonElement>(':scope .library-categories .error-state__retry')
      ?.click();
    await flush();

    expect(main.querySelector(':scope .library-categories .error-state')).toBeNull();
    expect(main.querySelectorAll('.library-category')).toHaveLength(2);
  });

  it('keeps the categories error when the retry fails too', async () => {
    const context = createContext();

    context.loadCategories.mockImplementation(async () => {
      context.store.categories.error = 'Failed to load categories';
    });

    const { main } = await renderLibrary(context);

    main
      .querySelector<HTMLButtonElement>(':scope .library-categories .error-state__retry')
      ?.click();
    await flush();

    expect(main.querySelector(':scope .library-categories .error-state')).not.toBeNull();
    expect(show).toHaveBeenCalledTimes(2);
  });
});
