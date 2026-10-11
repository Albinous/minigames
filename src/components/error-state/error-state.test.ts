import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('shows the message and a retry button', () => {
    const element = new ErrorState().render('Failed to load games', vi.fn());
    const button = element.querySelector<HTMLButtonElement>('.error-state__retry');

    expect(element.className).toBe('error-state');
    expect(element.querySelector('.error-state__message')?.textContent).toBe('Failed to load games');
    expect(button?.textContent).toBe('Retry');
    expect(button?.type).toBe('button');
  });

  it('calls the retry handler on every click', () => {
    const onRetry = vi.fn();
    const element = new ErrorState().render('Oops', onRetry);
    const button = element.querySelector<HTMLButtonElement>('.error-state__retry');

    button?.click();
    button?.click();

    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it('shows the message as text, not as HTML', () => {
    const element = new ErrorState().render('<b>bold</b>', vi.fn());

    expect(element.querySelector(':scope .error-state__message b')).toBeNull();
  });
});