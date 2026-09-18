import { getLogoView } from "./logo.view";

export class Logo {
  public render(): HTMLElement {
    const root: HTMLElement = document.createElement('a');
    root.className = 'logo';

    root.innerHTML = getLogoView();;
    return root;
  }
}