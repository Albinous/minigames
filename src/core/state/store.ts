import type {
  AppSession,
  CategoriesResponse,
  CommentsResponse,
  GameResponse,
  GamesResponse,
  LeaderboardResponse,
} from '../types';
import type { AppState, ResourceState } from './app-state';
import { initialState } from './initial-state';

export class Store {
  private state: AppState = structuredClone(initialState);

  private readonly listeners = new Set<() => void>();

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public setSession(session: AppSession | undefined): void {
    this.state = { ...this.state, session };
    this.notify();
  }

  public get session(): AppSession | undefined {
    return this.state.session;
  }

  public get isAuthenticated(): boolean {
    return Boolean(this.state.session);
  }

  public get games(): ResourceState<GamesResponse> {
    return this.state.games;
  }

  public get game(): ResourceState<GameResponse> {
    return this.state.game;
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
