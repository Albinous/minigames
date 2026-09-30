import type { IGame } from '../../services';
import type { Category } from '../category';
import type { SortOption } from '../sort';

export interface GamesResponse {
  items: IGame[];
  meta: GamesMeta | undefined;
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
}
