export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    TOKEN_REFRESH: '/auth/token/refresh/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
    PREFERENCES: '/auth/preferences/',
    AUTHORS: '/auth/authors/',
  },

  // Articles
  ARTICLES: {
    BASE: '/articles/',
    DETAIL: (slug: string) => `/articles/${slug}/`,
    BY_CATEGORY: (categorySlug: string) => `/articles/?category=${categorySlug}`,
    BY_TAG: (tagSlug: string) => `/articles/?tags=${tagSlug}`,
    BY_AUTHOR: (authorSlug: string) => `/articles/?author=${authorSlug}`,
    SEARCH: (query: string) => `/articles/?search=${query}`,
    FEATURED: '/articles/?is_featured=true',
    BREAKING: '/articles/?is_breaking=true',
    TRENDING: '/articles/?is_trending=true',
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories/',
    DETAIL: (slug: string) => `/categories/${slug}/`,
  },

  // Tags
  TAGS: {
    BASE: '/tags/',
    DETAIL: (slug: string) => `/tags/${slug}/`,
    POPULAR: '/tags/?ordering=-usage_count',
  },

  // Comments
  COMMENTS: {
    BASE: '/comments/',
    DETAIL: (id: number) => `/comments/${id}/`,
    BY_ARTICLE: (articleId: number) => `/comments/?article=${articleId}`,
    APPROVE: (id: number) => `/comments/${id}/approve/`,
    REJECT: (id: number) => `/comments/${id}/reject/`,
    SPAM: (id: number) => `/comments/${id}/spam/`,
  },

  // Interactions
  INTERACTIONS: {
    LIKES: '/interactions/likes/',
    SHARES: '/interactions/shares/',
  },

  // Bookmarks
  BOOKMARKS: {
    FOLDERS: '/bookmarks/folders/',
    BOOKMARKS: '/bookmarks/bookmarks/',
    HISTORY: '/bookmarks/history/',
    LISTS: '/bookmarks/lists/',
  },

  // Media
  MEDIA: {
    BASE: '/media/',
    DETAIL: (id: number) => `/media/${id}/`,
    UPLOAD: '/media/',
  },

  // Newsletter
  NEWSLETTER: {
    BASE: '/newsletter/',
    SUBSCRIBE: '/newsletter/subscribe/',
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard/',
  },

  // Advertisements
  ADVERTISEMENTS: {
    ZONES: '/advertisements/zones/',
    ADVERTISERS: '/advertisements/advertisers/',
    CAMPAIGNS: '/advertisements/campaigns/',
    ADS: '/advertisements/ads/',
    STATISTICS: '/advertisements/statistics/',
    IMPRESSION: (adId: number) => `/advertisements/ads/${adId}/impression/`,
    CLICK: (adId: number) => `/advertisements/ads/${adId}/click/`,
  },

  // Core
  CORE: {
    HEALTH: '/core/health/',
    INFO: '/core/info/',
    SETTINGS: '/core/settings/',
    CONTACT: '/core/contact/',
    REPORT: '/core/report/',
  },
};
