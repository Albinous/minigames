import {
  CategoriesApi,
  CategoriesService,
  LeaderboardApi,
  LeaderboardService,
  type GamesService,
  type Store,
} from '../core';
import { HomePage, LibraryPage } from '../pages';

export type Route = '/' | '/library';

export class Router {
  private readonly store: Store;
  private readonly gamesService: GamesService;
  private readonly routes: Record<Route, () => Promise<HTMLElement>> = {
    '/': () => {
      const leaderboardService = new LeaderboardService(this.store, new LeaderboardApi());
      return new HomePage(
        this.store,
        this.gamesService,
        leaderboardService,
        this.onDetailsClick,
      ).render();
    },
    '/library': () => {
      const categoriesService = new CategoriesService(this.store, new CategoriesApi());
      return new LibraryPage(
        this.store,
        this.gamesService,
        categoriesService,
        this.onDetailsClick,
      ).render();
    },
  };

  private readonly onRouteChange: (page: HTMLElement, route: Route) => void;
  private readonly onDetailsClick: (slug: string) => void;
  private readonly onGameChange: () => void;
  private readonly onAuthChange: () => void;

  constructor(
    store: Store,
    gamesService: GamesService,
    onDetailsClick: (slug: string) => void,
    onRouteChange: (page: HTMLElement, route: Route) => void,
    onGameChange: () => void,
    onAuthChange: () => void,
  ) {
    this.store = store;
    this.gamesService = gamesService;
    this.onRouteChange = onRouteChange;
    this.onDetailsClick = onDetailsClick;
    this.onGameChange = onGameChange;
    this.onAuthChange = onAuthChange;

    globalThis.addEventListener('popstate', () => {
      this.renderCurrentPage();
      this.onGameChange();
      this.onGameChange();
      this.onAuthChange();
    });
  }

  private createPage(route: Route): Promise<HTMLElement> {
    return this.routes[route]();
  }

  private getCurrentRoute(): Route {
    const { pathname } = globalThis.location;

    if (pathname === '/library') {
      return '/library';
    }

    return '/';
  }

  private async renderCurrentPage(): Promise<void> {
    const route = this.getCurrentRoute();
    const page = await this.createPage(route);

    this.onRouteChange(page, route);
  }

  public async render(): Promise<HTMLElement> {
    const route = this.getCurrentRoute();

    return await this.createPage(route);
  }

  public navigate(route: Route): void {
    if (globalThis.location.pathname === route && globalThis.location.search === '') return;

    globalThis.history.pushState({}, '', route);

    this.renderCurrentPage();
  }
}
