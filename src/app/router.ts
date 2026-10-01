import type { GamesService, Store } from '../core';
import { HomePage, LibraryPage } from '../pages';

export type Route = '/' | '/library';

export class Router {
  private readonly store: Store;
  private readonly gamesService: GamesService;
  private readonly routes: Record<Route, () => Promise<HTMLElement>> = {
    '/': () => new HomePage(this.onDetailsClick).render(),
    '/library': () => new LibraryPage(this.store, this.gamesService, this.onDetailsClick).render(),
  };

  private readonly onRouteChange: (page: HTMLElement, route: Route) => void;
  private readonly onDetailsClick: () => void;

  constructor(
    store: Store,
    gamesService: GamesService,
    onDetailsClick: () => void,
    onRouteChange: (page: HTMLElement, route: Route) => void,
  ) {
    this.store = store;
    this.gamesService = gamesService;
    this.onRouteChange = onRouteChange;
    this.onDetailsClick = onDetailsClick;

    globalThis.addEventListener('popstate', () => {
      this.renderCurrentPage();
    });
  }

  private createPage(route: Route): Promise<HTMLElement> {
    return this.routes[route]();
  }

  private getCurrentRoute(): Route {
    return globalThis.location.pathname === '/library' ? '/library' : '/';
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
    if (globalThis.location.pathname === route) return;

    globalThis.history.pushState({}, '', route);

    this.renderCurrentPage();
  }
}
