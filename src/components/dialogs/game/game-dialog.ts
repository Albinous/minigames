import { createContainer, createElement } from '../../../shared';
import type { IGameDetails } from '../../../core/services/models/game-details';
import closeIconImg from '../../../assets/icons/close.svg';
import gameDetailsData from '../../../data/game-tukoni-forest-keepers.json';

export class GameDialog {
  private dialogElement: HTMLDialogElement | undefined;
  private readonly game: IGameDetails = gameDetailsData.data;

  private createHero(): HTMLElement {
    const container = createContainer('game-dialog__hero');
    const img = createElement('img', {
      className: 'game-dialog__img',
      attributes: {
        src: this.game.heroImage,
        alt: this.game.name,
      },
    });
    const closeButton = createElement('button', {
      className: 'game-dialog__close',
      attributes: {
        type: 'button',
        'aria-label': 'Close',
      },
    });

    const closeIcon = createElement('img', {
      className: 'game-dialog__close-icon',
      attributes: {
        src: closeIconImg,
        alt: 'close',
      },
    });

    closeButton.append(closeIcon);
    container.append(img, closeButton);

    return container;
  }

  private createInfo(): HTMLElement {
    const container = createContainer('game-dialog__info');
    const title = createElement('h3', {
      className: 'game-dialog__title',
      text: this.game.name,
    });
    const text = createElement('p', {
      className: 'game-dialog__descr',
      text: this.game.fullDescription,
    });
    const specs = this.createSpecs();

    container.append(title, text, specs);

    return container;
  }

  private createSpecs(): HTMLElement {
    const container = createContainer('.game-dialog__specs');
    const specData = this.game.specs;

    for (const [key, value] of Object.entries(specData)) {
      const specElement = this.createSpec(key, value);

      container.append(specElement);
    }

    return container;
  }

  private createSpec(type: string, value: string): HTMLElement {
    const spec = createContainer('game-dialog__spec');
    const specType = createElement('span', {
      className: 'game-dialog__spec-type',
      text: type,
    });
    const specValue = createElement('h4', {
      className: 'game-dialog__spec-value',
      text: value,
    });
    spec.append(specType, specValue);

    return spec;
  }

  public open(): void {
    if (!this.dialogElement) return;
    this.dialogElement.showModal();
  }

  public render(): HTMLDialogElement {
    const root = createElement('dialog', {
      className: 'game-dialog',
    });

    this.dialogElement = root;

    const hero = this.createHero();
    const info = this.createInfo();

    root.append(hero, info);

    return root;
  }
}
