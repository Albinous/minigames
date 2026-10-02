import { getLeaderBoardView } from './leaderboard.view';
import type { ILeaderboard, LeaderboardService, Store } from '../../core';

export class LeaderBoard {
  private readonly store: Store;
  private readonly leaderboardService: LeaderboardService;

  constructor(store: Store, leaderboardService: LeaderboardService) {
    this.store = store;
    this.leaderboardService = leaderboardService;
  }

  private async load(): Promise<void> {
    await this.leaderboardService.loadLeaderboard();
  }

  public get players(): ILeaderboard[] {
    return this.store.leaderboard.data?.data ?? [];
  }

  public async render(): Promise<HTMLElement> {
    await this.load();
    const leaderboard: HTMLElement = document.createElement('section');
    const template: string = getLeaderBoardView(this.players);

    leaderboard.className = 'leaderboard';
    leaderboard.innerHTML = template;

    return leaderboard;
  }
}
