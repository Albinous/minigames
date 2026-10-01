import './game-dialog.scss';
import {
  createContainer,
  createElement,
  firstLetterToUppercase,
  formatLikesCount,
  formatRelativeDate,
  formatTotalScore,
  iconToSvg,
} from '../../../shared';
import type {
  IGameDetails,
  IGameSpecs,
  ITopRecord,
  IComment,
  GamesService,
  Store,
  CommentsService,
} from '../../../core';
import { closeIconImg, likeIconImg, sendIconImg, starIcon } from '../../../assets/icons';
import { GameStat } from '../../game-stat';

export class GameDialog {
  private dialogElement: HTMLDialogElement;
  private store: Store;
  private gamesService: GamesService;
  private commentsService: CommentsService;

  constructor(store: Store, gamesService: GamesService, commentsService: CommentsService) {
    this.store = store;
    this.gamesService = gamesService;
    this.commentsService = commentsService;
    this.dialogElement = this.render();
  }

  private createContent(): HTMLElement {
    const container = createContainer('game-dialog__content');
    const hero = this.createHero();
    const info = this.createInfo();

    container.append(hero, info);

    return container;
  }

  private createHero(): HTMLElement {
    const container = createContainer('game-dialog__hero');

    const img = createElement('img', {
      className: 'game-dialog__img',
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

    const header = this.createHeader();
    const description = createElement('p', {
      className: 'game-dialog__descr',
    });
    const specs = this.createSpecs();
    const buttons = this.createDialogButtons();
    const topRecords = this.createTopRecords();
    const comments = this.createComments();

    container.append(header, description, specs, buttons, topRecords, comments);

    return container;
  }

  private createHeader(): HTMLElement {
    const container = createContainer('game-dialog__header');

    const title = createElement('h2', {
      className: 'game-dialog__title',
    });

    const stats = createContainer('game-dialog__stats');

    const rating = new GameStat({
      icon: starIcon,
      value: '',
      className: 'rating',
    }).render();

    const likes = new GameStat({
      icon: likeIconImg,
      value: '',
      className: 'likes',
    }).render();

    stats.append(rating, likes);
    container.append(title, stats);

    return container;
  }

  private createSpecs(): HTMLElement {
    return createContainer('game-dialog__specs');
  }

  private createSpec(type: string, value: string): HTMLElement {
    const spec = createContainer('game-dialog__spec');
    const specType = createElement('span', {
      className: 'game-dialog__spec-type',
      text: firstLetterToUppercase(type),
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

    const addFavourites = this.createDialogBtn(
      'favourite',
      'secondary',
      'Add to Favourites',
      likeIconImg,
    );

    container.append(playNow, addFavourites);

    return container;
  }

  private createDialogBtn(
    className: string,
    buttonType: string,
    text: string,
    icon?: string,
  ): HTMLButtonElement {
    const button = createElement('button', {
      className: `btn btn-${buttonType} game-dialog__btn game-dialog__btn-${className}`,
      attributes: {
        type: 'button',
        'aria-label': text,
      },
    });

    const textElement = createElement('span', {
      text,
      className: 'game-dialog__btn-text',
    });

    button.append(textElement);

    if (icon) {
      iconToSvg(icon, button);
    }

    return button;
  }

  private createTopRecords(): HTMLElement {
    const container = createContainer('game-dialog__records');

    const header = this.createTopRecordsTitle();
    const records = createContainer('game-dialog__records-list');

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

    const position = this.getTopRecordSpan('position', this.getPositionIcon(record.position));
    const playerName = this.getTopRecordSpan('player', record.playerName);
    const score = this.getTopRecordSpan('score', `${formatTotalScore(record.score)} pts`);
    const date = this.getTopRecordSpan('date', formatRelativeDate(record.achievedAt));

    const leftContainer = createContainer('game-dialog__record-left');
    const rightContainer = createContainer('game-dialog__record-right');

    date.classList.add('date');

    leftContainer.append(position, playerName);
    rightContainer.append(score, date);

    container.append(leftContainer, rightContainer);

    return container;
  }

  private createComments(): HTMLElement {
    const container = createContainer('game-dialog__comments');

    const title = createElement('h3', {
      className: 'game-dialog__comments-title',
    });

    const form = this.createCommentInput();

    const comments = createContainer('game-dialog__comments-list');

    container.append(title, form, comments);

    return container;
  }

  private createCommentInput(): HTMLFormElement {
    const form = createElement('form', {
      className: 'game-dialog__comments-form',
    });
    const author = createElement('div', {
      className: 'game-dialog__comments-avatar username-circle',
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

    iconToSvg(sendIconImg, sendButton);

    form.append(author, textarea, sendButton);

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 88)}px`;
    });

    return form;
  }

  private createCommentItem(comment: IComment): HTMLElement {
    const container = createContainer('game-dialog__comment');

    const header = this.createCommentHeader(comment);

    const text = createElement('p', {
      className: 'game-dialog__comment-text',
      text: comment.text,
    });

    const likes = createElement('button', {
      className: 'game-dialog__comment-likes',
      attributes: {
        type: 'button',
      },
    });

    iconToSvg(likeIconImg, likes);

    const likesCount = createElement('span', {
      className: 'game-dialog__comment-likes-count',
      text: String(comment.likesCount),
    });

    if (comment.isLikedByCurrentUser) {
      likes.classList.add('active');
    }

    likes.append(likesCount);
    container.append(header, text, likes);

    return container;
  }

  private createCommentHeader(comment: IComment) {
    const container = createContainer('game-dialog__comment-header');
    const author = createContainer('game-dialog__comment-author');
    const authorLetter = createElement('span', {
      className: 'game-dialog__comment-author__letter username-circle',
      text: this.getFirstLetterOfUsername(comment.authorName),
    });
    const authorName = createElement('h4', {
      className: 'game-dialog__comment-author__name',
      text: comment.authorName,
    });
    const date = createElement('span', {
      className: 'game-dialog__comment-date date',
      text: formatRelativeDate(comment.createdAt),
    });

    author.append(authorLetter, authorName);

    container.append(author, date);

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

  // RENDER DATA

  private renderHero(): void {
    const image = this.dialogElement.querySelector<HTMLImageElement>('.game-dialog__img');

    if (!image) return;

    image.src = this.game.heroImage;
    image.alt = this.game.name;
  }

  private renderHeader(): void {
    const title = this.dialogElement.querySelector<HTMLHeadingElement>('.game-dialog__title');

    if (title) {
      title.textContent = this.game.name;
    }

    const ratingValue = this.dialogElement.querySelector<HTMLElement>(
      ':scope .rating .game-stat__value',
    );

    const likesValue = this.dialogElement.querySelector<HTMLElement>(
      ':scope .likes .game-stat__value',
    );

    if (ratingValue) {
      ratingValue.textContent = String(this.game.rating);
    }

    if (likesValue) {
      likesValue.textContent = formatLikesCount(this.game.likesCount);
    }
  }

  private renderDescription(): void {
    const description =
      this.dialogElement.querySelector<HTMLParagraphElement>('.game-dialog__descr');

    if (description) {
      description.textContent = this.game.fullDescription;
    }
  }

  private renderSpecs(specs: IGameSpecs): void {
    const container = this.dialogElement.querySelector('.game-dialog__specs');

    if (!container) return;

    container.replaceChildren();

    for (const [key, value] of Object.entries(specs)) {
      container.append(this.createSpec(key, value));
    }
  }

  private renderFavouriteState(isLiked: boolean): void {
    const button = this.dialogElement.querySelector<HTMLButtonElement>(
      '.game-dialog__btn-favourite',
    );

    if (!button) return;

    const text = button.querySelector('.game-dialog__btn-text');

    if (text) {
      text.textContent = isLiked ? 'Remove from favourites' : 'Add to Favourites';
    }

    button.classList.toggle('active', isLiked);
  }

  private renderTopRecords(recordsData: ITopRecord[]): void {
    const records = this.dialogElement.querySelector('.game-dialog__records-list');

    if (!records) return;

    records.replaceChildren();

    for (const record of recordsData) {
      records.append(this.createTopRecordItem(record));
    }
  }

  private renderCommentsData(): void {
    const title = this.dialogElement.querySelector('.game-dialog__comments-title');

    const commentsList = this.dialogElement.querySelector('.game-dialog__comments-list');

    if (!title || !commentsList) return;

    title.textContent = `Comments (${this.comments.length})`;

    commentsList.replaceChildren();

    for (const comment of this.comments) {
      commentsList.append(this.createCommentItem(comment));
    }
  }

  private renderGameData(): void {
    this.renderHero();
    this.renderHeader();
    this.renderDescription();
    this.renderSpecs(this.game.specs);
    this.renderFavouriteState(this.game.isLikedByCurrentUser);
    this.renderTopRecords(this.game.topRecords);
    this.renderCommentsData();
  }

  private bindCloseButton(): void {
    if (!this.dialogElement) return;
    const closeButton = this.dialogElement.querySelector('.game-dialog__close');

    closeButton?.addEventListener('click', () => {
      this.close();
    });
  }

  private bindDialogEvents(): void {
    if (!this.dialogElement) return;

    this.dialogElement.addEventListener('click', (event) => {
      if (event.target === this.dialogElement) {
        this.close();
      }
    });

    this.dialogElement.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
  }

  private bindAddFavourites(): void {
    if (!this.dialogElement) return;

    const addFavouritesButton = this.dialogElement.querySelector('.game-dialog__btn-favourite');
    if (!addFavouritesButton) return;
    const addFavouritesText = addFavouritesButton.querySelector('.game-dialog__btn-text');

    addFavouritesButton?.addEventListener('click', () => {
      this.game.isLikedByCurrentUser = !this.game.isLikedByCurrentUser;
      if (addFavouritesText) {
        addFavouritesText.textContent = this.game.isLikedByCurrentUser
          ? 'Remove from favourites'
          : 'Add to Favourites';
      }
      addFavouritesButton.classList.toggle('active', this.game.isLikedByCurrentUser);
    });
  }

  private bindLikeComment(): void {
    if (!this.dialogElement) return;

    const comment = this.dialogElement.querySelector('.game-dialog__comments');

    comment?.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>('.game-dialog__comment-likes');
      if (!button) return;

      button.classList.toggle('active');
    });
  }

  private reset(): void {
    this.game.isLikedByCurrentUser = this.initialLiked;

    const favouriteButton = this.dialogElement.querySelector('.game-dialog__btn-favourite');
    if (!favouriteButton) return;
    favouriteButton.classList.remove('active');

    const buttons = this.dialogElement.querySelectorAll('.game-dialog__comment-likes');
    for (const button of buttons) {
      button.classList.remove('active');
    }

    const textarea = this.dialogElement.querySelector<HTMLTextAreaElement>(
      '.game-dialog__comments-textarea',
    );

    if (!textarea) return;
    textarea.value = '';
    textarea.style.height = '';
  }

  private get initialLiked() {
    return this.game.isLikedByCurrentUser;
  }

  private async loadGame(slug: string): Promise<void> {
    await this.gamesService.loadGame(slug);
  }

  private async loadComments(slug: string): Promise<void> {
    await this.commentsService.loadComments(slug);
  }

  public async open(slug: string): Promise<void> {
    await this.loadGame(slug);
    await this.loadComments(slug);
    this.renderGameData();
    this.dialogElement.showModal();
  }

  public close(): void {
    if (!this.dialogElement) return;

    this.dialogElement.classList.add('closing');

    this.dialogElement.addEventListener(
      'transitionend',
      () => {
        this.reset();
        this.dialogElement?.close();
        this.dialogElement?.classList.remove('closing');
      },
      { once: true },
    );
  }

  public get game(): IGameDetails {
    if (!this.store.game.data?.data) {
      throw new Error('Game data is not loaded');
    }

    return this.store.game.data.data;
  }

  public get comments(): IComment[] {
    if (!this.store.comments.data?.data) {
      throw new Error('Game comments is not loaded');
    }

    return this.store.comments.data.data;
  }

  public render(): HTMLDialogElement {
    const root = createElement('dialog', {
      className: 'game-dialog',
    });

    this.dialogElement = root;

    const content = this.createContent();

    root.append(content);

    this.bindCloseButton();
    this.bindDialogEvents();
    this.bindAddFavourites();
    this.bindLikeComment();

    return root;
  }
}
