import { GAMES_BASE_URL } from '../../constants';
import type { GameResponse, GamesQuery, GamesResponse } from '../../types';
import { Api } from './api';

export class GamesApi extends Api {
  public async getGames({ page, limit, category, sort }: GamesQuery): Promise<GamesResponse> {
    const parameters = new URLSearchParams({
      ...(page !== undefined && { page: String(page) }),
      ...(limit !== undefined && { limit: String(limit) }),
      ...(category !== undefined && { category: category }),
      ...(sort !== undefined && { sort: sort }),
    });

    return this.get(`${GAMES_BASE_URL}?${parameters.toString()}`);
  }

  public async getFeatured(): Promise<GamesResponse> {
    const parameters = new URLSearchParams({
      featured: 'true',
    });
    return this.get(`${GAMES_BASE_URL}?${parameters.toString()}`);
  }

  public async getGameDetails(gameSlug: string): Promise<GameResponse> {
    return this.get(`${GAMES_BASE_URL}/${gameSlug}`);
  }
}
