import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';

const captured = vi.hoisted(() => ({
  headerCalls: [] as unknown[][],
  routerCalls: [] as unknown[][],
  authDialogCalls: [] as unknown[][],
  sessionCalls: [] as unknown[][],
  show: vi.fn(),
  setActiveRoute: vi.fn(),
  navigate: vi.fn(),
  openAuth: vi.fn(),
  closeAuth: vi.fn(),
  openGame: vi.fn(),
  closeGame: vi.fn(),
  checkExpiration: vi.fn<() => boolean>(),
  restore: vi.fn(),
  start: vi.fn(),
  end: vi.fn<() => Promise<boolean>>(),
}));

vi.mock('../components', () => ({
  Header: class Header {
    public setActiveRoute = captured.setActiveRoute;

    public constructor(...arguments_: unknown[]) {
      captured.headerCalls.push(arguments_);
    }

    public render(): HTMLElement {
      return document.createElement('header');
    }
  },
  Footer: class Footer {
    public render(): HTMLElement {
      return document.createElement('footer');
    }
  },
  Snackbar: class Snackbar {
    public show = captured.show;
  },
  AuthDialog: class AuthDialog {
    public open = captured.openAuth;
    public close = captured.closeAuth;

    public constructor(...arguments_: unknown[]) {
      captured.authDialogCalls.push(arguments_);
    }

    public render(): HTMLElement {
      return document.createElement('div');
    }
  },
  GameDialog: class GameDialog {
    public element = document.createElement('dialog');
    public open = captured.openGame;
    public close = captured.closeGame;
  },
}));

vi.mock('../core', () => ({
  AuthService: class AuthService {},
  CommentsApi: class CommentsApi {},
  CommentsService: class CommentsService {},
  GamesApi: class GamesApi {},
  GamesService: class GamesService {},
  Store: class Store {},
  SessionService: class SessionService {
    public checkExpiration = captured.checkExpiration;
    public restore = captured.restore;
    public start = captured.start;
    public end = captured.end;

    public constructor(...arguments_: unknown[]) {
      captured.sessionCalls.push(arguments_);
    }
  },
}));

vi.mock('./router', () => ({
  Router: class Router {
    public navigate = captured.navigate;

    public constructor(...arguments_: unknown[]) {
      captured.routerCalls.push(arguments_);
    }

    public async render(): Promise<HTMLElement> {
      const element = document.createElement('main');

      element.className = 'main';

      return element;
    }
  },
}));

const user = { uid: 'u1', email: 'a@b.com', displayName: 'Alex', photoURL: undefined };

const headerCallbacks = () => {
  const arguments_ = captured.headerCalls.at(-1) ?? [];

  return {
    openAuth: arguments_[1] as (mode: string) => void,
    navigate: arguments_[2] as (route: string) => void,
    logout: arguments_[3] as () => void,
  };
};

const routerCallbacks = () => {
  const arguments_ = captured.routerCalls.at(-1) ?? [];

  return {
    openDetails: arguments_[2] as (slug: string) => void,
    changeRoute: arguments_[3] as (page: HTMLElement, route: string | undefined) => void,
    changeGame: arguments_[4] as () => void,
    changeAuth: arguments_[5] as () => void,
  };
};

const setUrl = (url: string): void => {
  globalThis.history.replaceState({}, '', url);
};

const renderApp = async (): Promise<void> => {
  await new App().render();
};

const searchParameter = (name: string): string | null =>
  new URLSearchParams(globalThis.location.search).get(name);

const setVisibility = (state: 'visible' | 'hidden'): void => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
};

beforeEach(() => {
  vi.clearAllMocks();
  captured.checkExpiration.mockReturnValue(false);
  captured.end.mockResolvedValue(true);
  setUrl('/');
});

afterEach(() => {
  document.body.replaceChildren();
  Reflect.deleteProperty(document, 'visibilityState');
});

describe('App render', () => {
  it('restores the session once and builds the page in order', async () => {
    await renderApp();

    expect(captured.restore).toHaveBeenCalledTimes(1);
    expect([...document.body.children].map((element) => element.tagName.toLowerCase())).toEqual([
      'header',
      'main',
      'footer',
      'div',
      'dialog',
    ]);
  });
});

describe('App auth dialog guard on load', () => {
  it('opens the dialog for a guest when the url asks for it', async () => {
    setUrl('/?auth=login');

    await renderApp();

    expect(captured.openAuth).toHaveBeenCalledWith('login');
    expect(captured.show).not.toHaveBeenCalled();
  });

  it('keeps the dialog closed when the url has no auth parameter', async () => {
    await renderApp();

    expect(captured.openAuth).not.toHaveBeenCalled();
    expect(captured.closeAuth).toHaveBeenCalledWith(false);
  });

  it('keeps the dialog closed for an unknown auth value', async () => {
    setUrl('/?auth=nonsense');

    await renderApp();

    expect(captured.openAuth).not.toHaveBeenCalled();
    expect(captured.closeAuth).toHaveBeenCalledWith(false);
  });

  it('blocks the dialog for an authenticated user, cleans the url and notifies once', async () => {
    captured.checkExpiration.mockReturnValue(true);
    setUrl('/?auth=login&x=1#top');

    await renderApp();

    expect(captured.openAuth).not.toHaveBeenCalled();
    expect(captured.closeAuth).toHaveBeenCalledWith(false);
    expect(globalThis.location.search).toBe('?x=1');
    expect(globalThis.location.hash).toBe('#top');
    expect(captured.show).toHaveBeenCalledTimes(1);
    expect(captured.show).toHaveBeenCalledWith(expect.stringMatching(/already/i), 'error');
  });
});

describe('App header callbacks', () => {
  it('opens auth for a guest and writes the mode to the url', async () => {
    await renderApp();

    headerCallbacks().openAuth('register');

    expect(captured.openAuth).toHaveBeenCalledWith('register');
    expect(searchParameter('auth')).toBe('register');
  });

  it('does not open auth for an authenticated user', async () => {
    await renderApp();
    captured.checkExpiration.mockReturnValue(true);

    headerCallbacks().openAuth('login');

    expect(captured.openAuth).not.toHaveBeenCalled();
    expect(searchParameter('auth')).toBeNull();
    expect(captured.show).toHaveBeenCalledWith(expect.stringMatching(/already/i), 'error');
  });

  it('checks the session before navigating', async () => {
    await renderApp();
    captured.checkExpiration.mockClear();

    headerCallbacks().navigate('/library');

    expect(captured.navigate).toHaveBeenCalledWith('/library');
    expect(captured.checkExpiration.mock.invocationCallOrder[0]).toBeLessThan(
      captured.navigate.mock.invocationCallOrder[0],
    );
  });

  it('logs out without a message when firebase sign out succeeds', async () => {
    await renderApp();

    headerCallbacks().logout();
    await vi.waitFor(() => {
      expect(captured.end).toHaveBeenCalledTimes(1);
    });

    expect(captured.show).not.toHaveBeenCalled();
  });

  it('tells the user when firebase sign out fails', async () => {
    captured.end.mockResolvedValue(false);
    await renderApp();

    headerCallbacks().logout();
    await vi.waitFor(() => {
      expect(captured.show).toHaveBeenCalledWith(expect.stringMatching(/sign out/i), 'error');
    });
  });
});

describe('App router callbacks', () => {
  it('opens game details with the slug in the url after checking the session', async () => {
    await renderApp();
    captured.checkExpiration.mockClear();

    routerCallbacks().openDetails('tiny-glade');

    expect(captured.checkExpiration).toHaveBeenCalled();
    expect(searchParameter('game')).toBe('tiny-glade');
    expect(captured.openGame).toHaveBeenCalledWith('tiny-glade');
  });

  it('opens the game from the url on history navigation', async () => {
    await renderApp();
    setUrl('/library?game=tiny-glade');
    captured.checkExpiration.mockClear();

    routerCallbacks().changeGame();

    expect(captured.checkExpiration).toHaveBeenCalled();
    expect(captured.openGame).toHaveBeenCalledWith('tiny-glade');
  });

  it('closes the game dialog without touching history when the url has no game', async () => {
    await renderApp();

    routerCallbacks().changeGame();

    expect(captured.closeGame).toHaveBeenCalledWith(false);
  });

  it('re-applies the auth state of the url on history navigation', async () => {
    await renderApp();
    setUrl('/?auth=register');

    routerCallbacks().changeAuth();

    expect(captured.openAuth).toHaveBeenCalledWith('register');
  });

  it('blocks auth from history navigation for an authenticated user', async () => {
    await renderApp();
    captured.checkExpiration.mockReturnValue(true);
    setUrl('/?auth=register&page=2');

    routerCallbacks().changeAuth();

    expect(captured.openAuth).not.toHaveBeenCalled();
    expect(globalThis.location.search).toBe('?page=2');
    expect(captured.show).toHaveBeenCalledTimes(1);
  });

  it('replaces the page and marks the route in the header', async () => {
    await renderApp();

    const nextPage = document.createElement('main');

    nextPage.className = 'next';
    routerCallbacks().changeRoute(nextPage, '/library');

    expect(document.querySelector('main')).toBe(nextPage);
    expect(captured.setActiveRoute).toHaveBeenCalledWith('/library');
  });

  it('does not touch the header for an unknown route', async () => {
    await renderApp();

    routerCallbacks().changeRoute(document.createElement('main'), undefined);

    expect(captured.setActiveRoute).not.toHaveBeenCalled();
  });
});

describe('App session callbacks', () => {
  it('tells the user when the session has expired', async () => {
    await renderApp();

    (captured.sessionCalls.at(-1)?.[2] as () => void)();

    expect(captured.show).toHaveBeenCalledWith(expect.stringMatching(/expired/i), 'error');
  });

  it('starts a session after a successful sign in', async () => {
    await renderApp();

    (captured.authDialogCalls.at(-1)?.[2] as (signedIn: unknown) => void)(user);

    expect(captured.start).toHaveBeenCalledWith(user);
  });
});

describe('App tab visibility', () => {
  it('checks the session when the tab becomes visible', async () => {
    await renderApp();
    captured.checkExpiration.mockClear();
    setVisibility('visible');

    document.dispatchEvent(new Event('visibilitychange'));

    expect(captured.checkExpiration).toHaveBeenCalled();
  });

  it('does nothing when the tab becomes hidden', async () => {
    await renderApp();
    captured.checkExpiration.mockClear();
    setVisibility('hidden');

    document.dispatchEvent(new Event('visibilitychange'));

    expect(captured.checkExpiration).not.toHaveBeenCalled();
  });
});
