import { Header, Footer, Snackbar } from '../components';
import { Router } from './router';
import { AuthDialog } from '../components/dialogs/auth/auth-dialog';
import { GameDialog } from '../components/dialogs/game/game-dialog';
import { AuthService, CommentsApi, CommentsService, GamesApi, GamesService, Store } from '../core';
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
    const authDialog = new AuthDialog(authService, snackbar, (user) => {
      snackbar.show(`Welcome, ${user.displayName ?? user.email ?? 'player'}!`, 'success');
    });
    const header = new Header(
      (mode) => {
        updateUrlAuth(globalThis.location.pathname, mode);
        authDialog.open(mode);
      },
      (route) => {
        router.navigate(route);
      },
    );
    const gameDialog = new GameDialog(store, gamesService, commentsService);
    const router = new Router(
      store,
      gamesService,
      (slug: string) => {
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
        const parameters = new URLSearchParams(globalThis.location.search);
        const game = parameters.get('game');

        if (game) {
          void gameDialog.open(game);
        } else {
          gameDialog.close(false);
        }
      },
      () => {
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

    document.body.prepend(
      header.render(),
      await router.render(),
      footer.render(),
      authDialog.render(),
      gameDialog.element,
    );
  }
}
