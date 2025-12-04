export interface Comment {
  id: number;
  article: number;
  user: number; // User ID
  user_name: string; // User display name
  user_avatar?: string; // User avatar URL
  parent?: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likes_count: number;
  dislikes_count: number;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface CommentCreateRequest {
  article: number;
  parent?: number;
  content: string;
}

export interface CommentUpdateRequest {
  id: number;
  content: string;
}
