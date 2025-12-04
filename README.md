# News Frontend - Angular 21 Standalone

Modern haber sitesi frontend uygulaması. Django REST Framework backend ile entegre çalışacak şekilde tasarlanmıştır.

## 🚀 Teknoloji Stack

- **Angular 21** (Standalone Components)
- **TypeScript 5.x**
- **Angular Material** (UI Components)
- **Tailwind CSS 3.x** (Utility-first CSS)
- **RxJS 7.x** (Reactive Programming)
- **Angular Universal** (Server-Side Rendering - SEO)
- **Angular Signals** (State Management)

## 📦 Kurulum

```bash
# Bağımlılıkları kur
npm install

# Development server'ı başlat
npm start
# veya
ng serve

# Tarayıcıda aç: http://localhost:4200
```

## 🏗️ Proje Yapısı

Detaylı proje yapısı için `ARCHITECTURE.md` dosyasına bakın.

## ✅ Tamamlanan Özellikler

### Core Infrastructure
- ✅ Models, Services, Interceptors, Guards
- ✅ JWT Authentication
- ✅ SEO Service (Meta tags, Structured Data)
- ✅ API Integration

### Components
- ✅ App Component (Header, Footer)
- ✅ Home Component (Breaking News, Featured Articles)
- ✅ Login Component

## 🔧 Komutlar

```bash
npm start              # Development server
npm run build          # Production build
npm run build:ssr      # SSR build
npm run serve:ssr      # SSR server çalıştır
npm test               # Unit tests
```

## 🌐 Backend Entegrasyonu

`src/environments/environment.ts` dosyasında backend URL'ini ayarlayın:

```typescript
apiUrl: 'http://localhost:8000/api/v1'
```

## 📝 Yapılacaklar

- [ ] Article Detail Component
- [ ] Register Component
- [ ] Admin Dashboard
- [ ] Admin Article Management
- [ ] Category/Tag Management
- [ ] Comment System
- [ ] Media Library
- [ ] User Profile
- [ ] Advertisement Management

Detaylı TODO listesi için `TODO.md` dosyasına bakın.

## 📚 Dokümantasyon

- `ARCHITECTURE.md` - Proje mimarisi ve yapısı
- `API.md` - API entegrasyonu ve endpoint'ler
- `TODO.md` - Yapılacaklar listesi
- `DEPLOYMENT.md` - Deployment rehberi

## 🔐 Authentication

User types: admin, editor, author, subscriber, reader

Route guards: authGuard, adminGuard, editorGuard, authorGuard, guestGuard

## 📄 Lisans

MIT License

---

**Not**: Bu proje aktif geliştirme aşamasındadır.
