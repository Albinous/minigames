export function getBurgerMenuView(): string {
  return `
    <div class="burger-menu__header">
      <a class="burger-menu__logo" href="/"></a>

      <button
        class="burger-menu__close"
        type="button"
        aria-label="Close menu"
      >
        ×
      </button>
    </div>

    <nav class="burger-menu__nav" aria-label="Mobile navigation">
      <ul>
        <li>
          <a class="burger-menu__link burger-menu__link-active" href="/">
            Home
          </a>
        </li>
        <li>
          <a class="burger-menu__link" href="/">
            Library
          </a>
        </li>
        <li>
          <a class="burger-menu__link" href="/">
            Tournaments
          </a>
        </li>
        <li>
          <a class="burger-menu__link" href="/">
            Community
          </a>
        </li>
      </ul>
    </nav>

    <div class="burger-menu__actions">
      <button class="btn header-btn header-btn__login burger-menu__login" type="button">
        Log In
      </button>

      <button class="btn btn-primary header-btn header-btn__signup burger-menu__signup" type="button">
        Sign Up
      </button>
    </div>
  `;
}