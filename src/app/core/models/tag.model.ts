export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface TagCreateRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface TagUpdateRequest extends Partial<TagCreateRequest> {
  id: number;
}
