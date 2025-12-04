export const APP_CONFIG = {
  // User Types
  USER_TYPES: {
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    SUBSCRIBER: 'subscriber',
    READER: 'reader',
  },

  // Article Status
  ARTICLE_STATUS: {
    DRAFT: 'draft',
    PENDING: 'pending',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  },

  // Article Visibility
  ARTICLE_VISIBILITY: {
    PUBLIC: 'public',
    PREMIUM: 'premium',
    SUBSCRIBER_ONLY: 'subscriber_only',
  },

  // Comment Status
  COMMENT_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SPAM: 'spam',
  },

  // Media Types
  MEDIA_TYPES: {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: 'document',
  },

  // Share Platforms
  SHARE_PLATFORMS: {
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    LINKEDIN: 'linkedin',
    WHATSAPP: 'whatsapp',
    EMAIL: 'email',
    COPY_LINK: 'copy_link',
  },

  // Advertisement Types
  AD_TYPES: {
    IMAGE: 'image',
    HTML: 'html',
    VIDEO: 'video',
    SCRIPT: 'script',
    NATIVE: 'native',
  },

  // Advertisement Zone Types
  AD_ZONE_TYPES: {
    BANNER_TOP: 'banner_top',
    BANNER_BOTTOM: 'banner_bottom',
    SIDEBAR_TOP: 'sidebar_top',
    SIDEBAR_MIDDLE: 'sidebar_middle',
    SIDEBAR_BOTTOM: 'sidebar_bottom',
    IN_ARTICLE_TOP: 'in_article_top',
    IN_ARTICLE_MIDDLE: 'in_article_middle',
    IN_ARTICLE_BOTTOM: 'in_article_bottom',
    FLOATING: 'floating',
    POPUP: 'popup',
    INTERSTITIAL: 'interstitial',
    NATIVE: 'native',
  },

  // Campaign Status
  CAMPAIGN_STATUS: {
    DRAFT: 'draft',
    SCHEDULED: 'scheduled',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  // Pricing Models
  PRICING_MODELS: {
    CPM: 'cpm',
    CPC: 'cpc',
    CPA: 'cpa',
    FLAT: 'flat',
  },

  // Newsletter Frequency
  NEWSLETTER_FREQUENCY: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
  },

  // Themes
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },

  // Languages
  LANGUAGES: {
    TR: 'tr',
    EN: 'en',
  },

  // Font Sizes
  FONT_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
  },

  // Date Formats
  DATE_FORMATS: {
    SHORT: 'dd/MM/yyyy',
    MEDIUM: 'dd MMM yyyy',
    LONG: 'dd MMMM yyyy',
    FULL: 'dd MMMM yyyy HH:mm',
    TIME: 'HH:mm',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'current_user',
    THEME: 'theme',
    LANGUAGE: 'language',
    RECENT_SEARCHES: 'recent_searches',
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_TITLE_LENGTH: 255,
    MAX_SUMMARY_LENGTH: 500,
    MAX_BIO_LENGTH: 500,
    MAX_COMMENT_LENGTH: 1000,
  },
};
