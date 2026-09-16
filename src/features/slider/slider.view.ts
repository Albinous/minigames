import './slider.scss';
import type { IGame } from '../../core';
import { getGameCardView } from './game-card';

export function getSliderView(games: IGame[]): string {
  const cards = games.filter(game => game.featured === true).map(game => getGameCardView(game)).join('')
  return `
    <div class="container">
      <div class="games-header">
        <h2 class="section-title">New Games</h2>
        <div class="games-arrows">
          <button class="btn btn-secondary games-arrow">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.825 9L9.425 14.6L8 16L1.19209e-07 8L8 -9.53674e-07L9.425 1.4L3.825 7H16V9H3.825Z"
                fill="#242145"
              />
            </svg>
          </button>

          <button class="btn btn-primary games-arrow">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.175 9H1.19209e-07V7H12.175L6.575 1.4L8 -9.53674e-07L16 8L8 16L6.575 14.6L12.175 9Z"
                fill="#242145"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="games-slider">
        ${cards}
      </div>
    </div>
    `
}