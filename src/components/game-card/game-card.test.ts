import { describe, expect, it, vi } from 'vitest';
import type { IGame } from '../../core';
import { GameCard } from './game-card';

vi.mock('../../assets/icons', () => ({
  starIcon: '<svg xmlns="http://www.w3.org/2000/svg" class="star"></svg>',
  likeIconImg: '<svg xmlns="http://www.w3.org/2000/svg" class="like"></svg>',
}));

const game = {
  slug: 'tiny-glade',
  name: 'Tiny Glade',
  category: 'puzzle',
  price: '$9.99',
  shortDescription: 'A cozy diorama builder',
  rating: 4.8,
  likesCount: 1500,
  cardImage: 'https://example.com/card.jpg',
} as unknown as IGame;

const text = (card: HTMLElement, selector: string): string | null | undefined =>
  card.querySelector(selector)?.textContent;

describe('GameCard', () => {
  it('shows the picture of the game', () => {
    const card = new GameCard(game, vi.fn()).render();
    const image = card.querySelector<HTMLImageElement>('.game-card__img');

    expect(card.className).toBe('game-card');
    expect(image?.src).toBe('https://example.com/card.jpg');
  });

  it('shows the game information', () => {
    const card = new GameCard(game, vi.fn()).render();

    expect(text(card, '.game-card__title')).toBe('Tiny Glade');
    expect(text(card, '.game-card__category')).toBe('Puzzle');
    expect(text(card, '.game-card__price')).toBe('$9.99');
    expect(text(card, '.game-card__descr')).toBe('A cozy diorama builder');
  });

  it('shows the rating and the formatted likes', () => {
    const card = new GameCard(game, vi.fn()).render();

    expect(text(card, '.rating .game-stat__value')).toBe('4.8');
    expect(text(card, '.likes .game-stat__value')).toBe('1.5K');
  });

  it('opens the details of the game on every click of the button', () => {
    const onDetailsClick = vi.fn();
    const card = new GameCard(game, onDetailsClick).render();
    const button = card.querySelector<HTMLButtonElement>('.game-card__btn');

    button?.click();
    button?.click();

    expect(button?.textContent).toBe('Details');
    expect(onDetailsClick).toHaveBeenCalledTimes(2);
    expect(onDetailsClick).toHaveBeenCalledWith('tiny-glade');
  });

  it('shows game data as text, not as HTML', () => {
    const unsafe = { ...game, name: '<b>bold</b>' } as unknown as IGame;
    const card = new GameCard(unsafe, vi.fn()).render();

    expect(card.querySelector(':scope .game-card__title b')).toBeNull();
  });
});