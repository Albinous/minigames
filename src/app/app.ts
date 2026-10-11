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
      (mode) => {
        updateUrlAuth(globalThis.location.pathname, mode);
        authDialog.open(mode);
      },
      (route) => {
        router.navigate(route);
        sessionService.checkExpiration();
      },
    );
    const gameDialog = new GameDialog(store, gamesService, commentsService);
    const router = new Router(
      store,
      gamesService,
      (slug: string) => {
        updateUrl({ game: slug });

        void gameDialog.open(slug);
        sessionService.checkExpiration();
      },
      (page, route) => {
        const currentPage = document.querySelector('main');

        currentPage?.replaceWith(page);
        if (route) {
          header.setActiveRoute(route);
        }
      },
      () => {
        const parameters = new URLSearchParams(globalThis.location.search);
        const game = parameters.get('game');

        if (game) {
          void gameDialog.open(game);
        } else {
          gameDialog.close(false);
        }
        sessionService.checkExpiration();
      },
      () => {
        const parameters = new URLSearchParams(globalThis.location.search);
        const auth = parameters.get('auth');

        if (auth === 'login' || auth === 'register') {
          authDialog.open(auth);
        } else {
          authDialog.close(false);
        }
        sessionService.checkExpiration();
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
