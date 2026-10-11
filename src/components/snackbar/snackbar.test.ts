import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Snackbar } from './snackbar';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe('Snackbar', () => {
  it('shows the message with the error type', () => {
    new Snackbar().show('Oops', 'error');

    const element = document.querySelector('.snackbar');

    expect(element?.classList.contains('snackbar--error')).toBe(true);
    expect(element?.querySelector('.snackbar__message')?.textContent).toBe('Oops');
  });

  it('supports the success type', () => {
    new Snackbar().show('Done', 'success');

    expect(document.querySelector('.snackbar--success')).not.toBeNull();
  });

  it('shows the message as text, not as HTML', () => {
    new Snackbar().show('<b>x</b>', 'error');

    expect(document.querySelector('.snackbar__message b')).toBeNull();
  });

  it('keeps only one notification and shows the latest message', () => {
    const snackbar = new Snackbar();

    snackbar.show('First', 'error');
    snackbar.show('Second', 'error');

    expect(document.querySelectorAll('.snackbar')).toHaveLength(1);
    expect(document.querySelector('.snackbar__message')?.textContent).toBe('Second');
  });

  it('hides itself after three seconds', () => {
    new Snackbar().show('Oops', 'error');

    vi.advanceTimersByTime(2999);
    expect(document.querySelector('.snackbar')).not.toBeNull();

    vi.advanceTimersByTime(1);
    expect(document.querySelector('.snackbar')).toBeNull();
  });

  it('restarts the timer when a new message replaces the old one', () => {
    const snackbar = new Snackbar();

    snackbar.show('First', 'error');
    vi.advanceTimersByTime(2000);
    snackbar.show('Second', 'error');
    vi.advanceTimersByTime(2000);

    expect(document.querySelector('.snackbar')).not.toBeNull();

    vi.advanceTimersByTime(1000);

    expect(document.querySelector('.snackbar')).toBeNull();
  });

  it('closes on the close button and cancels the timer', () => {
    new Snackbar().show('Oops', 'error');

    document.querySelector<HTMLButtonElement>('.snackbar__close')?.click();

    expect(document.querySelector('.snackbar')).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
