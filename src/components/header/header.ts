import { Logo } from '../logo';
import { BurgerMenu } from './burger-menu';
import { getHeaderView } from './header.view';

export class Header {
  public render(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = getHeaderView();

    const headerWrapper = header.querySelector('.header-wrapper');
    const logo = new Logo();

    headerWrapper?.prepend(logo.render());

    const burgerMenu = new BurgerMenu();

    document.body.append(burgerMenu.render());

    const burgerButton = header.querySelector('.header-burger');

    burgerButton?.addEventListener('click', () => {
      burgerMenu.open();
    });

    return header;
  }
}
