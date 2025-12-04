export interface AdvertisementZone {
  id: number;
  name: string;
  zone_type: string;
  width: number;
  height: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Advertiser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  contact_person?: string;
  tax_number?: string;
  address?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  advertiser: number;
  advertiser_name?: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  pricing_model: 'cpm' | 'cpc' | 'cpa' | 'flat';
  budget: number;
  spent: number;
  cpm_price?: number;
  cpc_price?: number;
  cpa_price?: number;
  max_impressions?: number;
  max_clicks?: number;
  daily_budget?: number;
  start_date: string;
  end_date: string;
  target_countries?: string[];
  target_cities?: string[];
  target_devices?: string[];
  target_categories?: number[];
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  ctr?: number;
  conversion_rate?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: number;
  campaign: number;
  campaign_name?: string;
  zone: number;
  zone_name?: string;
  name: string;
  ad_type: 'image' | 'html' | 'video' | 'script' | 'native';
  image?: string;
  video_url?: string;
  html_content?: string;
  script_code?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  target_url: string;
  open_in_new_tab: boolean;
  priority: number;
  weight: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdStatistics {
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_revenue: number;
  average_ctr: number;
  average_conversion_rate: number;
  campaigns: {
    id: number;
    name: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spent: number;
  }[];
  daily_stats: {
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

export interface CampaignCreateRequest {
  name: string;
  advertiser: number;
  status?: string;
  pricing_model: string;
  budget: number;
  cpm_price?: number;
  cpc_price?: number;
  cpa_price?: number;
  max_impressions?: number;
  max_clicks?: number;
  daily_budget?: number;
  start_date: string;
  end_date: string;
  target_countries?: string[];
  target_cities?: string[];
  target_devices?: string[];
  target_categories?: number[];
  notes?: string;
}

export interface AdvertisementCreateRequest {
  campaign: number;
  zone: number;
  name: string;
  ad_type: string;
  image?: File;
  video_url?: string;
  html_content?: string;
  script_code?: string;
  title?: string;
  description?: string;
  thumbnail?: File;
  target_url: string;
  open_in_new_tab?: boolean;
  priority?: number;
  weight?: number;
}
