import { Header, Footer } from '../components';
import { Router } from './router';
import { AuthDialog } from '../components/dialogs/auth/auth-dialog';
import { GameDialog } from '../components/dialogs/game/game-dialog';
import { CommentsApi, CommentsService, GamesApi, GamesService, Store } from '../core';

export class App {
  public async render(): Promise<void> {
    const store = new Store();
    const gamesApi = new GamesApi();
    const gamesService = new GamesService(store, gamesApi);
    const commentsApi = new CommentsApi();
    const commentsService = new CommentsService(store, commentsApi);
    const authDialog = new AuthDialog();
    const header = new Header(
      (mode) => {
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
        gameDialog.open(slug);
      },
      (page, route) => {
        const currentPage = document.querySelector('main');

        currentPage?.replaceWith(page);
        header.setActiveRoute(route);
      },
    );
    const footer = new Footer();

    document.body.prepend(
      header.render(),
      await router.render(),
      footer.render(),
      authDialog.render(),
      gameDialog.render(),
    );
  }
}
