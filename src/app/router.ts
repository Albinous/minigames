import { HomePage } from '../pages/home/home-page';

export class Router {
  public render(): HTMLElement {
    const homePage = new HomePage();

    return homePage.render();
  }
}
