import { Header, Footer } from '../components';
import { Router } from './router';
import { AuthDialog } from '../components/dialogs/auth/auth-dialog';
import { GameDialog } from '../components/dialogs/game/game-dialog';
import { GamesApi, GamesService, Store } from '../core';

export class App {
  public async render(): Promise<void> {
    const store = new Store();
    const gamesApi = new GamesApi()
    const gamesService = new GamesService(store, gamesApi);
    const authDialog = new AuthDialog();
    const header = new Header(
      (mode) => {
        authDialog.open(mode);
      },
      (route) => {
        router.navigate(route);
      },
    );
    const gameDialog = new GameDialog();
    const router = new Router(
      store,
      gamesService,
      () => {
        gameDialog.open();
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
