import { describe, expect, it, vi } from 'vitest';
import { Store } from '../state';
import type { GamesQuery } from '../types';
import type { GamesApi } from './api';
import { GamesService } from './games.service';

const createContext = () => {
  const store = new Store();
  const getGames = vi.fn();
  const getGameDetails = vi.fn();
  const service = new GamesService(store, { getGames, getGameDetails } as unknown as GamesApi);

  return { store, getGames, getGameDetails, service };
};

const query = { page: 1 } as unknown as GamesQuery;

describe('GamesService.loadGames', () => {
  it('passes the query to the api and stores the response', async () => {
    const { store, getGames, service } = createContext();
    const response = { items: [] };

    getGames.mockResolvedValue(response);
    await service.loadGames(query);

    expect(getGames).toHaveBeenCalledWith(query);
    expect(store.games.data).toBe(response);
    expect(store.games.error).toBeUndefined();
    expect(store.games.isLoading).toBe(false);
  });

  it('is loading while the request is in flight', async () => {
    const { store, getGames, service } = createContext();
    let wasLoadingDuringRequest = false;

    getGames.mockImplementation(async () => {
      wasLoadingDuringRequest = store.games.isLoading;

      return {};
    });
    await service.loadGames(query);

    expect(wasLoadingDuringRequest).toBe(true);
    expect(store.games.isLoading).toBe(false);
  });

  it('stores an error when the request fails', async () => {
    const { store, getGames, service } = createContext();

    getGames.mockRejectedValue(new Error('network'));
    await service.loadGames(query);

    expect(store.games.error).toBe('Failed to load games');
    expect(store.games.isLoading).toBe(false);
  });

  it('clears the previous error after a successful retry', async () => {
    const { store, getGames, service } = createContext();

    getGames.mockRejectedValueOnce(new Error('network'));
    getGames.mockResolvedValueOnce({ items: [] });
    await service.loadGames(query);
    await service.loadGames(query);

    expect(store.games.error).toBeUndefined();
  });
});

describe('GamesService.loadGame', () => {
  it('requests the game by slug and stores the response', async () => {
    const { store, getGameDetails, service } = createContext();
    const response = { slug: 'tiny-glade' };

    getGameDetails.mockResolvedValue(response);
    await service.loadGame('tiny-glade');

    expect(getGameDetails).toHaveBeenCalledWith('tiny-glade', undefined);
    expect(store.game.data).toBe(response);
    expect(store.game.isLoading).toBe(false);
  });

  it('stores an error when the request fails', async () => {
    const { store, getGameDetails, service } = createContext();

    getGameDetails.mockRejectedValue(new Error('network'));
    await service.loadGame('tiny-glade');

    expect(store.game.error).toBe('Failed to load game details');
    expect(store.game.isLoading).toBe(false);
  });

  it('clears the previous error after a successful retry', async () => {
    const { store, getGameDetails, service } = createContext();

    getGameDetails.mockRejectedValueOnce(new Error('network'));
    getGameDetails.mockResolvedValueOnce({ slug: 'tiny-glade' });
    await service.loadGame('tiny-glade');
    await service.loadGame('tiny-glade');

    expect(store.game.error).toBeUndefined();
  });
});
