import { HomePage, LibraryPage } from '../pages';

export type Route = '/' | '/library';

export class Router {
  private readonly routes: Record<Route, () => HTMLElement> = {
    '/': () => new HomePage(this.onDetailsClick).render(),
    '/library': () => new LibraryPage(this.onDetailsClick).render(),
  };

  private readonly onRouteChange: (page: HTMLElement, route: Route) => void;
  private readonly onDetailsClick: () => void;

  constructor(
    onDetailsClick: () => void,
    onRouteChange: (page: HTMLElement, route: Route) => void,
  ) {
    this.onRouteChange = onRouteChange;
    this.onDetailsClick = onDetailsClick;

    globalThis.addEventListener('popstate', () => {
      this.renderCurrentPage();
    });
  }

  private createPage(route: Route): HTMLElement {
    return this.routes[route]();
  }

  private getCurrentRoute(): Route {
    return globalThis.location.pathname === '/library' ? '/library' : '/';
  }

  private renderCurrentPage(): void {
    const route = this.getCurrentRoute();
    const page = this.createPage(route);

    this.onRouteChange(page, route);
  }

  public render(): HTMLElement {
    const route = this.getCurrentRoute();

    return this.createPage(route);
  }

  public navigate(route: Route): void {
    if (globalThis.location.pathname === route) return;

    globalThis.history.pushState({}, '', route);

    this.renderCurrentPage();
  }
}
