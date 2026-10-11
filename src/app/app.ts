import { Header, Footer, Snackbar, AuthDialog, GameDialog } from '../components';
import { Router } from './router';
import {
  AuthService,
  CommentsApi,
  CommentsService,
  GamesApi,
  GamesService,
  SessionService,
  Store,
} from '../core';
import { removeAuthFromUrl, updateUrl, updateUrlAuth } from '../shared/utils/update-url';

export class App {
  private readonly store: Store;
  private readonly snackbar: Snackbar;
  private readonly sessionService: SessionService;
  private readonly authDialog: AuthDialog;

  constructor() {
    const authService = new AuthService();

    this.store = new Store();
    this.snackbar = new Snackbar();
    this.sessionService = new SessionService(this.store, authService, () => {
      this.snackbar.show('Your session has expired. Please log in again', 'error');
    });
    this.authDialog = new AuthDialog(authService, this.snackbar, (user) => {
      this.sessionService.start(user);
    });
  }

  private canOpenAuth(): boolean {
    const isAuthenticated = this.sessionService.checkExpiration();

    if (!isAuthenticated) return true;

    removeAuthFromUrl();
    this.snackbar.show('You are already logged in', 'error');

    return false;
  }

  private syncAuthWithUrl(): void {
    const auth = new URLSearchParams(globalThis.location.search).get('auth');

    if (auth !== 'login' && auth !== 'register') {
      this.authDialog.close(false);
      return;
    }

    if (!this.canOpenAuth()) {
      this.authDialog.close(false);
      return;
    }

    this.authDialog.open(auth);
  }

  private logout(): void {
    void this.sessionService.end().then((isSignedOut) => {
      if (!isSignedOut) {
        this.snackbar.show(
          'Could not complete sign out, but you are now logged out on this device',
          'error',
        );
      }
    });
  }

  private bindTabEvents(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.sessionService.checkExpiration();
      }
    });
  }

  public async render(): Promise<void> {
    const gamesApi = new GamesApi();
    const gamesService = new GamesService(this.store, gamesApi);
    const commentsApi = new CommentsApi();
    const commentsService = new CommentsService(this.store, commentsApi);

    const header = new Header(
      this.store,
      (mode) => {
        if (!this.canOpenAuth()) return;

        updateUrlAuth(globalThis.location.pathname, mode);
        this.authDialog.open(mode);
      },
      (route) => {
        this.sessionService.checkExpiration();
        router.navigate(route);
      },
      () => {
        this.logout();
      },
    );

    const gameDialog = new GameDialog(this.store, gamesService, commentsService);

    const router = new Router(
      this.store,
      gamesService,
      (slug: string) => {
        this.sessionService.checkExpiration();
        updateUrl({ game: slug });

        void gameDialog.open(slug);
      },
      (page, route) => {
        const currentPage = document.querySelector('main');

        currentPage?.replaceWith(page);
        if (route) {
          header.setActiveRoute(route);
        }
      },
      () => {
        this.sessionService.checkExpiration();
        const parameters = new URLSearchParams(globalThis.location.search);
        const game = parameters.get('game');

        if (game) {
          void gameDialog.open(game);
        } else {
          gameDialog.close(false);
        }
      },
      () => {
        this.syncAuthWithUrl();
      },
    );

    const footer = new Footer();

    this.sessionService.restore();

    document.body.prepend(
      header.render(),
      await router.render(),
      footer.render(),
      this.authDialog.render(),
      gameDialog.element,
    );

    this.bindTabEvents();

    this.syncAuthWithUrl();
  }
}
