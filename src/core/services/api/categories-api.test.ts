import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from '../../constants';
import { CategoriesApi } from './categories-api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CategoriesApi.getCategories', () => {
  it('requests the categories endpoint and returns its JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ categories: ['cozy'] }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await new CategoriesApi().getCategories();

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/categories`);
    expect(result).toEqual({ categories: ['cozy'] });
  });
});
