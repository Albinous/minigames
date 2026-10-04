import type { Store } from '../state';
import type { CategoriesApi } from './api';

export class CategoriesService {
  private readonly store: Store;
  private readonly api: CategoriesApi;

  constructor(store: Store, categoriesApi: CategoriesApi) {
    this.store = store;
    this.api = categoriesApi;
  }

  public async loadCategories(): Promise<void> {
    this.store.categories.isLoading = true;
    this.store.games.error = undefined;

    try {
      // const shouldFail = true;

      //   if (shouldFail) {
      //     throw new Error('Test error');
      //   }
      const response = await this.api.getCategories();

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      this.store.categories.data = response;
    } catch {
      this.store.categories.error = 'Failed to load categories';
    } finally {
      this.store.categories.isLoading = false;
    }
  }
}
