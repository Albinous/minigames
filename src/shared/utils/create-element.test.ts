import { describe, expect, it } from 'vitest';
import { createElement } from './create-element';

describe('createElement', () => {
  it('creates the requested tag', () => {
    expect(createElement('button').tagName).toBe('BUTTON');
  });

  it('sets class name and text', () => {
    const element = createElement('p', { className: 'note', text: 'Hello' });

    expect(element.className).toBe('note');
    expect(element.textContent).toBe('Hello');
  });

  it('leaves class and text empty when they are not provided', () => {
    const element = createElement('div', { className: '', text: '' });

    expect(element.className).toBe('');
    expect(element.textContent).toBe('');
  });

  it('inserts text as plain text, not as HTML', () => {
    const element = createElement('div', { text: '<b>bold</b>' });

    expect(element.querySelector('b')).toBeNull();
    expect(element.textContent).toBe('<b>bold</b>');
  });

  it('sets string attributes', () => {
    const element = createElement('a', { attributes: { href: '/library', 'data-route': 'x' } });

    expect(element.getAttribute('href')).toBe('/library');
    expect(element.dataset.route).toBe('x');
  });

  it('toggles boolean attributes', () => {
    const element = createElement('button', { attributes: { hidden: true, disabled: false } });

    expect(element.hasAttribute('hidden')).toBe(true);
    expect(element.hasAttribute('disabled')).toBe(false);
  });
});
