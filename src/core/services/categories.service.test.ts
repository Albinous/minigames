import { describe, expect, it, vi } from 'vitest';
import { Store } from '../state';
import type { CategoriesApi } from './api';
import { CategoriesService } from './categories.service';

const createContext = () => {
  const store = new Store();
  const getCategories = vi.fn();
  const service = new CategoriesService(store, { getCategories } as unknown as CategoriesApi);

  return { store, getCategories, service };
};

describe('CategoriesService.loadCategories', () => {
  it('stores the response and finishes loading', async () => {
    const { store, getCategories, service } = createContext();
    const response = { categories: ['cozy'] };

    getCategories.mockResolvedValue(response);
    await service.loadCategories();

    expect(store.categories.data).toBe(response);
    expect(store.categories.error).toBeUndefined();
    expect(store.categories.isLoading).toBe(false);
  });

  it('is loading while the request is in flight', async () => {
    const { store, getCategories, service } = createContext();
    let wasLoadingDuringRequest = false;

    getCategories.mockImplementation(async () => {
      wasLoadingDuringRequest = store.categories.isLoading;

      return {};
    });
    await service.loadCategories();

    expect(wasLoadingDuringRequest).toBe(true);
    expect(store.categories.isLoading).toBe(false);
  });

  it('stores an error when the request fails', async () => {
    const { store, getCategories, service } = createContext();

    getCategories.mockRejectedValue(new Error('network'));
    await service.loadCategories();

    expect(store.categories.error).toBe('Failed to load categories');
    expect(store.categories.data).toBeUndefined();
    expect(store.categories.isLoading).toBe(false);
  });

  it('clears the previous error after a successful retry', async () => {
    const { store, getCategories, service } = createContext();

    getCategories.mockRejectedValueOnce(new Error('network'));
    getCategories.mockResolvedValueOnce({ categories: [] });
    await service.loadCategories();
    await service.loadCategories();

    expect(store.categories.error).toBeUndefined();
  });
});
