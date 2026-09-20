import './home-page.scss';

export function getHomePageView(): string {
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-main">
          <h1 class="hero-title">Take a Short Break & Have Fun</h1>
          <p class="hero-text full">
            Discover hundreds of curated casual mini-games. Play instantly in your browser —
            puzzle, match 3, farm, and board classics.
          </p>
          <p class="hero-text short">
            Discover hundreds of curated casual mini-games right in your browser.
          </p>
          <button class="btn btn-primary hero-btn">Browse Library</button>
        </div>
      </div>
    </section>

    <div class="slider-placeholder"></div>

    <div class="leaderboard-placeholder"></div>

    <section class="developer">
      <div class="container">
        <div class="developer-wrapper">
          <img src="src/assets/images/developer-img.jpg" alt="illustration site" class="developer-img" />
          <div class="developer-info">
            <h2 class="developer-title">Are You a Game Developer?</h2>
            <p class="developer-text">
              Want to see your game on MiniGames? We're always looking for fun,<br>engaging mini games to
              add to our platform. Submit your game<br>and reach thousands of players!
            </p>
            <button class="btn btn-primary developer-btn">Submit form</button>
            <span class="developer-contact"> or contact us at developers@minigames.com </span>
          </div>
        </div>
      </div>
    </section>
  `;
}
