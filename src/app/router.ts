import { HomePage, LibraryPage } from '../pages';

export type Route = '/' | '/library';

export class Router {
  private readonly routes: Record<Route, () => HTMLElement> = {
    '/': () => new HomePage().render(),
    '/library': () => new LibraryPage().render(),
  };

  private readonly onRouteChange: (page: HTMLElement, route: Route) => void;

  constructor(onRouteChange: (page: HTMLElement, route: Route) => void) {
    this.onRouteChange = onRouteChange;

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
