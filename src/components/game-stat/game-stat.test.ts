import { describe, expect, it } from 'vitest';
import type { IGameStatOptions } from '../../core';
import { GameStat } from './game-stat';

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="icon"></svg>';

describe('GameStat', () => {
  it('shows the icon followed by the value', () => {
    const stat = new GameStat({ icon: ICON, value: '4.8', className: 'rating' }).render();

    expect(stat.className).toBe('game-stat rating');
    expect(stat.firstElementChild?.classList.contains('icon')).toBe(true);
    expect(stat.lastElementChild?.classList.contains('game-stat__value')).toBe(true);
    expect(stat.querySelector('.game-stat__value')?.textContent).toBe('4.8');
  });

  it('works without a class name', () => {
    const stat = new GameStat({ icon: ICON, value: '1' } as IGameStatOptions).render();

    expect(stat.classList.contains('game-stat')).toBe(true);
  });

  it('shows only the value when the icon is empty', () => {
    const stat = new GameStat({ icon: '', value: '7', className: 'likes' }).render();

    expect(stat.querySelector('svg')).toBeNull();
    expect(stat.textContent).toBe('7');
  });

  it('ignores an icon that is not an svg', () => {
    const stat = new GameStat({ icon: '<div class="fake"></div>', value: '7' }).render();

    expect(stat.querySelector('.fake')).toBeNull();
  });

  it('shows the value as text, not as HTML', () => {
    const stat = new GameStat({ icon: ICON, value: '<b>5</b>' }).render();

    expect(stat.querySelector('b')).toBeNull();
    expect(stat.textContent).toBe('<b>5</b>');
  });
});
