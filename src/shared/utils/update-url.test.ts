import { beforeEach, describe, expect, it } from 'vitest';
import { removeAuthFromUrl, updateUrl, updateUrlAuth } from './update-url';

const setUrl = (url: string): void => {
  globalThis.history.replaceState({}, '', url);
};

beforeEach(() => {
  setUrl('/');
});

describe('updateUrl', () => {
  it('writes parameters to the library url', () => {
    updateUrl({ game: 'tiny-glade' });

    expect(globalThis.location.pathname).toBe('/library');
    expect(globalThis.location.search).toBe('?game=tiny-glade');
  });

  it('removes a parameter set to undefined and keeps the others', () => {
    setUrl('/library?game=x&page=2');

    updateUrl({ game: undefined });

    expect(globalThis.location.search).toBe('?page=2');
  });

  it('does not keep the first page in the url', () => {
    updateUrl({ page: 1 });

    expect(globalThis.location.search).toBe('');
  });

  it('keeps other parameters and writes numbers as text', () => {
    setUrl('/library?sort=new');

    updateUrl({ page: 3 });

    const parameters = new URLSearchParams(globalThis.location.search);

    expect(parameters.get('sort')).toBe('new');
    expect(parameters.get('page')).toBe('3');
  });

  it('adds a history entry', () => {
    const before = globalThis.history.length;

    updateUrl({ game: 'x' });

    expect(globalThis.history.length).toBe(before + 1);
  });
});

describe('updateUrlAuth', () => {
  it('adds the auth parameter to the given path', () => {
    updateUrlAuth('/library', 'login');

    expect(globalThis.location.pathname).toBe('/library');
    expect(globalThis.location.search).toBe('?auth=login');
  });

  it('keeps existing parameters', () => {
    setUrl('/library?page=2');

    updateUrlAuth('/library', 'register');

    const parameters = new URLSearchParams(globalThis.location.search);

    expect(parameters.get('auth')).toBe('register');
    expect(parameters.get('page')).toBe('2');
  });

  it('removes the auth parameter', () => {
    setUrl('/?auth=login');

    updateUrlAuth('/', undefined);

    expect(globalThis.location.search).toBe('');
  });
});

describe('removeAuthFromUrl', () => {
  it('removes only the auth parameter and keeps path, other parameters and hash', () => {
    setUrl('/library?auth=login&page=2#top');

    removeAuthFromUrl();

    expect(globalThis.location.pathname).toBe('/library');
    expect(globalThis.location.search).toBe('?page=2');
    expect(globalThis.location.hash).toBe('#top');
  });

  it('replaces the current history entry instead of adding one', () => {
    setUrl('/?auth=login');
    const before = globalThis.history.length;

    removeAuthFromUrl();

    expect(globalThis.history.length).toBe(before);
  });

  it('keeps the history state', () => {
    globalThis.history.replaceState({ marker: 1 }, '', '/?auth=login');

    removeAuthFromUrl();

    expect(globalThis.history.state).toEqual({ marker: 1 });
  });

  it('does nothing when there is no auth parameter', () => {
    setUrl('/library?page=2');

    removeAuthFromUrl();

    expect(globalThis.location.search).toBe('?page=2');
  });
});