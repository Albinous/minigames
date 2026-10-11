import './header.scss';

export function getHeaderView(): string {
  return `
      <div class="container header-container">
      <button
                class="header-close"
                type="button"
                aria-label="Close menu"
              >
                ×
              </button>
        <div class="header-wrapper">
          <div class="header-main">
            <nav class="nav">
              <ul class="nav-menu">
                <li class="nav-menu__item">
                  <a href="/" class="nav-menu__link active" data-route="/">Home</a>
                </li>
                <li class="nav-menu__item">
                  <a href="/" class="nav-menu__link" data-route="/library">Library</a>
                </li>
                <li class="nav-menu__item">
                  <a href="/" class="nav-menu__link">Tournaments</a>
                </li>
                <li class="nav-menu__item">
                  <a href="/" class="nav-menu__link">Community</a>
                </li>
              </ul>
            </nav>
            <div class="header-btns">
              <div class="header-auth">
              </div>
              <button 
                class="header-burger"
                type="button"
                aria-label="Open menu"
              >
                <span class="header-burger__line"></span>
                <span class="header-burger__line"></span>
                <span class="header-burger__line"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
  `;
}

export const getGuestControlView = (): string => {
  return `
    <button class="btn header-btn header-btn__login" data-mode="login">Log In</button>
    <button class="btn btn-primary header-btn header-btn__signup" data-mode="register">Sign Up</button>
  `;
};
