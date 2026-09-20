import { Logo } from '../logo';
import { getHeaderView } from './header.view';
import type { AuthMode } from '../dialogs/auth/auth-dialog.types';

export class Header {
  private readonly onAuthOpen: (mode: AuthMode) => void;
  
  constructor(onAuthOpen: (mode: AuthMode) => void) {
    this.onAuthOpen = onAuthOpen;
  }

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

  private bindAuthButtons(header: HTMLElement): void {
    const loginButton = header.querySelector(
      '.header-btn__login',
    );

    const signupButton = header.querySelector(
      '.header-btn__signup',
    );

    loginButton?.addEventListener('click', () => {
      this.onAuthOpen('login');
    });

    signupButton?.addEventListener('click', () => {
      this.onAuthOpen('register');
    });

    loginButton?.addEventListener('click', () => {
  console.log('LOGIN CLICK');
  this.onAuthOpen('login');
});
  }

  public render(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = getHeaderView();

    this.addLogo(header);
    this.bindMenuEvents(header);
    this.bindAuthButtons(header);

    return header;
  }
}
