import type { ILeaderboard } from "../../core"

export function getLeaderBoardView(players: ILeaderboard[]): string {
  return `
    <div class="container">
      <h2 class="section-title">Top Players This Week</h2>
      <table class="leaderboard-tabel">
        <thead class="leaderboard-head">
          <tr class="leaderboard-head__row">
            <th scope="col" class="leaderboard-head__title">Rank</th>
            <th scope="col" class="leaderboard-head__title">Player</th>
            <th scope="col" class="leaderboard-head__title">Games Played</th>
            <th scope="col" class="leaderboard-head__title">Total Score</th>
            <th scope="col" class="leaderboard-head__title">Streak</th>
            <th scope="col" class="leaderboard-head__title">Favorite Game</th>
          </tr>
        </thead>

            <tbody class="leaderboard-players">
              ${players.map(playerData => getPlayerView(playerData)).join('')}
            </tbody>
      </table>
    </div>
  `
}

function getPlayerView(player: ILeaderboard): string {
  return `
    <tr class="leaderboard-player">
      <td class="leaderboard-player__rank">${player.rank}</td>
      <td class="leaderboard-player__name">${player.playerName}</td>
      <td class="leaderboard-player__games">${player.gamesPlayed}</td>
      <td class="leaderboard-player__score">${player.totalScore}</td>
      <td class="leaderboard-player__streak">🔥 ${player.streakDays}</td>
      <td class="leaderboard-player__favourite">${player.favoriteGameName}</td>
    </tr>
  `
}