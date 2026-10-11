import { describe, expect, it, vi } from 'vitest';
import { Store } from '../state';
import type { CommentsApi } from './api';
import { CommentsService } from './comments.service';

const createContext = () => {
  const store = new Store();
  const getComments = vi.fn();
  const service = new CommentsService(store, { getComments } as unknown as CommentsApi);

  return { store, getComments, service };
};

describe('CommentsService.loadComments', () => {
  it('requests comments of the game and stores the response', async () => {
    const { store, getComments, service } = createContext();
    const response = { items: [] };

    getComments.mockResolvedValue(response);
    await service.loadComments('tiny-glade');

    expect(getComments).toHaveBeenCalledWith('tiny-glade', undefined);
    expect(store.comments.data).toBe(response);
    expect(store.comments.isLoading).toBe(false);
  });

  it('passes the sort option to the api', async () => {
    const { getComments, service } = createContext();

    getComments.mockResolvedValue({});
    await service.loadComments('tiny-glade', 'newest');

    expect(getComments).toHaveBeenCalledWith('tiny-glade', 'newest');
  });

  it('stores an error when the request fails', async () => {
    const { store, getComments, service } = createContext();

    getComments.mockRejectedValue(new Error('network'));
    await service.loadComments('tiny-glade');

    expect(store.comments.error).toBe('Failed to load comments');
    expect(store.comments.isLoading).toBe(false);
  });

  it('clears the previous error after a successful retry', async () => {
    const { store, getComments, service } = createContext();

    getComments.mockRejectedValueOnce(new Error('network'));
    getComments.mockResolvedValueOnce({ items: [] });
    await service.loadComments('tiny-glade');
    await service.loadComments('tiny-glade');

    expect(store.comments.error).toBeUndefined();
  });
});
