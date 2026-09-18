import './logo.scss';

export function getLogoView(): string {
  return `
    <img src="src/assets/icons/logo.svg" alt="minigames logo" class="logo-icon" />
    <h2 class="logo-title">MiniGames</h2>
  `;
}
