import { describe, expect, it } from 'vitest';
import { Logo } from './logo';

describe('Logo', () => {
  it('is a link to the home page', () => {
    const logo = new Logo().render();

    expect(logo.tagName).toBe('A');
    expect(logo.className).toBe('logo');
    expect(logo.getAttribute('href')).toBe('/');
  });

  it('contains the brand content', () => {
    expect(new Logo().render().hasChildNodes()).toBe(true);
  });
});
