export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  mediaUrl: 'http://localhost:8000/media',
  staticUrl: 'http://localhost:8000/static',
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
