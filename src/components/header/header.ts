import { Logo } from '../logo';
import { getHeaderView } from './header.view';

export class Header {
  private addLogo(header: HTMLElement): void {
    const headerWrapper = header.querySelector('.header-wrapper');

    headerWrapper?.prepend(new Logo().render());
  }

  private openMenu(header: HTMLElement): void {
    const burgerButton = header.querySelector('.header-burger');

    header.classList.add('header-menu__open');
    burgerButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  private closeMenu(header: HTMLElement): void {
    const burgerButton = header.querySelector('.header-burger');

    header.classList.remove('header-menu__open');
    burgerButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  private bindMenuEvents(header: HTMLElement): void {
    const burgerButton = header.querySelector('.header-burger');
    const closeButton = header.querySelector('.header-close');

    burgerButton?.addEventListener('click', () => {
      this.openMenu(header);
    });

    closeButton?.addEventListener('click', () => {
      this.closeMenu(header);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeMenu(header);
      }
    });
  }

  public render(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = getHeaderView();

    this.addLogo(header);
    this.bindMenuEvents(header);

    return header;
  }
}
