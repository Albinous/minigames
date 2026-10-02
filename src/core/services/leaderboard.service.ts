import type { Store } from '../state';
import type { LeaderboardApi } from './api';

export class LeaderboardService {
  private readonly store: Store;
  private readonly api: LeaderboardApi;

  constructor(store: Store, leaderboardApi: LeaderboardApi) {
    this.store = store;
    this.api = leaderboardApi;
  }

  public async loadLeaderboard(): Promise<void> {
    this.store.leaderboard.isLoading = true;

    try {
      const response = await this.api.getLeaderboard();

      this.store.leaderboard.data = response;
    } catch {
      this.store.leaderboard.error = 'Failed to load leaderboard';
    } finally {
      this.store.leaderboard.isLoading = false;
    }
  }
}
