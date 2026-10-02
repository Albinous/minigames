import type { IGame, IGameDetails } from '../../services';
import type { Category } from '../category';
import type { SortOption } from '../sort';

export interface GamesResponse {
  data: IGame[];
  meta: GamesMeta | undefined;
}

export interface GameResponse {
  data: IGameDetails;
}

export interface GamesMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  appliedFilter: AppliedFilter;
}

export interface AppliedFilter {
  category: Category;
  sort: SortOption;
}

export interface GamesQuery {
  page?: number;
  limit?: number;
  category?: Category;
  sort?: SortOption;
  featured?: boolean;
}
