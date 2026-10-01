import type { Store } from '../state';
import type { GamesQuery } from '../types';
import type { GamesApi } from './api';

export class GamesService {
  private readonly store: Store;
  private readonly api: GamesApi;

  constructor(store: Store, gamesApi: GamesApi) {
    this.store = store;
    this.api = gamesApi;
  }

  public async loadGames(query: GamesQuery): Promise<void> {
    this.store.games.isLoading = true;

    try {
      const response = await this.api.getGames(query);

      this.store.games.data = response;
    } catch {
      this.store.games.error = 'Failed to load games';
    } finally {
      this.store.games.isLoading = false;
    }
  }
}