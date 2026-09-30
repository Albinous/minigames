import type { Category } from '../category';

export interface CategoriesResponse {
  items: CategoryData[];
  meta: CategoriesMeta;
}

export interface CategoryData {
  slug: Category;
  label: string;
  isDefault: boolean;
}

export interface CategoriesMeta {
  totalItems: number;
  description: string;
}
