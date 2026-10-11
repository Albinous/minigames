import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from '../../constants';
import { Api } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Api.get', () => {
  it('requests the endpoint under the base url and returns parsed JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [1] }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await new Api().get<{ items: number[] }>('/games?limit=3');

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/games?limit=3`);
    expect(result).toEqual({ items: [1] });
  });

  it('throws with the status code when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(new Api().get('/missing')).rejects.toThrow('404');
  });
});