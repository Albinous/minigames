import { getHomePageView } from "./home-page.view";

export class HomePage {
  public render(): HTMLElement {
    const main: HTMLElement = document.createElement('main');

    main.className = 'main';
    main.innerHTML = getHomePageView();

    return main;
  }
}