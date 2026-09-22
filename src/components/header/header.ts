import { Logo } from '../logo';
import { getHeaderView } from './header.view';
import type { AuthMode } from '../dialogs/auth/auth-dialog.types';
import type { Route } from '../../app/router';

export class Header {
  private element: HTMLElement | undefined;
  private readonly onAuthOpen: (mode: AuthMode) => void;
  private readonly onNavigate: (route: Route) => void;

  constructor(
    onAuthOpen: (mode: AuthMode) => void,
    onNavigate: (route: Route) => void) {
    this.onAuthOpen = onAuthOpen;
    this.onNavigate = onNavigate;
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
    const loginButton = header.querySelector('.header-btn__login');

    const signupButton = header.querySelector('.header-btn__signup');

    loginButton?.addEventListener('click', () => {
      this.onAuthOpen('login');
    });

    signupButton?.addEventListener('click', () => {
      this.onAuthOpen('register');
    });
  }

  private bindNavLinks(header: HTMLElement): void {
    const links = header.querySelector('.nav-menu');

    links?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest<HTMLAnchorElement>('[data-route]');

      if (!link) return;

      event.preventDefault();

      const route = link.dataset.route as Route;

      this.onNavigate(route);
      this.setActiveRoute(route);
    })
  }

  public setActiveRoute(route: Route) {
    if (!this.element) return;
    const links = this.element.querySelectorAll<HTMLAnchorElement>('[data-route]');

    for (const link of links) {
      link.classList.toggle('active', link.dataset.route === route);
    }
  }

  public render(): HTMLElement {
    const header = document.createElement('header');
    this.element = header;

    header.className = 'header';
    header.innerHTML = getHeaderView();

    this.addLogo(header);
    this.bindMenuEvents(header);
    this.bindAuthButtons(header);
    this.bindNavLinks(header);

    this.setActiveRoute(
      globalThis.location.pathname === '/library' ? '/library' : '/',
  );

    return header;
  }
}
