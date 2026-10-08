import type {
  CommentsResponse,
  CategoriesResponse,
  GamesResponse,
  LeaderboardResponse,
  GameResponse,
} from '../types';
import type { AppState, ResourceState } from './app-state';

const createInitialResourceState = <T>(): ResourceState<T> => ({
  data: undefined,
  isLoading: false,
  error: undefined,
});

export const initialState: AppState = {
  games: createInitialResourceState<GamesResponse>(),
  game: createInitialResourceState<GameResponse>(),
  categories: createInitialResourceState<CategoriesResponse>(),
  comments: createInitialResourceState<CommentsResponse>(),
  leaderboard: createInitialResourceState<LeaderboardResponse>(),
};
