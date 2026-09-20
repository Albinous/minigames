import { getBurgerMenuView } from './burger-menu.view';
import './burger-menu.scss';
import { Logo } from '../../logo';

export class BurgerMenu {
  private menu: HTMLElement;

  constructor() {
    this.menu = document.createElement('aside');

    this.menu.className = 'burger-menu';
    this.menu.innerHTML = getBurgerMenuView();

    this.bindEvents();
  }

  public render(): HTMLElement {
    const logoPlaceholder = this.menu.querySelector('.burger-menu__logo');
    const logo = new Logo;
    logoPlaceholder?.append(logo.render());
    return this.menu;
  }

  public open(): void {
    this.menu.classList.add('burger-menu-open');
    document.body.classList.add('menu-open');
  }

  public close(): void {
    this.menu.classList.remove('burger-menu-open');
    document.body.classList.remove('menu-open');
  }

  public bindEvents(): void {
    const closeButton = this.menu.querySelector('.burger-menu__close');

    closeButton?.addEventListener('click', () => {
      this.close();
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }
}