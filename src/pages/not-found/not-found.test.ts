import { describe, expect, it, vi } from 'vitest';
import { NotFound } from './not-found';

describe('NotFound', () => {
  it('explains that the page does not exist', () => {
    const main = new NotFound().render(vi.fn());

    expect(main.tagName).toBe('MAIN');
    expect(main.className).toBe('not-found');
    expect(main.querySelector('.not-found__title')?.textContent).toBe('404');
    expect(main.querySelector('.not-found__text')?.textContent).toMatch(/does not exist/i);
  });

  it('leads back home on every click of the button', () => {
    const onHomeClick = vi.fn();
    const button = new NotFound().render(onHomeClick).querySelector<HTMLButtonElement>('.not-found__btn');

    button?.click();
    button?.click();

    expect(button?.type).toBe('button');
    expect(onHomeClick).toHaveBeenCalledTimes(2);
  });
});