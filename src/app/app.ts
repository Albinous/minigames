import { Header, Footer } from '../components';
import { Router } from './router';
import { AuthDialog } from '../components/dialogs/auth/auth-dialog';

export class App {
  public render(): void {
    const authDialog = new AuthDialog();
    const header = new Header(
      (mode) => {
        authDialog.open(mode);
      },
      (route) => {
        router.navigate(route);
      },
    );
    const router = new Router((page, route) => {
      const currentPage = document.querySelector('main');

      currentPage?.replaceWith(page);
      header.setActiveRoute(route);
    });
    const footer = new Footer();

    document.body.prepend(header.render(), router.render(), footer.render(), authDialog.render());
  }
}
