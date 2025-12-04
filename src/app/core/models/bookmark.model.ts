export interface BookmarkFolder {
  id: number;
  user: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  bookmark_count?: number;
}

export interface Bookmark {
  id: number;
  user: number;
  article: number;
  article_title?: string;
  article_slug?: string;
  folder?: number;
  folder_name?: string;
  note?: string;
  tags?: string;
  reminder_date?: string;
  reminder_sent: boolean;
  is_read: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingHistory {
  id: number;
  user: number;
  article: number;
  article_title?: string;
  article_slug?: string;
  progress: number;
  completed: boolean;
  time_spent: number;
  last_position?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingList {
  id: number;
  user: number;
  name: string;
  description?: string;
  is_public: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  items?: ReadingListItem[];
}

export interface ReadingListItem {
  id: number;
  reading_list: number;
  article: number;
  article_title?: string;
  article_slug?: string;
  order: number;
  added_at: string;
}

export interface BookmarkCreateRequest {
  article: number;
  folder?: number;
  note?: string;
  tags?: string;
  reminder_date?: string;
  is_favorite?: boolean;
}
