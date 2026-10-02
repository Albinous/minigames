import type { GamesService, LeaderboardService, Store } from '../../core';
import { LeaderBoard, Slider } from '../../features';
import { getHomePageView } from './home-page.view';

export class HomePage {
  private readonly store: Store;
  private readonly gamesService: GamesService;
  private readonly leaderboardService: LeaderboardService;
  private readonly onDetailsClick: (slug: string) => void;

  constructor(
    store: Store,
    gamesService: GamesService,
    leaderboardService: LeaderboardService,
    onDetailsClick: (slug: string) => void,
  ) {
    this.store = store;
    this.gamesService = gamesService;
    this.leaderboardService = leaderboardService;
    this.onDetailsClick = onDetailsClick;
  }

  public async render(): Promise<HTMLElement> {
    const main: HTMLElement = document.createElement('main');

    main.className = 'main';
    main.innerHTML = getHomePageView();

    const slider = new Slider(this.store, this.gamesService, this.onDetailsClick);
    const sliderPlaceholder = main.querySelector('.slider-placeholder');

    const leaderboard = new LeaderBoard(this.store, this.leaderboardService);
    const leaderboardPlaceholder = main.querySelector('.leaderboard-placeholder');

    sliderPlaceholder?.replaceWith(await slider.render());
    leaderboardPlaceholder?.replaceWith(await leaderboard.render());
    return main;
  }
}
