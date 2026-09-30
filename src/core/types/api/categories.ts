import type { Category } from '../category';
import type { ListMeta } from '../meta';

export interface CategoriesResponse {
  items: CategoryData[];
  meta: ListMeta;
}

export interface CategoryData {
  slug: Category;
  label: string;
  isDefault: boolean;
}
