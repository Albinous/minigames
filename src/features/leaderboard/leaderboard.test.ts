import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LeaderboardService } from '../../core';
import { Store } from '../../core/state';
import { LeaderBoard } from './leaderboard';

const { show } = vi.hoisted(() => ({ show: vi.fn() }));

vi.mock('../../components', () => ({
  EmptyState: class EmptyState {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'empty-state';

      return element;
    }
  },
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
  Snackbar: class Snackbar {
    public show = show;
  },
}));

vi.mock('./leaderboard-skeleton', () => ({
  LeaderboardSkeleton: class LeaderboardSkeleton {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'leaderboard-skeleton';

      return element;
    }
  },
}));

vi.mock('./leaderboard.view', () => ({
  getLeaderBoardView: (players: unknown[]): string =>
    players.map(() => '<div class="leaderboard-row"></div>').join(''),
}));

const players = [{ id: 1 }, { id: 2 }, { id: 3 }];
const FAILURE = 'Failed to load leaderboard';

const createContext = () => {
  const store = new Store();
  const settle = async (result: { data?: unknown; error?: string }): Promise<void> => {
    store.leaderboard.isLoading = true;
    await Promise.resolve();
    store.leaderboard.data = result.data as never;
    store.leaderboard.error = result.error;
    store.leaderboard.isLoading = false;
  };
  const loadLeaderboard = vi.fn<() => Promise<void>>(() => settle({ data: { data: players } }));
  const leaderboard = new LeaderBoard(store, { loadLeaderboard } as unknown as LeaderboardService);

  return { store, settle, loadLeaderboard, leaderboard };
};

const rowCount = (section: HTMLElement): number =>
  section.querySelectorAll('.leaderboard-row').length;

beforeEach(() => {
  show.mockClear();
});

describe('LeaderBoard', () => {
  it('renders a section and starts loading', async () => {
    const { leaderboard, loadLeaderboard } = createContext();
    const section = await leaderboard.render();

    expect(section.tagName).toBe('SECTION');
    expect(section.className).toBe('leaderboard');
    expect(loadLeaderboard).toHaveBeenCalledTimes(1);
  });

  it('shows a skeleton while the leaderboard is loading', async () => {
    const { leaderboard, loadLeaderboard } = createContext();

    loadLeaderboard.mockImplementation(() => new Promise<void>(() => {}));

    const section = await leaderboard.render();

    expect(section.querySelector('.leaderboard-skeleton')).not.toBeNull();
    expect(rowCount(section)).toBe(0);
  });

  it('shows the players when loading finishes', async () => {
    const { leaderboard } = createContext();
    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(rowCount(section)).toBe(3);
    });

    expect(section.querySelector('.leaderboard-skeleton')).toBeNull();
    expect(show).not.toHaveBeenCalled();
  });

  it('exposes the loaded players', async () => {
    const { leaderboard } = createContext();

    expect(leaderboard.players).toEqual([]);

    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(rowCount(section)).toBe(3);
    });

    expect(leaderboard.players).toEqual(players);
  });

  it('shows an empty state when there are no players', async () => {
    const { leaderboard, loadLeaderboard, settle } = createContext();

    loadLeaderboard.mockImplementation(() => settle({ data: { data: [] } }));

    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(section.querySelector('.empty-state')).not.toBeNull();
    });
  });

  it('shows an empty state when the response has no data', async () => {
    const { leaderboard, loadLeaderboard, settle } = createContext();

    loadLeaderboard.mockImplementation(() => settle({}));

    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(section.querySelector('.empty-state')).not.toBeNull();
    });
  });

  it('shows an error and a snackbar when loading fails', async () => {
    const { leaderboard, loadLeaderboard, settle } = createContext();

    loadLeaderboard.mockImplementation(() => settle({ error: FAILURE }));

    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(section.querySelector('.error-state')).not.toBeNull();
    });

    expect(section.querySelector('.error-state')?.textContent).toBe(FAILURE);
    expect(show).toHaveBeenCalledWith(FAILURE, 'error');
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('loads again on retry and shows the players', async () => {
    const { leaderboard, loadLeaderboard, settle } = createContext();

    loadLeaderboard.mockImplementationOnce(() => settle({ error: FAILURE }));

    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(section.querySelector('.error-state')).not.toBeNull();
    });

    section.querySelector<HTMLButtonElement>('.error-state__retry')?.click();

    await vi.waitFor(() => {
      expect(rowCount(section)).toBe(3);
    });

    expect(loadLeaderboard).toHaveBeenCalledTimes(2);
    expect(section.querySelector('.error-state')).toBeNull();
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('keeps the error and notifies again when the retry fails too', async () => {
    const { leaderboard, loadLeaderboard, settle } = createContext();

    loadLeaderboard.mockImplementation(() => settle({ error: FAILURE }));

    const section = await leaderboard.render();

    await vi.waitFor(() => {
      expect(show).toHaveBeenCalledTimes(1);
    });

    section.querySelector<HTMLButtonElement>('.error-state__retry')?.click();

    await vi.waitFor(() => {
      expect(show).toHaveBeenCalledTimes(2);
    });

    expect(section.querySelector('.error-state')).not.toBeNull();
  });
});