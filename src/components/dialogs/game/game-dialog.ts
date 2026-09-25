import { createContainer, createElement, formatRelativeDate } from '../../../shared';
import type {
  IGameDetails,
  IGameSpecs,
  ITopRecord,
  IComment
} from '../../../core';
import {
  closeIconImg,
  likeIconImg,
  sendIconImg,
} from '../../../assets/icons';
import { gameDetailsData, commentsData} from '../../../data';

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
    const title = createElement('h2', {
      className: 'game-dialog__title',
      text: this.game.name,
    });
    const text = createElement('p', {
      className: 'game-dialog__descr',
      text: this.game.fullDescription,
    });
    const specs = this.createSpecs();
    const buttons = this.createDialogButtons();
    const topRecords = this.createTopRecords();
    const comments = this.createComments();

    container.append(title, text, specs, buttons, topRecords, comments);

    return container;
  }

  private createSpecs(): HTMLElement {
    const container = createContainer('.game-dialog__specs');
    const specData: IGameSpecs = this.game.specs;

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

  private createDialogButtons(): HTMLElement {
    const container = createContainer('game-dialog__btns');
    const playNow = this.createDialogBtn('play', 'primary', 'Play Now');
    const addFavourites = this.createDialogBtn('favourite', 'secondary', 'Add to Favourites');

    container.append(playNow, addFavourites);

    return container;
  }

  private createDialogBtn(className: string, buttonType: string, text: string): HTMLButtonElement {
    const button = createElement('button', {
      className: `btn btn-${buttonType} game-dialog__btn game-dialog__btn-${className}`,
      text,
      attributes: {
        type: 'button',
        'aria-label': `${text}`,
      },
    });

    return button;
  }

  private createTopRecords(): HTMLElement {
    const container = createContainer('game-dialog__records');
    const header = this.createTopRecordsTitle();
    const records = createContainer('game-dialog__records-list');
    const recordsData = this.game.topRecords;

    for (const record of recordsData) {
      records.append(this.createTopRecordItem(record));
    }

    container.append(header, records);

    return container;
  }

  private createTopRecordsTitle(): HTMLElement {
    const container = createContainer('game-dialog__records-header');
    const emoji = createElement('span', {
      className: 'game-dialog__records-emoji',
      text: '🏆',
    });
    const title = createElement('h3', {
      className: 'game-dialog__records-title',
      text: 'Top Records',
    });

    container.append(emoji, title);

    return container;
  }

  private createTopRecordItem(record: ITopRecord): HTMLElement {
    const container = createContainer('game-dialog__record');
    let topRecordItem;

    for (const [key, value] of Object.entries(record)) {
      if (key === 'position') {
        topRecordItem = this.getTopRecordSpan(key, this.getPositionIcon(value));
      } else if (key === 'achievedAt') {
        topRecordItem = this.getTopRecordSpan('date', formatRelativeDate(value));
      } else {
        topRecordItem = this.getTopRecordSpan(key, value);
      }

      container.append(topRecordItem);
    }

    return container;
  }

  private createComments(): HTMLElement {
    const container = createContainer('game-dialog__comments');

    const comments = commentsData.data;
    const title = createElement('h3', {
      className: 'game-dialog__comments-title',
      text: `Comments(${comments.length})`,
    });
    const form = this.createCommentInput();

    container.append(title, form);

    for (const comment of comments) {
      container.append(this.createCommentItem(comment));
    }

    return container;
  }

  private createCommentInput(): HTMLFormElement {
    const form = createElement('form', {
      className: 'game-dialog__comments-form',
    });
    const author = createElement('div', {
      className: 'game-dialog__comments-avatar',
      text: 'U',
    });
    const textarea = createElement('textarea', {
      className: 'game-dialog__comments-textarea',
      attributes: {
        placeholder: 'Write a comment...',
      },
    });
    const sendButton = createElement('button', {
      className: 'game-dialog__comments-send',
      attributes: {
        type: 'submit',
      },
    });
    const sendIcon = createElement('img', {
      className: 'game-dialog__comments-icon',
      attributes: {
        src: sendIconImg,
      },
    });

    sendButton.append(sendIcon);

    form.append(author, textarea, sendButton);

    return form;
  }

  private createCommentItem(comment: IComment) {
    const container = createContainer('game-dialog__comment');
    const header = this.createCommentHeader(comment);
    const text = createElement('p', {
      className: 'game-dialog__comment-text',
      text: comment.text,
    });
    const likes = createContainer('game-dialog__comment__likes');
    const likesIcon = createElement('img', {
      className: 'game-dialog__comment-like',
      attributes: {
        src: likeIconImg,
      },
    });
    const likesCount = createElement('span', {
      className: 'game-dialog__comment-likes-count',
      text: `${comment.likesCount}`,
    });

    if (comment.isLikedByCurrentUser) likesIcon.classList.add('active');

    likes.append(likesIcon, likesCount);

    container.append(header, text, likes);

    return container;
  }

  private createCommentHeader(comment: IComment) {
    const container = createContainer('game-dialog__comment-header');
    const authorLetter = createElement('span', {
      className: 'game-dialog__comment-author__letter',
      text: this.getFirstLetterOfUsername(comment.authorName),
    });
    const authorName = createElement('h5', {
      className: 'game-dialog__comment-author',
      text: comment.authorName,
    });
    const date = createElement('span', {
      className: 'game-dialog__comment-date',
      text: formatRelativeDate(comment.createdAt),
    });

    container.append(authorLetter, authorName, date);

    return container;
  }

  private getFirstLetterOfUsername(username: string): string {
    return username[0].toUpperCase();
  }

  private getTopRecordSpan(classname: string, value: string) {
    return createElement('span', {
      className: `game-dialog__record-${classname}`,
      text: value,
    });
  }

  private getPositionIcon(position: number) {
    const positionIcons = ['🥇', '🥈', '🥉'];

    return positionIcons[position - 1] ?? String(position);
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
