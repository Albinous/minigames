import { describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('shows the default message', () => {
    const element = new EmptyState().render();

    expect(element.className).toBe('empty-state');
    expect(element.querySelector('.empty-state__message')?.textContent).toBe('Data Not Found');
  });

  it('shows a custom message', () => {
    const element = new EmptyState().render('No comments yet');

    expect(element.querySelector('.empty-state__message')?.textContent).toBe('No comments yet');
  });

  it('shows the message as text, not as HTML', () => {
    const element = new EmptyState().render('<b>bold</b>');

    expect(element.querySelector('b')).toBeNull();
  });
});
