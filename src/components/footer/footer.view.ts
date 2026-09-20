import './footer.scss';

export function getFooterView(): string {
  return `
    <div class="container">
      <div class="footer-wrapper">
        <div class="footer-left">
          <p class="footer-descr">
            Take a short break and have fun. Hundreds of curated casual mini-games right in your web
            browser. No download required.
          </p>
        </div>
        <div class="footer-right">
          <nav class="footer-nav">
            <h3 class="footer-title">Explore</h3>
            <ul class="footer-nav__menu">
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Home</a>
              </li>
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Library</a>
              </li>
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Categories</a>
              </li>
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Tournaments</a>
              </li>
            </ul>
          </nav>
          <nav class="footer-nav">
            <h3 class="footer-title">Company</h3>
            <ul class="footer-nav__menu">
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">About Us</a>
              </li>
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Contact</a>
              </li>
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Privacy Policy</a>
              </li>
              <li class="footer-nav__menu-item">
                <a href="#" class="footer-nav__menu-link">Terms of Service</a>
              </li>
            </ul>
          </nav>
          <div class="footer-community">
            <h3 class="footer-title">Community</h3>
            <ul class="footer-community__links">
              <li class="footer-community__item">
                <a href="#" class="footer-community__link">
                  <img src="src/assets/icons/share.svg" class="footer-community__img">
                </a>
              </li>
              <li class="footer-community__item">
                <a href="#" class="footer-community__link">
                  <img src="src/assets/icons/chat.svg" class="footer-community__img">
                </a>
              </li>
              <li class="footer-community__item">
                <a href="#" class="footer-community__link">
                  <img src="src/assets/icons/rss_feed.svg" class="footer-community__img">
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-info">
        <span class="footer-text">© 2026 MiniGames. All rights reserved.</span>
        <a href="#" class="footer-info__link">
          <img src="src/assets/icons/rs-logo.svg" alt="rss logo" class="footer-info__logo" />
          <h4 class="footer-info__title">RS School</h4>
        </a>
        <a href="#" class="footer-info__link">
          <img src="src/assets/icons/github-icon.svg" alt="github logo" class="footer-info__logo" />
          <h4 class="footer-info__title">@Albinous</h4>
        </a>
        <span class="footer-text footer-designed"> Designed with love </span>
      </div>
    </div>
  `;
}
