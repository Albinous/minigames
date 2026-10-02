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

    try {
      const response = await this.api.getCategories();

      this.store.categories.data = response;
    } catch {
      this.store.categories.error = 'Failed to load categories';
    } finally {
      this.store.categories.isLoading = false;
    }
  }
}
