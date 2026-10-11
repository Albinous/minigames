import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL, GAMES_BASE_URL } from '../../constants';
import type { GamesQuery } from '../../types';
import { GamesApi } from './games-api';

const stubFetch = () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GamesApi.getGames', () => {
  it('puts every provided option into the query string', async () => {
    const fetchMock = stubFetch();
    const query = {
      page: 2,
      limit: 10,
      category: 'cozy',
      sort: 'newest',
      featured: true,
    } as unknown as GamesQuery;

    await new GamesApi().getGames(query);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}${GAMES_BASE_URL}?page=2&limit=10&category=cozy&sort=newest&featured=true`,
    );
  });

  it('omits options that are not provided', async () => {
    const fetchMock = stubFetch();

    await new GamesApi().getGames({ page: 3 } as unknown as GamesQuery);

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}${GAMES_BASE_URL}?page=3`);
  });

  it('keeps falsy values such as page 0 and featured false', async () => {
    const fetchMock = stubFetch();

    await new GamesApi().getGames({ page: 0, featured: false } as unknown as GamesQuery);

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}${GAMES_BASE_URL}?page=0&featured=false`,
    );
  });

  it('sends no parameters for an empty query', async () => {
    const fetchMock = stubFetch();

    await new GamesApi().getGames({} as GamesQuery);

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}${GAMES_BASE_URL}?`);
  });
});

describe('GamesApi.getGameDetails', () => {
  it('requests the game by slug', async () => {
    const fetchMock = stubFetch();

    await new GamesApi().getGameDetails('tiny-glade');

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}${GAMES_BASE_URL}/tiny-glade`);
  });
});
