import { GAMES_BASE_URL } from '../../constants';
import type { GameResponse, GamesQuery, GamesResponse } from '../../types';
import { Api } from './api';

export interface FavoriteResponse {
  data: { isFavorited: boolean; likesCount: number };
}

export class GamesApi extends Api {
  public async getGames({
    page,
    limit,
    category,
    sort,
    featured,
  }: GamesQuery): Promise<GamesResponse> {
    const parameters = new URLSearchParams({
      ...(page !== undefined && { page: String(page) }),
      ...(limit !== undefined && { limit: String(limit) }),
      ...(category !== undefined && { category: category }),
      ...(sort !== undefined && { sort: sort }),
      ...(featured !== undefined && { featured: String(featured) }),
    });

    return this.get(`${GAMES_BASE_URL}?${parameters.toString()}`);
  }

  public async getGameDetails(gameSlug: string, userEmail?: string): Promise<GameResponse> {
    const query = userEmail === undefined ? '' : `?userEmail=${encodeURIComponent(userEmail)}`;

    return this.get(`${GAMES_BASE_URL}/${gameSlug}${query}`);
  }

  public async toggleFavorite(gameSlug: string, userEmail: string): Promise<FavoriteResponse> {
    return this.post(`${GAMES_BASE_URL}/${gameSlug}/favorite`, { userEmail });
  }
}
