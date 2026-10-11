import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GamesService } from '../core';
import { Store } from '../core/state';
import { Router } from './router';

const { created } = vi.hoisted(() => ({
  created: {
    home: [] as unknown[][],
    library: [] as unknown[][],
    leaderboardService: [] as unknown[][],
    categoriesService: [] as unknown[][],
  },
}));

vi.mock('../core', () => ({
  CategoriesApi: class CategoriesApi {},
  LeaderboardApi: class LeaderboardApi {},
  CategoriesService: class CategoriesService {
    public constructor(...arguments_: unknown[]) {
      created.categoriesService.push(arguments_);
    }
  },
  LeaderboardService: class LeaderboardService {
    public constructor(...arguments_: unknown[]) {
      created.leaderboardService.push(arguments_);
    }
  },
}));

vi.mock('../pages', () => ({
  HomePage: class HomePage {
    public constructor(...arguments_: unknown[]) {
      created.home.push(arguments_);
    }

    public async render(): Promise<HTMLElement> {
      const element = document.createElement('main');

      element.className = 'home-page';

      return element;
    }
  },
  LibraryPage: class LibraryPage {
    public constructor(...arguments_: unknown[]) {
      created.library.push(arguments_);
    }

    public async render(): Promise<HTMLElement> {
      const element = document.createElement('main');

      element.className = 'library-page';

      return element;
    }
  },
  NotFound: class NotFound {
    public render(onBack: () => void): HTMLElement {
      const element = document.createElement('main');
      const button = document.createElement('button');

      element.className = 'not-found';
      button.className = 'not-found__back';
      button.addEventListener('click', onBack);
      element.append(button);

      return element;
    }
  },
}));

const createRouter = () => {
  const store = new Store();
  const gamesService = {} as unknown as GamesService;
  const onDetailsClick = vi.fn();
  const onRouteChange = vi.fn();
  const onGameChange = vi.fn();
  const onAuthChange = vi.fn();
  const router = new Router(
    store,
    gamesService,
    onDetailsClick,
    onRouteChange,
    onGameChange,
    onAuthChange,
  );

  return { store, gamesService, onDetailsClick, onRouteChange, onGameChange, onAuthChange, router };
};

const setUrl = (url: string): void => {
  globalThis.history.replaceState({}, '', url);
};

const lastPage = (onRouteChange: ReturnType<typeof vi.fn>): HTMLElement | undefined =>
  onRouteChange.mock.lastCall?.[0] as HTMLElement | undefined;

beforeEach(() => {
  setUrl('/');
});

describe('Router render', () => {
  it('renders the home page for the root path and passes its dependencies', async () => {
    const { store, gamesService, onDetailsClick, router } = createRouter();
    const page = await router.render();
    const [homeStore, homeGames, homeLeaderboard, homeDetails] = created.home.at(-1) ?? [];

    expect(page.className).toBe('home-page');
    expect(homeStore).toBe(store);
    expect(homeGames).toBe(gamesService);
    expect(homeLeaderboard).toBeDefined();
    expect(homeDetails).toBe(onDetailsClick);
    expect(created.leaderboardService.at(-1)?.[0]).toBe(store);
  });

  it('renders the library page and passes its dependencies', async () => {
    setUrl('/library');

    const { store, gamesService, onDetailsClick, router } = createRouter();
    const page = await router.render();
    const [libraryStore, libraryGames, libraryCategories, libraryDetails] =
      created.library.at(-1) ?? [];

    expect(page.className).toBe('library-page');
    expect(libraryStore).toBe(store);
    expect(libraryGames).toBe(gamesService);
    expect(libraryCategories).toBeDefined();
    expect(libraryDetails).toBe(onDetailsClick);
    expect(created.categoriesService.at(-1)?.[0]).toBe(store);
  });

  it('renders the not found page for an unknown path', async () => {
    setUrl('/nope');

    const page = await createRouter().router.render();

    expect(page.className).toBe('not-found');
  });

  it('leads back to the home page from the not found page', async () => {
    setUrl('/nope');

    const { onRouteChange, router } = createRouter();
    const page = await router.render();

    page.querySelector<HTMLButtonElement>('.not-found__back')?.click();
    await vi.waitFor(() => {
      expect(onRouteChange).toHaveBeenCalledWith(expect.anything(), '/');
    });

    expect(globalThis.location.pathname).toBe('/');
    expect(lastPage(onRouteChange)?.className).toBe('home-page');
  });
});

describe('Router navigate', () => {
  it('changes the url and reports the new page', async () => {
    const { onRouteChange, router } = createRouter();
    const historyLength = globalThis.history.length;

    router.navigate('/library');
    await vi.waitFor(() => {
      expect(onRouteChange).toHaveBeenCalledTimes(1);
    });

    expect(globalThis.location.pathname).toBe('/library');
    expect(globalThis.history.length).toBe(historyLength + 1);
    expect(onRouteChange).toHaveBeenCalledWith(expect.anything(), '/library');
    expect(lastPage(onRouteChange)?.className).toBe('library-page');
  });

  it('does nothing when the route is already shown without parameters', () => {
    const { onRouteChange, router } = createRouter();
    const historyLength = globalThis.history.length;

    router.navigate('/');

    expect(onRouteChange).not.toHaveBeenCalled();
    expect(globalThis.history.length).toBe(historyLength);
  });

  it('drops the parameters when navigating to the same route that has them', async () => {
    setUrl('/library?page=2');

    const { onRouteChange, router } = createRouter();

    router.navigate('/library');
    await vi.waitFor(() => {
      expect(onRouteChange).toHaveBeenCalledTimes(1);
    });

    expect(globalThis.location.search).toBe('');
  });
});

describe('Router history navigation', () => {
  it('renders the page and then reports game and auth changes', async () => {
    setUrl('/library');

    const { onRouteChange, onGameChange, onAuthChange } = createRouter();

    globalThis.dispatchEvent(new PopStateEvent('popstate'));
    await vi.waitFor(() => {
      expect(onAuthChange).toHaveBeenCalledTimes(1);
    });

    expect(onRouteChange).toHaveBeenCalledWith(expect.anything(), '/library');
    expect(onGameChange).toHaveBeenCalledTimes(1);
    expect(onRouteChange.mock.invocationCallOrder[0]).toBeLessThan(
      onGameChange.mock.invocationCallOrder[0],
    );
    expect(onGameChange.mock.invocationCallOrder[0]).toBeLessThan(
      onAuthChange.mock.invocationCallOrder[0],
    );
  });

  it('reports an unknown route without a route name', async () => {
    setUrl('/missing');

    const { onRouteChange, onAuthChange } = createRouter();

    globalThis.dispatchEvent(new PopStateEvent('popstate'));
    await vi.waitFor(() => {
      expect(onAuthChange).toHaveBeenCalledTimes(1);
    });

    expect(onRouteChange).toHaveBeenCalledWith(expect.anything(), undefined);
    expect(lastPage(onRouteChange)?.className).toBe('not-found');
  });
});
