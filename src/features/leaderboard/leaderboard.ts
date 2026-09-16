import { getLeaderBoardView } from "./leaderboard.view";

export class LeaderBoard {
  public render(): HTMLElement {
    const leaderboard = document.createElement('section');
    leaderboard.className = 'leaderboard';
    leaderboard.innerHTML = getLeaderBoardView();

    return leaderboard;
  }
}