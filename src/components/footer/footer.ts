import { Logo } from "../logo";
import { getFooterView } from "./footer.view";

export class Footer {
  public render(): HTMLElement {
    const footer: HTMLElement = document.createElement('footer');
    footer.className = 'footer';

    footer.innerHTML = getFooterView();

    const footerLeftWrapper = footer.querySelector('.footer-left');
    const logo = new Logo();

    footerLeftWrapper?.prepend(logo.render())

    return footer;
  }
}