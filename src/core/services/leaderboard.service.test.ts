import { describe, expect, it, vi } from 'vitest';
import { Store } from '../state';
import type { LeaderboardApi } from './api';
import { LeaderboardService } from './leaderboard.service';

const createContext = () => {
  const store = new Store();
  const getLeaderboard = vi.fn();
  const service = new LeaderboardService(store, { getLeaderboard } as unknown as LeaderboardApi);

  return { store, getLeaderboard, service };
};

describe('LeaderboardService.loadLeaderboard', () => {
  it('stores the response and finishes loading', async () => {
    const { store, getLeaderboard, service } = createContext();
    const response = { players: [] };

    getLeaderboard.mockResolvedValue(response);
    await service.loadLeaderboard();

    expect(store.leaderboard.data).toBe(response);
    expect(store.leaderboard.isLoading).toBe(false);
  });

  it('stores an error when the request fails', async () => {
    const { store, getLeaderboard, service } = createContext();

    getLeaderboard.mockRejectedValue(new Error('network'));
    await service.loadLeaderboard();

    expect(store.leaderboard.error).toBe('Failed to load leaderboard');
    expect(store.leaderboard.isLoading).toBe(false);
  });

  it('clears the previous error after a successful retry', async () => {
    const { store, getLeaderboard, service } = createContext();

    getLeaderboard.mockRejectedValueOnce(new Error('network'));
    getLeaderboard.mockResolvedValueOnce({ players: [] });
    await service.loadLeaderboard();
    await service.loadLeaderboard();

    expect(store.leaderboard.error).toBeUndefined();
  });
});
