export interface Newsletter {
  id: number;
  name: string;
  description?: string;
  category?: number;
  category_name?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  template?: string;
  is_active: boolean;
  created_at: string;
  subscriber_count?: number;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  user?: number;
  newsletter: number;
  newsletter_name?: string;
  is_verified: boolean;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
}

export interface NewsletterSubscribeRequest {
  email: string;
  newsletter: number;
}
