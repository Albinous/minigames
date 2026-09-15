import { Header } from '../components/header/header';
import { Router } from './router';

export class App {

  public render(): void {
    const header = new Header();
    const router = new Router()

    document.body.prepend(header.render(), router.render());
  }
}