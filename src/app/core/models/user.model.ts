export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'admin' | 'editor' | 'author' | 'subscriber' | 'reader';
  avatar?: string;
  bio?: string;
  phone?: string;
  birth_date?: string;
  is_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login?: string;
}

export interface AuthorProfile {
  id: number;
  user: number;
  display_name: string;
  slug: string;
  title?: string;
  specialty?: string;
  bio_long?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_instagram?: string;
  social_facebook?: string;
  website?: string;
  total_articles: number;
  total_views: number;
  average_rating: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: number;
  user: number;
  email_notifications: boolean;
  push_notifications: boolean;
  newsletter_subscribed: boolean;
  language: 'tr' | 'en';
  theme: 'light' | 'dark' | 'auto';
  font_size: 'small' | 'medium' | 'large';
  preferred_categories: number[];
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}
