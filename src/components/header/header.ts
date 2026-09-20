import { Logo } from '../logo';
import { BurgerMenu } from './burger-menu';
import { getHeaderView } from './header.view';

export class Header {
   private readonly burgerMenu: BurgerMenu;

  constructor() {
    this.burgerMenu = new BurgerMenu();
  }
  private addLogo(header: HTMLElement): void {
    const headerWrapper = header.querySelector('.header-wrapper');

    headerWrapper?.prepend(new Logo().render());
  }

  private addBurgerMenu(header: HTMLElement): void {
    header.append(this.burgerMenu.render());
  }

  private bindEvents(header: HTMLElement): void {
    const burgerButton = header.querySelector('.header-burger');

    burgerButton?.addEventListener('click', () => {
      this.burgerMenu.open();
    });
  }

    public render(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = getHeaderView();

    this.addLogo(header);
    this.addBurgerMenu(header);
    this.bindEvents(header);

    return header;
  }
}
