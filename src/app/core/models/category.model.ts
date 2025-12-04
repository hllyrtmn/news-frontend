export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  icon?: string;
  color?: string;
  order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  article_count?: number;
  children?: Category[];
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  level: number;
}

export interface CategoryCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  parent?: number;
  icon?: string;
  color?: string;
  order?: number;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {
  id: number;
}
