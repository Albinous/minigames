import { LeaderBoard, Slider } from '../../features';
import { getHomePageView } from './home-page.view';

export class HomePage {
  public render(): HTMLElement {
    const main: HTMLElement = document.createElement('main');

    main.className = 'main';
    main.innerHTML = getHomePageView();

    const slider = new Slider();
    const sliderPlaceholder = main.querySelector('.slider-placeholder');

    const leaderboard = new LeaderBoard();
    const leaderboardPlaceholder = main.querySelector('.leaderboard-placeholder');

    sliderPlaceholder?.replaceWith(slider.render());
    leaderboardPlaceholder?.replaceWith(leaderboard.render());
    return main;
  }
}
