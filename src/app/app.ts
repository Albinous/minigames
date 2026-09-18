import { Header, Footer } from '../components';
import { Router } from './router';

export class App {
  public render(): void {
    const header = new Header();
    const router = new Router();
    const footer = new Footer();

    document.body.prepend(header.render(), router.render(), footer.render());
  }
}
