import { getLeaderBoardView } from "./leaderboard.view";
import playersData from '../../data/leaderboard.json'

export class LeaderBoard {
  public render(): HTMLElement {
    const players = playersData.data;
    const leaderboard = document.createElement('section');
    leaderboard.className = 'leaderboard';
    leaderboard.innerHTML = getLeaderBoardView(players);

    return leaderboard;
  }
}