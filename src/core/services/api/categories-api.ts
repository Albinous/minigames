import type { CategoriesResponse } from '../../types';
import { Api } from './api';

export class CategoriesApi extends Api {
  public async getCategories(): Promise<CategoriesResponse> {
    return this.get(`/categories`);
  }
}
