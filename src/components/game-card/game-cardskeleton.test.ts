import { describe, expect, it } from 'vitest';
import { GameCardSkeleton } from './game-card-skeleton';

describe('GameCardSkeleton', () => {
  it('builds the card with an image and an info block', () => {
    const card = new GameCardSkeleton().render();

    expect(card.className).toBe('game-card-skeleton');
    expect([...card.children].map((child) => child.className)).toEqual([
      'skeleton game-card-skeleton__image',
      'game-card-skeleton__info',
    ]);
  });

  it('builds the info block from a header, a description and a footer', () => {
    const info = new GameCardSkeleton().render().querySelector('.game-card-skeleton__info');

    expect([...(info?.children ?? [])].map((child) => child.className)).toEqual([
      'game-card-skeleton__header',
      'skeleton game-card-skeleton__description',
      'game-card-skeleton__footer',
    ]);
  });

  it('puts the title and the category in the header and stats and button in the footer', () => {
    const card = new GameCardSkeleton().render();
    const classesIn = (selector: string): string[] =>
      [...(card.querySelector(selector)?.children ?? [])].map((child) => child.className);

    expect(classesIn('.game-card-skeleton__header')).toEqual([
      'skeleton game-card-skeleton__title',
      'skeleton game-card-skeleton__category',
    ]);
    expect(classesIn('.game-card-skeleton__footer')).toEqual([
      'skeleton game-card-skeleton__stats',
      'skeleton game-card-skeleton__button',
    ]);
  });

  it('uses six animated blocks', () => {
    expect(new GameCardSkeleton().render().querySelectorAll('.skeleton')).toHaveLength(6);
  });
});