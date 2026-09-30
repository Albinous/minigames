import type { LeaderboardResponse } from '../../types/api/leaderboard';
import { Api } from './api';

export class LeaderboardApi extends Api {
  public async getLeaderboard(): Promise<LeaderboardResponse> {
    return this.get(`/leaderboard`);
  }
}
