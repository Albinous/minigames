import type { CategoriesResponse, CommentsResponse, GamesResponse, LeaderboardResponse } from "../types";
import type { AppState, ResourceState } from "./app-state";
import { initialState } from "./initial-state";

export class Store {
  private state: AppState = initialState;

  public get games(): ResourceState<GamesResponse> {
    return this.state.games;
  }

  public get categories(): ResourceState<CategoriesResponse> {
    return this.state.categories;
  }

  public get comments(): ResourceState<CommentsResponse> {
    return this.state.comments;
  }

  public get leaderboard(): ResourceState<LeaderboardResponse> {
    return this.state.leaderboard;
  }
}