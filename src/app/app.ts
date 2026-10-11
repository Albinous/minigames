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
import { updateUrl, updateUrlAuth } from '../shared/utils/update-url';

export class App {
  public async render(): Promise<void> {
    const store = new Store();
    const gamesApi = new GamesApi();
    const gamesService = new GamesService(store, gamesApi);
    const commentsApi = new CommentsApi();
    const commentsService = new CommentsService(store, commentsApi);
    const authService = new AuthService();
    const snackbar = new Snackbar();
    const sessionService = new SessionService(store, authService, () =>
      snackbar.show('Your session has expired. Please log in again', 'error'),
    );
    const authDialog = new AuthDialog(authService, snackbar, (user) => {
      sessionService.start(user);
    });

    const header = new Header(
      store,
      (mode) => {
        updateUrlAuth(globalThis.location.pathname, mode);
        authDialog.open(mode);
      },
      (route) => {
        sessionService.checkExpiration();
        router.navigate(route);
      },
      () => {
        void sessionService.end().then((isSignedOut) => {
          if (!isSignedOut) {
            snackbar.show(
              'Could not complete sign out, but you are now logged out on this device',
              'error',
            );
          }
        });
      },
    );
    const gameDialog = new GameDialog(store, gamesService, commentsService);
    const router = new Router(
      store,
      gamesService,
      (slug: string) => {
        sessionService.checkExpiration();
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
        sessionService.checkExpiration();
        const parameters = new URLSearchParams(globalThis.location.search);
        const game = parameters.get('game');

        if (game) {
          void gameDialog.open(game);
        } else {
          gameDialog.close(false);
        }
      },
      () => {
        sessionService.checkExpiration();
        const parameters = new URLSearchParams(globalThis.location.search);
        const auth = parameters.get('auth');

        if (auth === 'login' || auth === 'register') {
          authDialog.open(auth);
        } else {
          authDialog.close(false);
        }
      },
    );

    const footer = new Footer();

    sessionService.restore();

    document.body.prepend(
      header.render(),
      await router.render(),
      footer.render(),
      authDialog.render(),
      gameDialog.element,
    );

    this.bindTabEvents(sessionService);
  }

  public bindTabEvents(sessionService: SessionService): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        sessionService.checkExpiration();
      }
    });
  }
}
