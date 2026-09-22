import { getLibraryPageView } from './library-page.view';

export class LibraryPage {
  public render(): HTMLElement {
    const main = document.createElement('main');
    main.className = 'main';

    main.innerHTML = getLibraryPageView();

    return main;
  }
}
