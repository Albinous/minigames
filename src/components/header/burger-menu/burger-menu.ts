import { getBurgerMenuView } from './burger-menu.view';
import './burger-menu.scss';

export class BurgerMenu {
  private menu: HTMLElement;

  constructor() {
    this.menu = document.createElement('aside');

    this.menu.className = 'burger-menu';
    this.menu.innerHTML = getBurgerMenuView();
  }

  public render(): HTMLElement {
    return this.menu;
  }
}