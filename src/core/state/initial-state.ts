import type { CommentsResponse, CategoriesResponse, GamesResponse, LeaderboardResponse } from "../types";
import type { AppState, ResourceState } from "./app-state";

const createInitialResourceState = <T>(): ResourceState<T> =>  ({
    data: undefined,
    isLoading: false,
    error: undefined
});

export const initialState: AppState = {
  games: createInitialResourceState<GamesResponse>(),
  categories: createInitialResourceState<CategoriesResponse>(),
  comments: createInitialResourceState<CommentsResponse>(),
  leaderboard: createInitialResourceState<LeaderboardResponse>(),
}