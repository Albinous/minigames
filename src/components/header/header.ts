import { getHeaderView } from "./header.view";

export class Header {
  public render(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = getHeaderView();

    return header;
  }
}