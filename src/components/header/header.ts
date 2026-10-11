import { Logo } from '../logo';
import { getGuestControlView, getHeaderView } from './header.view';
import type { AuthMode } from '../dialogs/auth/auth-dialog.types';
import type { Route } from '../../app/router';
import type { Store } from '../../core';
import { createContainer, createElement, getInitials, iconToSvg } from '../../shared';
import { personIcon } from '../../assets/icons';

export class Header {
  private element: HTMLElement | undefined;
  private readonly store: Store;
  private readonly onAuthOpen: (mode: AuthMode) => void;
  private readonly onNavigate: (route: Route) => void;
  private readonly onLogout: () => void;

  constructor(
    store: Store,
    onAuthOpen: (mode: AuthMode) => void,
    onNavigate: (route: Route) => void,
    onLogout: () => void,
  ) {
    this.store = store;
    this.onAuthOpen = onAuthOpen;
    this.onNavigate = onNavigate;
    this.onLogout = onLogout;
  }

  private addLogo(header: HTMLElement): void {
    const headerWrapper = header.querySelector('.header-wrapper');

    headerWrapper?.prepend(new Logo().render());
  }

  private renderAuth(header: HTMLElement): void {
    const container = header.querySelector('.header-auth');
    if (!container) return;

    const session = this.store.session;

    if (session) {
      const { displayName, avatarUrl } = session;
      const profile = this.createProfile(displayName, avatarUrl);
      const logOutButton = this.createLogOutButton();
      container.replaceChildren(profile, logOutButton);
    } else {
      container.innerHTML = getGuestControlView();
    }
  }

  private createProfile(displayName: string, avatarUrl: string | undefined): HTMLElement {
    const container = createContainer('header-profile');

    const username = createElement('span', {
      className: 'header-profile__name',
      text: displayName,
    });

    const avatar = this.createAvatar(avatarUrl, displayName);

    container.append(username, avatar);

    return container;
  }

  private createAvatar(avatarUrl: string | undefined, name: string): HTMLElement {
    const container = createContainer('header-profile__avatar');
    const showFallback = (): void => {
      const initials = getInitials(name);

      container.replaceChildren();

      if (initials) {
        container.textContent = initials;
      } else {
        iconToSvg(personIcon, container);
      }
    };

    if (!avatarUrl) {
      showFallback();
      return container;
    }

    const avatarImg = createElement('img', {
      className: 'header-profile__avatar-img',
      attributes: {
        alt: '',
        referrerpolicy: 'no-referrer',
      },
    });
    avatarImg.addEventListener('error', showFallback, { once: true });
    avatarImg.src = avatarUrl;

    container.append(avatarImg);

    return container;
  }

  private createLogOutButton(): HTMLButtonElement {
    const logOutButton = createElement('button', {
      className: 'btn header-btn header-btn__logout',
      text: 'Log Out',
      attributes: {
        'data-action': 'logout',
        type: 'button',
      },
    });

    return logOutButton;
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
    const container = header.querySelector('.header-auth');
    if (!container) return;

    container.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest('[data-action="logout"]')) {
        this.closeMenu(header);
        this.onLogout();
        return;
      }

      const authButton = event.target.closest<HTMLButtonElement>('[data-mode]');
      if (!authButton) return;

      const authMode = authButton.dataset.mode;

      if (!authMode || !this.isAuthMode(authMode)) return;

      this.onAuthOpen(authMode);
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
    });
  }

  private isAuthMode(value: string): value is AuthMode {
    return ['login', 'register'].includes(value);
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
    this.renderAuth(header);

    this.bindMenuEvents(header);
    this.bindAuthButtons(header);
    this.bindNavLinks(header);

    this.setActiveRoute(globalThis.location.pathname === '/library' ? '/library' : '/');

    this.store.subscribe(() => {
      this.renderAuth(header);
    });

    return header;
  }
}
