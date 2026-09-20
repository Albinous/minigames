import type { ILeaderboard } from '../../core';
import './leaderboard.scss';

export function getLeaderBoardView(players: ILeaderboard[]): string {
  return `
    <div class="container">
      <h2 class="section-title">Top Players This Week</h2>
      <table class="leaderboard-table">
        <thead class="leaderboard-head">
          <tr class="leaderboard-head__row">
            <th scope="col" class="leaderboard-head__title">Rank</th>
            <th scope="col" class="leaderboard-head__title">Player</th>
            <th scope="col" class="leaderboard-head__title leaderboard-head__title-full">Games Played</th>
            <th scope="col" class="leaderboard-head__title leaderboard-head__title-short">Games</th>
            <th scope="col" class="leaderboard-head__title leaderboard-head__title-full">Total Score</th>
            <th scope="col" class="leaderboard-head__title leaderboard-head__title-short">Score</th>
            <th scope="col" class="leaderboard-head__title">Streak</th>
            <th scope="col" class="leaderboard-head__title">Favorite Game</th>
          </tr>
        </thead>

            <tbody class="leaderboard-players">
              ${players.map((playerData) => getPlayerView(playerData)).join('')}
            </tbody>
      </table>
    </div>
  `;
}

function getPlayerView(player: ILeaderboard): string {
  return `
    <tr class="leaderboard-player">
      <td class="leaderboard-player__item leaderboard-player__rank">#${player.rank}</td>
      <td class="leaderboard-player__item leaderboard-player__name">
        <div class="leaderboard-player__initials">
          ${getPlayerInitials(player.playerName)}
        </div>
        <h3 class="leaderboard-player__title">
          ${player.playerName}
        </h3>
      </td>
      <td class="leaderboard-player__item leaderboard-player__games">${player.gamesPlayed}</td>
      <td class="leaderboard-player__item leaderboard-player__score">
        ${formatTotalScore(player.totalScore)}
      </td>
      <td class="leaderboard-player__item leaderboard-player__streak">
        <span class="leaderboard-player__streak-value">🔥 ${player.streakDays}</span>
        <span class="leaderboard-player__streak-full"> days</span>
        <span class="leaderboard-player__streak-short">d</span>
      </td>
      <td class="leaderboard-player__item leaderboard-player__favourite">
        <p class="leaderboard-player__favourite-text">${player.favoriteGameName}</p>
      </td>
    </tr>
  `;
}

function getPlayerInitials(playerName: string): string | undefined {
  const letters = playerName.match(/[A-Z]/g);
  if (!letters) return;
  return letters.join('');
}

function formatTotalScore(totalScore: number): string {
  return totalScore.toLocaleString('en-IN');
}
