import './home-page.scss';

export function getHomePageView(): string {
  return `
    <section class="hero">
      <div class="container">
        <div class="hero-main">
          <h1 class="hero-title">Take a Short Break & Have Fun</h1>
          <p class="hero-text">
            Discover hundreds of curated casual mini-games. Play instantly in your browser —
            puzzle, match 3, farm, and board classics.
          </p>
          <button class="btn btn-primary hero-btn">Browse Library</button>
        </div>
      </div>
    </section>
  `;
}
