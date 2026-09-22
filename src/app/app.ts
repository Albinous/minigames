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
        router.navigate(route)
      }
    );

    const headerElement = header.render();
    
    const router = new Router((page, route) => {
      const currentPage = document.querySelector('main');

      currentPage?.replaceWith(page);
      header.setActiveRoute(route, headerElement);
    });
    const footer = new Footer();

    document.body.prepend(headerElement, router.render(), footer.render(), authDialog.render());
  }
}
