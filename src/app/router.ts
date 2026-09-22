import { HomePage, LibraryPage } from "../pages";

export type Route = '/' | '/library';

export class Router {
  private readonly routes: Record<Route, () => HTMLElement> = {
    '/': () => new HomePage().render(),
    '/library': () => new LibraryPage().render()
  };

  private readonly onRouteChange: (page: HTMLElement) => void;

  constructor(onRouteChange: (page: HTMLElement) => void) {
    this.onRouteChange = onRouteChange;

    globalThis.addEventListener('popstate', () => {
      this.renderCurrentPage();
    })
  }

  private createPage(): HTMLElement {
    const route = this.getCurrentRoute();

    return this.routes[route]();
  }
  
  private getCurrentRoute(): Route {
    return globalThis.location.pathname === '/library' ? '/library' : '/';
  }

  private renderCurrentPage(): void {
    const page = this.createPage();

    this.onRouteChange(page);
  }

    public render(): HTMLElement {
    return this.createPage();
  }

  public navigate(route: Route): void {
    if (globalThis.location.pathname === route) return;

    globalThis.history.pushState({}, '', route);

    this.renderCurrentPage();
  }

}
