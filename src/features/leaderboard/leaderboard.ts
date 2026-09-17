import { getLeaderBoardView } from './leaderboard.view';
import playersData from '../../data/leaderboard.json';
import type { ILeaderboard } from '../../core';

export class LeaderBoard {
  public render(): HTMLElement {
    const players: ILeaderboard[] = playersData.data;
    const leaderboard: HTMLElement = document.createElement('section');
    const template: string = getLeaderBoardView(players);

    leaderboard.className = 'leaderboard';
    leaderboard.innerHTML = template;

    return leaderboard;
  }
}
