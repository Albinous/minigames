import { Logo } from '../logo';
import { getHeaderView } from './header.view';

export class Header {
  public render(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = getHeaderView();

    const headerWrapper = header.querySelector('.header-wrapper');
    const logo = new Logo();

    headerWrapper?.prepend(logo.render());

    return header;
  }
}
