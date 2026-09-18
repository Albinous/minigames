import { getFooterView } from "./footer.view";

export class Footer {
  public render(): HTMLElement {
    const footer: HTMLElement = document.createElement('footer');
    footer.className = 'footer';

    footer.innerHTML = getFooterView();
    return footer;
  }
}