import type { IGame } from '../../services';
import type { Category } from '../category';
import type { SortOption } from '../sort';

export interface GamesResponse {
  items: IGame[];
  meta: GamesMeta;
}

export interface GamesMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  appliedFilter: AppliedFilter;
}

export interface AppliedFilter {
  category: IGame['category'];
  sort: SortOption;
}

export interface GamesQuery {
  page?: number;
  limit?: number;
  category?: Category;
  sort?: SortOption;
}
