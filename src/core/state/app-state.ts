import type {
  CategoriesResponse,
  CommentsResponse,
  GameResponse,
  GamesResponse,
  LeaderboardResponse,
} from '../types';

export interface ResourceState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | undefined;
}

export interface AppState {
  games: ResourceState<GamesResponse>;
  game: ResourceState<GameResponse>;
  categories: ResourceState<CategoriesResponse>;
  comments: ResourceState<CommentsResponse>;
  leaderboard: ResourceState<LeaderboardResponse>;
}
