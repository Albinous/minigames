import { createElement } from "../../../shared";

export class GameDetails {

  private dialogElement: HTMLElement | undefined;

  public render(): HTMLElement {
    const root = createElement('div', {
      className: 'game-dialog__root'
    });

    this.dialogElement = root;

    return root;
  }
}