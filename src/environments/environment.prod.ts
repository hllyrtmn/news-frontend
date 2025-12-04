export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api/v1',
  mediaUrl: 'https://api.yourdomain.com/media',
  staticUrl: 'https://api.yourdomain.com/static',
  appName: 'Haber Sitesi',
  appVersion: '1.0.0',
  defaultLanguage: 'tr',
  supportedLanguages: ['tr', 'en'],
  itemsPerPage: 20,
  commentsPerPage: 10,
  maxUploadSize: 10485760, // 10MB in bytes
  cacheTimeout: 300000, // 5 minutes in milliseconds
  tokenRefreshInterval: 3000000, // 50 minutes in milliseconds
};
