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
    SEARCH: '/articles/search/', // GET /articles/search/?q=query
    FEATURED: '/articles/featured/',
    BREAKING: '/articles/breaking/',
    TRENDING: '/articles/trending/',
    POPULAR: '/articles/popular/', // GET /articles/popular/?period=weekly
    VIEW: (slug: string) => `/articles/${slug}/view/`, // POST
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
    LIST: '/comments/', // GET /comments/?article={id}
    CREATE: '/comments/',
    DETAIL: (id: number) => `/comments/${id}/`,
    UPDATE: (id: number) => `/comments/${id}/`,
    DELETE: (id: number) => `/comments/${id}/`,
    LIKE: (id: number) => `/comments/${id}/like/`,
    // Note: Backend'de dislike, report yok - frontend'de disable edilecek
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
