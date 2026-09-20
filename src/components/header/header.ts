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

  private bindMenuEvents(header: HTMLElement): void {
    const burgerButton = header.querySelector('.header-burger');

    burgerButton?.addEventListener('click', () => {
      this.openMenu(header);
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
