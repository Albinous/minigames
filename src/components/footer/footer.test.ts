import { describe, expect, it, vi } from 'vitest';
import { Footer } from './footer';

vi.mock('../logo', () => ({
  Logo: class Logo {
    public render(): HTMLElement {
      const element = document.createElement('div');

      element.className = 'logo';

      return element;
    }
  },
}));

describe('Footer', () => {
  it('renders a footer element', () => {
    const footer = new Footer().render();

    expect(footer.tagName).toBe('FOOTER');
    expect(footer.className).toBe('footer');
  });

  it('puts the logo first in the left block and marks it as the footer logo', () => {
    const logo = new Footer().render().querySelector('.footer-left')?.firstElementChild;

    expect(logo?.classList.contains('logo')).toBe(true);
    expect(logo?.classList.contains('footer-logo')).toBe(true);
  });
});