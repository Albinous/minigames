import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from '../../constants';
import { LeaderboardApi } from './leaderboard-api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LeaderboardApi.getLeaderboard', () => {
  it('requests the leaderboard endpoint and returns its JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ players: [] }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await new LeaderboardApi().getLeaderboard();

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/leaderboard`);
    expect(result).toEqual({ players: [] });
  });
});
