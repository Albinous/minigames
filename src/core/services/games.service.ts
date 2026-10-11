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
    this.store.games.error = undefined;

    try {
      const response = await this.api.getGames(query);

      this.store.games.data = response;
    } catch {
      this.store.games.error = 'Failed to load games';
    } finally {
      this.store.games.isLoading = false;
    }
  }

  public async loadGame(slug: string): Promise<void> {
    this.store.game.isLoading = true;
    this.store.game.error = undefined;

    try {
      const response = await this.api.getGameDetails(slug, this.store.session?.email);

      this.store.game.data = response;
    } catch {
      this.store.game.error = 'Failed to load game details';
    } finally {
      this.store.game.isLoading = false;
    }
  }

  public async toggleFavorite(slug: string): Promise<void> {
    const email = this.store.session?.email;

    if (!email) throw new Error('Authentication is required');

    const response = await this.api.toggleFavorite(slug, email);
    const game = this.store.game.data?.data;

    if (game) {
      game.isLikedByCurrentUser = response.data.isFavorited;
      game.likesCount = response.data.likesCount;
    }
  }
}
