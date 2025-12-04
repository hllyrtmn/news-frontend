import { Media } from './media.model';
import { Category } from './category.model';
import { Tag } from './tag.model';
import { AuthorProfile } from './user.model';

export interface Article {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  content: string;
  author: AuthorProfile;
  co_authors: AuthorProfile[];
  category: Category;
  tags: Tag[];
  featured_image?: Media;
  gallery: Media[];
  
  // Video support
  has_video: boolean;
  video_url?: string;
  video_file?: string;
  video_thumbnail?: string;
  video_duration?: number;
  video_embed_code?: string;
  
  // Status and visibility
  status: 'draft' | 'pending' | 'published' | 'archived';
  visibility: 'public' | 'premium' | 'subscriber_only';
  
  // Flags
  is_featured: boolean;
  is_breaking: boolean;
  is_trending: boolean;
  
  // Statistics
  views_count: number;
  read_time: number;
  
  // Dates
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  author: {
    id: number;
    display_name: string;
    slug: string;
    avatar?: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  featured_image?: {
    id: number;
    file: string;
    thumbnail?: string;
    alt_text?: string;
  };
  status: string;
  is_featured: boolean;
  is_breaking: boolean;
  is_trending: boolean;
  views_count: number;
  read_time: number;
  published_at?: string;
  created_at: string;
}

export interface ArticleRevision {
  id: number;
  article: number;
  title: string;
  content: string;
  revised_by: number;
  revision_note?: string;
  created_at: string;
}

export interface RelatedArticle {
  id: number;
  article: number;
  related_article: ArticleListItem;
  relation_type: 'similar' | 'continuation' | 'background';
  order: number;
}

export interface ArticleCreateRequest {
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  author: number;
  co_authors?: number[];
  category: number;
  tags?: number[];
  featured_image?: number;
  gallery?: number[];
  has_video?: boolean;
  video_url?: string;
  video_file?: File;
  video_thumbnail?: File;
  video_duration?: number;
  video_embed_code?: string;
  status?: string;
  visibility?: string;
  is_featured?: boolean;
  is_breaking?: boolean;
  is_trending?: boolean;
  published_at?: string;
  expires_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: File;
}

export interface ArticleUpdateRequest extends Partial<ArticleCreateRequest> {
  id: number;
}

export interface ArticleFilters {
  status?: string;
  category?: string;
  tags?: string[];
  author?: string;
  is_featured?: boolean;
  is_breaking?: boolean;
  is_trending?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
