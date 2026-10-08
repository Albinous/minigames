import { getLeaderBoardView } from './leaderboard.view';
import type { ILeaderboard, LeaderboardService, Store } from '../../core';
import { LeaderboardSkeleton } from './leaderboard-skeleton';
import { EmptyState, ErrorState } from '../../components';
import { Snackbar } from '../../components/snackbar/snackbar';

export class LeaderBoard {
  private readonly store: Store;
  private readonly leaderboardService: LeaderboardService;

  private readonly errorState = new ErrorState();
  private readonly emptyState = new EmptyState();
  private readonly skeleton = new LeaderboardSkeleton();
  private readonly snackbar = new Snackbar();

  constructor(store: Store, leaderboardService: LeaderboardService) {
    this.store = store;
    this.leaderboardService = leaderboardService;
  }

  private async load(): Promise<void> {
    await this.leaderboardService.loadLeaderboard();

    if (this.store.leaderboard.error) {
      this.snackbar.show('Failed to load leaderboard', 'error');
    } else {
      this.snackbar.show('Leaderboard loaded successfully', 'success');
    }
  }

  private renderState(container: HTMLElement): void {
    if (this.store.leaderboard.isLoading) {
      container.replaceChildren(this.skeleton.render());
      return;
    }

    if (this.store.leaderboard.error) {
      container.replaceChildren(
        this.errorState.render(this.store.leaderboard.error, () => this.retryLoad(container)),
      );
      return;
    }

    const players = this.store.leaderboard.data?.data;

    if (!players || players.length === 0) {
      container.replaceChildren(this.emptyState.render());
      return;
    }

    container.innerHTML = getLeaderBoardView(players);
  }

  private async retryLoad(container: HTMLElement): Promise<void> {
    const loadPromise = this.load();

    this.renderState(container);

    await loadPromise;

    this.renderState(container);
  }

  public async render(): Promise<HTMLElement> {
    const leaderboard = document.createElement('section');

    leaderboard.className = 'leaderboard';

    const loadPromise = this.load();

    this.store.leaderboard.isLoading = true;
    this.renderState(leaderboard);

    void loadPromise.then(() => {
      this.renderState(leaderboard);
    });

    return leaderboard;
  }

  public get players(): ILeaderboard[] {
    return this.store.leaderboard.data?.data ?? [];
  }
}
