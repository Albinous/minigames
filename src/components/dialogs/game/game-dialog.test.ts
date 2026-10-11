import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CommentsService, GamesService } from '../../../core';
import { Store } from '../../../core/state';
import { GameDialog } from './game-dialog';

const { show } = vi.hoisted(() => ({ show: vi.fn() }));

vi.mock('../../../assets/icons', () => ({
  closeIconImg: 'close.svg',
  likeIconImg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  sendIconImg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  starIcon: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
}));

vi.mock('../../snackbar/snackbar', () => ({
  Snackbar: class Snackbar {
    public show = show;
  },
}));

vi.mock('../../game-stat', () => ({
  GameStat: class GameStat {
    private readonly options: { value: string; className: string };

    public constructor(options: { icon: string; value: string; className: string }) {
      this.options = options;
    }

    public render(): HTMLElement {
      const element = document.createElement('div');
      const value = document.createElement('span');

      element.className = `game-stat ${this.options.className}`;
      value.className = 'game-stat__value';
      value.textContent = this.options.value;
      element.append(value);

      return element;
    }
  },
}));

vi.mock('../../error-state', () => ({
  ErrorState: class ErrorState {
    public render(message: string, onRetry: () => void): HTMLElement {
      const element = document.createElement('div');
      const retry = document.createElement('button');

      element.className = 'error-state';
      element.textContent = message;
      retry.className = 'error-state__retry';
      retry.addEventListener('click', onRetry);
      element.append(retry);

      return element;
    }
  },
}));

vi.mock('../../empty-state', () => ({
  EmptyState: class EmptyState {
    public render(message?: string): HTMLElement {
      const element = document.createElement('div');

      element.className = 'empty-state';
      element.textContent = message ?? '';

      return element;
    }
  },
}));

vi.mock('./game-dialog-skeleton', () => ({
  GameDetailsSkeleton: class GameDetailsSkeleton {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'game-details-skeleton';

      return element;
    }
  },
}));

vi.mock('./comments-skeleton', () => ({
  CommentSkeleton: class CommentSkeleton {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'comment-skeleton';

      return element;
    }
  },
}));

const SLUG = 'tiny-glade';
const DATE = '2026-01-01T00:00:00Z';

const gameDetails = {
  slug: SLUG,
  name: 'Tiny Glade',
  heroImage: 'https://example.com/hero.jpg',
  rating: 4.8,
  likesCount: 1500,
  fullDescription: 'A cozy diorama builder',
  specs: { genre: 'Puzzle', platform: 'PC' },
  isLikedByCurrentUser: false,
  topRecords: [
    { position: 1, playerName: 'Ann', score: 1234, achievedAt: DATE },
    { position: 2, playerName: 'Bob', score: 900, achievedAt: DATE },
    { position: 3, playerName: 'Cy', score: 800, achievedAt: DATE },
    { position: 4, playerName: 'Di', score: 700, achievedAt: DATE },
  ],
};

const comments = [
  {
    commentId: 'c1',
    authorName: 'alice',
    text: 'Great',
    createdAt: DATE,
    likesCount: 3,
    isLikedByCurrentUser: true,
  },
  {
    commentId: 'c2',
    authorName: 'Bob',
    text: 'Nice',
    createdAt: DATE,
    likesCount: 0,
    isLikedByCurrentUser: false,
  },
];

const session = { displayName: 'alex', email: 'alex@mail.com', authenticatedAt: 1000 };

type Context = ReturnType<typeof createContext>;

const createContext = () => {
  const store = new Store();
  const loadGame = vi.fn<(slug: string) => Promise<void>>(async () => {
    store.game.error = undefined;
    store.game.data = { data: structuredClone(gameDetails) } as never;
  });
  const loadComments = vi.fn<(slug: string) => Promise<void>>(async () => {
    store.comments.error = undefined;
    store.comments.data = { data: structuredClone(comments) } as never;
  });
  const toggleFavorite = vi.fn<(slug: string) => Promise<void>>(async () => {
    const game = store.game.data?.data as unknown as { isLikedByCurrentUser: boolean };

    game.isLikedByCurrentUser = !game.isLikedByCurrentUser;
  });
  const toggleLike = vi.fn<(commentId: string) => Promise<void>>(async () => {});
  const submitComment = vi.fn<(slug: string, text: string) => Promise<void>>(async () => {});
  const ensureAuthenticated = vi.fn<() => boolean>(() => true);
  const dialog = new GameDialog(
    store,
    { loadGame, toggleFavorite } as unknown as GamesService,
    { loadComments, toggleLike, submitComment } as unknown as CommentsService,
    ensureAuthenticated,
  );

  document.body.append(dialog.element);

  return {
    store,
    loadGame,
    loadComments,
    toggleFavorite,
    toggleLike,
    submitComment,
    ensureAuthenticated,
    dialog,
  };
};

const openDialog = async (context: Context = createContext()) => {
  await context.dialog.open(SLUG);

  return context;
};

const openAsUser = async (): Promise<Context> => {
  const context = createContext();

  context.store.setSession(session);

  return openDialog(context);
};

const select = (context: Context, selector: string): HTMLElement | null =>
  context.dialog.element.querySelector<HTMLElement>(selector);

const texts = (context: Context, selector: string): (string | null)[] =>
  [...context.dialog.element.querySelectorAll(selector)].map((element) => element.textContent);

const textareaOf = (context: Context): HTMLTextAreaElement =>
  select(context, '.game-dialog__comments-textarea') as HTMLTextAreaElement;

const typeComment = (context: Context, value: string): void => {
  textareaOf(context).value = value;
  textareaOf(context).dispatchEvent(new Event('input'));
};

const pressEnter = (context: Context, isShiftKey = false): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    shiftKey: isShiftKey,
    bubbles: true,
    cancelable: true,
  });

  textareaOf(context).dispatchEvent(event);

  return event;
};

beforeAll(() => {
  // В jsdom у <dialog> может не быть showModal и close
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement): void {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement): void {
    this.removeAttribute('open');
  };
});

beforeEach(() => {
  show.mockClear();
  globalThis.history.replaceState({}, '', `/library?game=${SLUG}`);
});

afterEach(() => {
  document.body.replaceChildren();
});

describe('GameDialog data access', () => {
  it('throws when game or comments are requested before loading', () => {
    const { dialog } = createContext();

    expect(() => dialog.game).toThrow('Game data is not loaded');
    expect(() => dialog.comments).toThrow('Game comments is not loaded');
  });

  it('exposes the loaded game and comments', async () => {
    const { dialog } = await openDialog();

    expect(dialog.game.name).toBe('Tiny Glade');
    expect(dialog.comments).toHaveLength(2);
  });

  it('exposes its dialog element', () => {
    const { dialog } = createContext();

    expect(dialog.element).toBeInstanceOf(HTMLDialogElement);
  });
});

describe('GameDialog open', () => {
  it('opens the modal and loads the game with its comments', async () => {
    const context = await openDialog();

    expect(context.dialog.element.hasAttribute('open')).toBe(true);
    expect(context.loadGame).toHaveBeenCalledWith(SLUG);
    expect(context.loadComments).toHaveBeenCalledWith(SLUG);
  });

  it('renders the game info', async () => {
    const context = await openDialog();
    const image = select(context, '.game-dialog__img') as HTMLImageElement | null;

    expect(image?.src).toBe('https://example.com/hero.jpg');
    expect(image?.alt).toBe('Tiny Glade');
    expect(select(context, '.game-dialog__title')?.textContent).toBe('Tiny Glade');
    expect(select(context, '.game-dialog__descr')?.textContent).toBe('A cozy diorama builder');
    expect(select(context, '.rating .game-stat__value')?.textContent).toBe('4.8');
    expect(select(context, '.likes .game-stat__value')?.textContent).toBe('1.5K');
  });

  it('renders the specs with capitalized names', async () => {
    const context = await openDialog();

    expect(texts(context, '.game-dialog__spec-type')).toEqual(['Genre', 'Platform']);
    expect(texts(context, '.game-dialog__spec-value')).toEqual(['Puzzle', 'PC']);
  });

  it('renders top records with medals and plain positions', async () => {
    const context = await openDialog();

    expect(texts(context, '.game-dialog__record-position')).toEqual(['🥇', '🥈', '🥉', '4']);
    expect(texts(context, '.game-dialog__record-player')).toEqual(['Ann', 'Bob', 'Cy', 'Di']);
    expect(texts(context, '.game-dialog__record-score')[0]).toBe('1,234 pts');
  });

  it('renders comments with author initials and like state', async () => {
    const context = await openDialog();

    expect(select(context, '.game-dialog__comments-title')?.textContent).toBe('Comments (2)');
    expect(texts(context, '.game-dialog__comment-text')).toEqual(['Great', 'Nice']);
    expect(texts(context, '.game-dialog__comment-author__name')).toEqual(['alice', 'Bob']);
    expect(texts(context, '.game-dialog__comment-author__letter')).toEqual(['A', 'B']);
    expect(texts(context, '.game-dialog__comment-likes-count')).toEqual(['3', '0']);

    const likeButtons = [...context.dialog.element.querySelectorAll('.game-dialog__comment-likes')];

    expect(likeButtons.map((button) => button.classList.contains('active'))).toEqual([true, false]);
  });

  it('shows a skeleton while the game is loading', async () => {
    const context = createContext();
    let isSkeletonShownDuringLoad = false;

    context.loadGame.mockImplementation(async () => {
      isSkeletonShownDuringLoad = select(context, '.game-details-skeleton') !== null;
      context.store.game.data = { data: structuredClone(gameDetails) } as never;
    });
    await context.dialog.open(SLUG);

    expect(isSkeletonShownDuringLoad).toBe(true);
    expect(select(context, '.game-details-skeleton')).toBeNull();
    expect(select(context, '.game-dialog__title')?.textContent).toBe('Tiny Glade');
  });

  it('shows the favourite state of a liked game', async () => {
    const context = createContext();

    context.loadGame.mockImplementation(async () => {
      context.store.game.data = {
        data: { ...structuredClone(gameDetails), isLikedByCurrentUser: true },
      } as never;
    });
    await openDialog(context);

    expect(select(context, '.game-dialog__btn-text')?.textContent).toBe('Play Now');
    expect(select(context, '.game-dialog__btn-favourite')?.classList.contains('active')).toBe(true);
    expect(select(context, '.game-dialog__btn-favourite .game-dialog__btn-text')?.textContent).toBe(
      'Remove from favourites',
    );
  });
});

describe('GameDialog game errors', () => {
  it('shows an error with a snackbar and recovers on retry', async () => {
    const context = createContext();

    context.loadGame.mockImplementationOnce(async () => {
      context.store.game.data = undefined;
      context.store.game.error = 'Failed to load game details';
    });
    await openDialog(context);

    expect(select(context, '.game-dialog__content .error-state')).not.toBeNull();
    expect(show).toHaveBeenCalledWith('Failed to load game details', 'error');

    select(context, '.error-state__retry')?.click();
    await vi.waitFor(() => {
      expect(select(context, '.game-dialog__title')?.textContent).toBe('Tiny Glade');
    });

    expect(select(context, '.game-dialog__content .error-state')).toBeNull();
  });

  it('keeps the error and notifies again when the retry fails', async () => {
    const context = createContext();

    context.loadGame.mockImplementation(async () => {
      context.store.game.data = undefined;
      context.store.game.error = 'Failed to load game details';
    });
    await openDialog(context);

    const notificationsBeforeRetry = show.mock.calls.length;

    select(context, '.error-state__retry')?.click();
    await vi.waitFor(() => {
      expect(show.mock.calls.length).toBeGreaterThan(notificationsBeforeRetry);
    });

    expect(context.loadGame).toHaveBeenCalledTimes(2);
    expect(select(context, '.game-dialog__content .error-state')).not.toBeNull();
  });

  it('shows an empty state when there is no game data', async () => {
    const context = createContext();

    context.loadGame.mockImplementationOnce(async () => {
      context.store.game.data = undefined;
    });
    await openDialog(context);

    expect(select(context, '.game-dialog__content .empty-state')).not.toBeNull();
  });
});

describe('GameDialog comments states', () => {
  it('shows an error for comments and recovers on retry', async () => {
    const context = createContext();

    context.loadComments.mockImplementationOnce(async () => {
      context.store.comments.data = undefined;
      context.store.comments.error = 'Failed to load comments';
    });
    await openDialog(context);

    expect(select(context, '.game-dialog__comments-list .error-state')).not.toBeNull();
    expect(select(context, '.game-dialog__comments-title')?.textContent).toBe('Comments');
    expect(show).toHaveBeenCalledWith('Failed to load comments', 'error');

    select(context, '.game-dialog__comments-list .error-state__retry')?.click();
    await vi.waitFor(() => {
      expect(texts(context, '.game-dialog__comment-text')).toEqual(['Great', 'Nice']);
    });

    expect(select(context, '.game-dialog__comments-title')?.textContent).toBe('Comments (2)');
  });

  it('shows a message when there are no comments', async () => {
    const context = createContext();

    context.loadComments.mockImplementation(async () => {
      context.store.comments.data = { data: [] } as never;
    });
    await openDialog(context);

    expect(select(context, '.game-dialog__comments-list .empty-state')?.textContent).toBe(
      'No comments yet',
    );
    expect(select(context, '.game-dialog__comments-title')?.textContent).toBe('Comments');
  });

  it('shows a skeleton while comments are loading', async () => {
    const context = createContext();

    context.loadComments.mockImplementation(async () => {
      context.store.comments.isLoading = true;
    });
    await openDialog(context);

    expect(select(context, '.game-dialog__comments-list .comment-skeleton')).not.toBeNull();
  });
});

describe('GameDialog closing', () => {
  it('closes with an animation, removes the game from the url and finishes on transition end', async () => {
    const context = await openDialog();

    context.dialog.close();

    expect(context.dialog.element.classList.contains('closing')).toBe(true);
    expect(new URLSearchParams(globalThis.location.search).get('game')).toBeNull();

    context.dialog.element.dispatchEvent(new Event('transitionend'));

    expect(context.dialog.element.classList.contains('closing')).toBe(false);
    expect(context.dialog.element.hasAttribute('open')).toBe(false);
  });

  it('keeps the url when asked not to update history', async () => {
    const context = await openDialog();

    context.dialog.close(false);

    expect(new URLSearchParams(globalThis.location.search).get('game')).toBe(SLUG);
  });

  it('closes with the close button', async () => {
    const context = await openDialog();

    select(context, '.game-dialog__close')?.click();

    expect(context.dialog.element.classList.contains('closing')).toBe(true);
  });

  it('closes when the backdrop is clicked but not when the content is clicked', async () => {
    const context = await openDialog();

    select(context, '.game-dialog__title')?.click();
    expect(context.dialog.element.classList.contains('closing')).toBe(false);

    context.dialog.element.click();
    expect(context.dialog.element.classList.contains('closing')).toBe(true);
  });

  it('turns the native cancel event into an animated close', async () => {
    const context = await openDialog();
    const event = new Event('cancel', { cancelable: true });

    context.dialog.element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(context.dialog.element.classList.contains('closing')).toBe(true);
  });

  it('clears the draft comment and like marks after closing', async () => {
    const context = await openDialog();

    typeComment(context, 'draft');
    expect(select(context, '.game-dialog__comment-likes.active')).not.toBeNull();

    context.dialog.close();
    context.dialog.element.dispatchEvent(new Event('transitionend'));

    expect(textareaOf(context).value).toBe('');
    expect(textareaOf(context).style.height).toBe('');
    expect(select(context, '.game-dialog__comment-likes.active')).toBeNull();
  });
});

describe('GameDialog comment area', () => {
  it('ignores clicks in the comments area that are not on a like button', async () => {
    const context = await openDialog();

    select(context, '.game-dialog__comments-title')?.click();

    expect(context.toggleLike).not.toHaveBeenCalled();
    expect(select(context, '.game-dialog__comment-likes.active')).not.toBeNull();
  });

  it('grows the comment textarea up to a limit', async () => {
    const context = await openDialog();
    const textarea = textareaOf(context);

    Object.defineProperty(textarea, 'scrollHeight', { value: 40, configurable: true });
    textarea.dispatchEvent(new Event('input'));
    expect(textarea.style.height).toBe('40px');

    Object.defineProperty(textarea, 'scrollHeight', { value: 200, configurable: true });
    textarea.dispatchEvent(new Event('input'));
    expect(textarea.style.height).toBe('88px');
  });
});

describe('GameDialog favourites', () => {
  it('asks a guest to log in and sends nothing', async () => {
    const context = await openDialog();

    context.ensureAuthenticated.mockReturnValue(false);
    select(context, '.game-dialog__btn-favourite')?.click();

    expect(context.ensureAuthenticated).toHaveBeenCalled();
    expect(context.toggleFavorite).not.toHaveBeenCalled();
  });

  it('shows the state confirmed by the server', async () => {
    const context = await openDialog();
    const button = select(context, '.game-dialog__btn-favourite');

    button?.click();
    await vi.waitFor(() => {
      expect(button?.classList.contains('active')).toBe(true);
    });

    expect(context.toggleFavorite).toHaveBeenCalledWith(SLUG);
    expect(button?.querySelector('.game-dialog__btn-text')?.textContent).toBe(
      'Remove from favourites',
    );
  });

  it('locks the button during the request and ignores a second click', async () => {
    const context = await openDialog();
    const button = select(context, '.game-dialog__btn-favourite') as HTMLButtonElement;
    let isLockedDuringRequest = false;

    context.toggleFavorite.mockImplementation(async () => {
      isLockedDuringRequest = button.disabled;
    });
    button.click();
    button.click();
    await vi.waitFor(() => {
      expect(button.disabled).toBe(false);
    });

    expect(isLockedDuringRequest).toBe(true);
    expect(context.toggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('reports a failed request and unlocks the button', async () => {
    const context = await openDialog();
    const button = select(context, '.game-dialog__btn-favourite') as HTMLButtonElement;

    context.toggleFavorite.mockRejectedValue(new Error('network'));
    button.click();
    await vi.waitFor(() => {
      expect(show).toHaveBeenCalledWith(expect.any(String), 'error');
    });

    expect(button.disabled).toBe(false);
    expect(button.classList.contains('active')).toBe(false);
  });
});

describe('GameDialog comment likes', () => {
  it('asks a guest to log in and sends nothing', async () => {
    const context = await openDialog();

    context.ensureAuthenticated.mockReturnValue(false);
    select(context, '.game-dialog__comment-likes')?.click();

    expect(context.toggleLike).not.toHaveBeenCalled();
  });

  it('sends the comment id and shows the state confirmed by the server', async () => {
    const context = await openDialog();

    context.toggleLike.mockImplementation(async () => {
      const first = context.store.comments.data?.data[0] as unknown as {
        likesCount: number;
        isLikedByCurrentUser: boolean;
      };

      first.likesCount = 2;
      first.isLikedByCurrentUser = false;
    });
    select(context, '.game-dialog__comment-likes')?.click();
    await vi.waitFor(() => {
      expect(texts(context, '.game-dialog__comment-likes-count')[0]).toBe('2');
    });

    expect(context.toggleLike).toHaveBeenCalledWith('c1');
    expect(select(context, '.game-dialog__comment-likes')?.classList.contains('active')).toBe(
      false,
    );
  });

  it('reports a failed request and unlocks the button', async () => {
    const context = await openDialog();
    const button = select(context, '.game-dialog__comment-likes') as HTMLButtonElement;

    context.toggleLike.mockRejectedValue(new Error('network'));
    button.click();
    await vi.waitFor(() => {
      expect(show).toHaveBeenCalledWith(expect.any(String), 'error');
    });

    expect(button.disabled).toBe(false);
  });
});

describe('GameDialog comment form', () => {
  it('is locked for a guest', async () => {
    const context = await openDialog();

    expect(textareaOf(context).disabled).toBe(true);
    expect(select(context, '.game-dialog__comments-send')?.hasAttribute('disabled')).toBe(true);
  });

  it('shows the first letter of the user name in the avatar', async () => {
    const context = await openAsUser();

    expect(select(context, '.game-dialog__comments-avatar')?.textContent).toBe('A');
    expect(textareaOf(context).disabled).toBe(false);
  });

  it('sends the trimmed text on Enter and clears the field', async () => {
    const context = await openAsUser();

    typeComment(context, '  Hello  ');

    expect(pressEnter(context).defaultPrevented).toBe(true);
    await vi.waitFor(() => {
      expect(textareaOf(context).value).toBe('');
    });

    expect(context.submitComment).toHaveBeenCalledWith(SLUG, 'Hello');
  });

  it('sends the text with the send button', async () => {
    const context = await openAsUser();

    typeComment(context, 'Nice game');
    select(context, '.game-dialog__comments-send')?.click();
    await vi.waitFor(() => {
      expect(context.submitComment).toHaveBeenCalledWith(SLUG, 'Nice game');
    });
  });

  it('does not send on Shift+Enter', async () => {
    const context = await openAsUser();

    typeComment(context, 'Hello');

    expect(pressEnter(context, true).defaultPrevented).toBe(false);
    expect(context.submitComment).not.toHaveBeenCalled();
  });

  it('rejects an empty comment', async () => {
    const context = await openAsUser();

    typeComment(context, ' '.repeat(3));
    pressEnter(context);

    expect(context.submitComment).not.toHaveBeenCalled();
    expect(show).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('rejects a comment over 500 characters but accepts exactly 500', async () => {
    const context = await openAsUser();

    typeComment(context, 'a'.repeat(501));
    pressEnter(context);
    expect(context.submitComment).not.toHaveBeenCalled();

    typeComment(context, 'a'.repeat(500));
    pressEnter(context);
    await vi.waitFor(() => {
      expect(context.submitComment).toHaveBeenCalledTimes(1);
    });
  });

  it('locks the form during the request', async () => {
    const context = await openAsUser();
    let isLockedDuringRequest = false;

    context.submitComment.mockImplementation(async () => {
      isLockedDuringRequest = textareaOf(context).disabled;
    });
    typeComment(context, 'Hello');
    pressEnter(context);
    await vi.waitFor(() => {
      expect(textareaOf(context).disabled).toBe(false);
    });

    expect(isLockedDuringRequest).toBe(true);
  });

  it('keeps the text and unlocks the form when sending fails', async () => {
    const context = await openAsUser();

    context.submitComment.mockRejectedValue(new Error('network'));
    typeComment(context, 'Hello');
    pressEnter(context);
    await vi.waitFor(() => {
      expect(show).toHaveBeenCalledWith(expect.any(String), 'error');
    });

    expect(textareaOf(context).value).toBe('Hello');
    expect(textareaOf(context).disabled).toBe(false);
  });

  it('sends nothing when the session is no longer valid', async () => {
    const context = await openAsUser();

    context.ensureAuthenticated.mockReturnValue(false);
    typeComment(context, 'Hello');
    pressEnter(context);

    expect(context.submitComment).not.toHaveBeenCalled();
    expect(textareaOf(context).value).toBe('Hello');
  });
});
