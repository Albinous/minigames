import { describe, expect, it, vi } from 'vitest';
import type { GamesService, LeaderboardService } from '../../core';
import { Store } from '../../core/state';
import { HomePage } from './home-page';

const { created } = vi.hoisted(() => ({
  created: { slider: [] as unknown[][], leaderboard: [] as unknown[][] },
}));

vi.mock('../../features', () => ({
  Slider: class Slider {
    public constructor(...arguments_: unknown[]) {
      created.slider.push(arguments_);
    }

    public render(): HTMLElement {
      const element = document.createElement('section');

      element.className = 'slider';

      return element;
    }
  },
  LeaderBoard: class LeaderBoard {
    public constructor(...arguments_: unknown[]) {
      created.leaderboard.push(arguments_);
    }

    public async render(): Promise<HTMLElement> {
      const element = document.createElement('section');

      element.className = 'leaderboard';

      return element;
    }
  },
}));

vi.mock('./home-page.view', () => ({
  getHomePageView: (): string =>
    '<div class="slider-placeholder"></div><div class="leaderboard-placeholder"></div>',
}));

const createPage = () => {
  const store = new Store();
  const gamesService = {} as unknown as GamesService;
  const leaderboardService = {} as unknown as LeaderboardService;
  const onDetailsClick = vi.fn();
  const page = new HomePage(store, gamesService, leaderboardService, onDetailsClick);

  return { store, gamesService, leaderboardService, onDetailsClick, page };
};

describe('HomePage', () => {
  it('renders the main element', async () => {
    const main = await createPage().page.render();

    expect(main.tagName).toBe('MAIN');
    expect(main.className).toBe('main');
  });

  it('puts the slider and the leaderboard in place of their placeholders', async () => {
    const main = await createPage().page.render();

    expect(main.querySelector('.slider-placeholder')).toBeNull();
    expect(main.querySelector('.leaderboard-placeholder')).toBeNull();
    expect([...main.children].map((child) => child.className)).toEqual(['slider', 'leaderboard']);
  });

  it('gives the slider its services and the details handler', async () => {
    const { store, gamesService, onDetailsClick, page } = createPage();

    await page.render();

    const [sliderStore, sliderGames, sliderDetails] = created.slider.at(-1) ?? [];

    expect(sliderStore).toBe(store);
    expect(sliderGames).toBe(gamesService);
    expect(sliderDetails).toBe(onDetailsClick);
  });

  it('gives the leaderboard its service', async () => {
    const { store, leaderboardService, page } = createPage();

    await page.render();

    const [leaderboardStore, service] = created.leaderboard.at(-1) ?? [];

    expect(leaderboardStore).toBe(store);
    expect(service).toBe(leaderboardService);
  });
});
