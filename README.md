# MiniGames

MiniGames is a single-page web application for discovering cozy games. Browse the catalog, explore categories, check the leaderboard, open game details and read comments. Registered users can log in to interact with the content.

Built with vanilla TypeScript, Vite and SCSS (no UI framework).

## Features

- Home page with a games slider and a leaderboard
- Library page with categories
- Game details dialog with comments
- Registration and login with email and password (Firebase Authentication) with real-time form validation
- Client-side app session that persists across reloads and expires automatically
- Snackbar notifications for errors and important events

## Tech stack

TypeScript, Vite, Sass, Firebase Authentication, ESLint, Prettier, Husky, Commitlint

## Getting started

### Prerequisites

- Node.js (a current LTS version) and npm
- A Firebase project with the **Email/Password** sign-in method enabled

### Installation

```bash
git clone https://github.com/Albinous/minigames.git
cd minigames
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in the values from your Firebase web app settings:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

### Run locally

```bash
npm run dev
```

Open the address printed in the terminal (by default `http://localhost:5173`).

### Other scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run build`        | Type-check and build for production     |
| `npm run preview`      | Preview the production build locally    |
| `npm run lint`         | Run ESLint                              |
| `npm run format`       | Format the code with Prettier           |
| `npm run format:check` | Check formatting without changing files |

## Session storage

After a successful login the app stores a session in `localStorage` under the key:

```
minigames:albinous:app-session
```

The stored JSON contains `displayName`, `email`, `authenticatedAt` (a `Date.now()` timestamp) and `avatarUrl` (only if available). Passwords and Firebase tokens are never stored.

The session lasts 5 minutes from login. Reloading the page does not extend it. When the session expires or the stored data is invalid, the key is removed, the user is signed out and the app returns to Guest Mode.
