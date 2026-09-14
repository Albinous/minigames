import { Header } from '../components/header/header';

export class App {

  public render(): void {
    const header = new Header();

    document.body.prepend(header.render());
  }
}