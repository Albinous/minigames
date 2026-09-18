import './footer.scss';

export function getFooterView(): string {
  return `
    <div class="container">
      <div class="footer-wrapper">
        <div class="footer-left">
          <div class="footer-descr">
            Take a short break and have fun. Hundreds of curated casual mini-games right in your web
            browser. No download required.
          </div>
        </div>
        <div class="footer-right">
          <nav class="nav">
            <h3 class="footer-title">Explore</h3>
            <ul class="nav-menu">
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Home</a>
              </li>
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Library</a>
              </li>
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Categories</a>
              </li>
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Tournaments</a>
              </li>
            </ul>
          </nav>
          <nav class="nav">
            <h3 class="footer-title">Company</h3>
            <ul class="nav-menu">
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">About Us</a>
              </li>
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Contact</a>
              </li>
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Privacy Policy</a>
              </li>
              <li class="nav-menu__item">
                <a href="#" class="nav-menu__link">Terms of Service</a>
              </li>
            </ul>
          </nav>
          <div class="footer-community">
            <h3 class="footer-title">Community</h3>
            <ul class="footer-community__links">
              <li class="footer-community__item">
                <a href="#" class="footer-community__link">
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 16C10.8056 16 10.2153 15.7569 9.72917 15.2708C9.24306 14.7847 9 14.1944 9 13.5C9 13.375 9.02778 13.1736 9.08333 12.8958L4.14583 9.875C3.92361 10.0694 3.67361 10.2222 3.39583 10.3333C3.11806 10.4444 2.81944 10.5 2.5 10.5C1.80556 10.5 1.21528 10.2569 0.729167 9.77083C0.243056 9.28472 1.78814e-07 8.69444 1.78814e-07 8C1.78814e-07 7.30556 0.243056 6.71528 0.729167 6.22917C1.21528 5.74305 1.80556 5.5 2.5 5.5C2.81944 5.5 3.11806 5.55555 3.39583 5.66667C3.67361 5.77778 3.92361 5.93055 4.14583 6.125L9.08333 3.10417C9.05556 3.00694 9.03472 2.90972 9.02083 2.8125C9.00694 2.71528 9 2.61111 9 2.5C9 1.80556 9.24306 1.21528 9.72917 0.729166C10.2153 0.243055 10.8056 -7.15256e-07 11.5 -7.15256e-07C12.1944 -7.15256e-07 12.7847 0.243055 13.2708 0.729166C13.7569 1.21528 14 1.80556 14 2.5C14 3.19444 13.7569 3.78472 13.2708 4.27083C12.7847 4.75694 12.1944 5 11.5 5C11.1806 5 10.8819 4.94444 10.6042 4.83333C10.3264 4.72222 10.0764 4.56944 9.85417 4.375L4.91667 7.39583C4.94444 7.49306 4.96528 7.59028 4.97917 7.6875C4.99306 7.78472 5 7.88889 5 8C5 8.11111 4.99306 8.21528 4.97917 8.3125C4.96528 8.40972 4.94444 8.50694 4.91667 8.60417L9.85417 11.625C10.0764 11.4306 10.3264 11.2778 10.6042 11.1667C10.8819 11.0556 11.1806 11 11.5 11C12.1944 11 12.7847 11.2431 13.2708 11.7292C13.7569 12.2153 14 12.8056 14 13.5C14 14.1944 13.7569 14.7847 13.2708 15.2708C12.7847 15.7569 12.1944 16 11.5 16ZM11.5 14.5C11.7778 14.5 12.0139 14.4028 12.2083 14.2083C12.4028 14.0139 12.5 13.7778 12.5 13.5C12.5 13.2222 12.4028 12.9861 12.2083 12.7917C12.0139 12.5972 11.7778 12.5 11.5 12.5C11.2222 12.5 10.9861 12.5972 10.7917 12.7917C10.5972 12.9861 10.5 13.2222 10.5 13.5C10.5 13.7778 10.5972 14.0139 10.7917 14.2083C10.9861 14.4028 11.2222 14.5 11.5 14.5ZM2.5 9C2.77778 9 3.01389 8.90278 3.20833 8.70833C3.40278 8.51389 3.5 8.27778 3.5 8C3.5 7.72222 3.40278 7.48611 3.20833 7.29167C3.01389 7.09722 2.77778 7 2.5 7C2.22222 7 1.98611 7.09722 1.79167 7.29167C1.59722 7.48611 1.5 7.72222 1.5 8C1.5 8.27778 1.59722 8.51389 1.79167 8.70833C1.98611 8.90278 2.22222 9 2.5 9ZM11.5 3.5C11.7778 3.5 12.0139 3.40278 12.2083 3.20833C12.4028 3.01389 12.5 2.77778 12.5 2.5C12.5 2.22222 12.4028 1.98611 12.2083 1.79167C12.0139 1.59722 11.7778 1.5 11.5 1.5C11.2222 1.5 10.9861 1.59722 10.7917 1.79167C10.5972 1.98611 10.5 2.22222 10.5 2.5C10.5 2.77778 10.5972 3.01389 10.7917 3.20833C10.9861 3.40278 11.2222 3.5 11.5 3.5Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </li>
              <li class="footer-community__item">
                <a href="#" class="footer-community__link">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 10H10V8.5H3V10ZM3 7.25H13V5.75H3V7.25ZM3 4.5H13V3H3V4.5ZM1.78814e-07 16V1.5C1.78814e-07 1.08333 0.145833 0.729166 0.4375 0.437499C0.729167 0.145832 1.08333 -7.15256e-07 1.5 -7.15256e-07H14.5C14.9167 -7.15256e-07 15.2708 0.145832 15.5625 0.437499C15.8542 0.729166 16 1.08333 16 1.5V11.5C16 11.9167 15.8542 12.2708 15.5625 12.5625C15.2708 12.8542 14.9167 13 14.5 13H3L1.78814e-07 16ZM2.375 11.5H14.5V1.5H1.5V12.375L2.375 11.5ZM1.5 11.5V1.5V11.5Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </li>
              <li class="footer-community__item">
                <a href="#" class="footer-community__link">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 14C1.08333 14 0.729167 13.8542 0.4375 13.5625C0.145834 13.2708 1.19209e-07 12.9167 1.19209e-07 12.5C1.19209e-07 12.0833 0.145834 11.7292 0.4375 11.4375C0.729167 11.1458 1.08333 11 1.5 11C1.91667 11 2.27083 11.1458 2.5625 11.4375C2.85417 11.7292 3 12.0833 3 12.5C3 12.9167 2.85417 13.2708 2.5625 13.5625C2.27083 13.8542 1.91667 14 1.5 14ZM12 14C12 12.3333 11.6806 10.7778 11.0417 9.33333C10.4167 7.875 9.5625 6.60417 8.47917 5.52083C7.39583 4.4375 6.125 3.58333 4.66667 2.95833C3.22222 2.31944 1.66667 2 1.19209e-07 2V-4.76837e-07C1.94444 -4.76837e-07 3.75694 0.368055 5.4375 1.10417C7.13195 1.82639 8.61806 2.82639 9.89583 4.10417C11.1736 5.38194 12.1736 6.86805 12.8958 8.5625C13.6319 10.2431 14 12.0556 14 14H12ZM7 14C7 13.0278 6.81944 12.1181 6.45833 11.2708C6.09722 10.4236 5.59722 9.68056 4.95833 9.04167C4.31944 8.40278 3.57639 7.90278 2.72917 7.54167C1.88194 7.18056 0.972222 7 1.19209e-07 7V5C1.26389 5 2.4375 5.23611 3.52083 5.70833C4.60417 6.16667 5.55556 6.80556 6.375 7.625C7.19444 8.44444 7.83333 9.39583 8.29167 10.4792C8.76389 11.5625 9 12.7361 9 14H7Z"
                      fill="white"
                    />
                  </svg>
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
          <h4 class="footer-info__title">RS School</h4>
        </a>
        <span class="footer-text"> Designed with love </span>
      </div>
    </div>
  `
}