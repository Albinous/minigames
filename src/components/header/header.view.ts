export function getHeaderView(): string {
  return `
      <div class="container">
        <div class="header-wrapper">
          <a href="#" class="header-logo">
            <img src="src/assets/icons/logo.svg" alt="" class="header-logo__icon" />
            <span class="header-logo__title">MiniGames</span>
          </a>
          <div class="header-main">
            <nav class="nav">
              <ul class="nav-menu">
                <li class="nav-menu__item">
                  <a href="#" class="nav-menu__link">Home</a>
                </li>
                <li class="nav-menu__item">
                  <a href="#" class="nav-menu__link">Library</a>
                </li>
                <li class="nav-menu__item">
                  <a href="#" class="nav-menu__link">Tournaments</a>
                </li>
                <li class="nav-menu__item">
                  <a href="#" class="nav-menu__link">Community</a>
                </li>
              </ul>
            </nav>
            <button class="header-btn__login">Log In</button>
            <button class="header-btn__signup">Sign Up</button>
          </div>
        </div>
      </div>
  `;
}