import type { GamesQuery, GamesResponse } from '../../types';
import type { IGame } from '../models';
import { Api } from './api';

const GAMES_URL_API = '/games';

export class GamesApi extends Api {
  public async getGames({ page, limit, category, sort }: GamesQuery): Promise<GamesResponse> {
    const parameters = new URLSearchParams({
      ...(page !== undefined && { page: String(page) }),
      ...(limit !== undefined && { limit: String(limit) }),
      ...(category !== undefined && { category: category }),
      ...(sort !== undefined && { sort: sort }),
    });

    return this.get(`${GAMES_URL_API}?${parameters.toString()}`);
  }

  public async getFeatured(): Promise<GamesResponse> {
    const parameters = new URLSearchParams({
      featured: 'true',
    });
    return this.get(`${GAMES_URL_API}?${parameters.toString()}`);
  }

  public async getGameDetails(gameSlug: string): Promise<IGame> {
    return this.get(`${GAMES_URL_API}/${gameSlug}`);
  }
}
