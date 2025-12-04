# Yapılacaklar Listesi

## 🔴 High Priority (Kritik)

### Authentication & User Management
- [ ] **Register Component** - Kayıt ekranı
  - Form validation
  - Password strength indicator
  - Email verification
  - Terms & conditions checkbox

- [ ] **Forgot Password Component** - Şifre sıfırlama
  - Email input
  - Reset link gönderimi
  - New password form

- [ ] **User Profile Component** - Kullanıcı profili
  - Profile info display
  - Edit profile form
  - Avatar upload
  - Change password
  - Preferences (theme, language, notifications)

### Article Management (Public)
- [ ] **Article Detail Component** - Haber detay sayfası
  - Article content display
  - Featured image
  - Video player (if has_video)
  - Image gallery
  - Author info
  - Category & tags
  - Share buttons
  - Related articles
  - Comments section
  - View counter
  - Reading time
  - SEO meta tags

- [ ] **Article List Component** (Public) - Haber listesi
  - Grid/List view toggle
  - Pagination
  - Filters (category, tag, date)
  - Search
  - Sort options

- [ ] **Category Page Component** - Kategori sayfası
  - Category info
  - Articles in category
  - Subcategories
  - SEO meta tags

- [ ] **Tag Page Component** - Etiket sayfası
  - Tag info
  - Articles with tag
  - Related tags
  - SEO meta tags

- [ ] **Author Page Component** - Yazar sayfası
  - Author profile
  - Author articles
  - Social links
  - Statistics
  - SEO meta tags

- [ ] **Search Results Component** - Arama sonuçları
  - Search input
  - Results list
  - Filters
  - Pagination
  - Recent searches

### Admin Panel - Dashboard
- [ ] **Admin Dashboard Component** - Ana dashboard
  - Statistics cards (total articles, users, views, comments)
  - Charts (views over time, popular categories)
  - Recent articles
  - Pending comments
  - Quick actions

### Admin Panel - Article Management
- [ ] **Admin Article List Component** - Haber listesi (admin)
  - Data table
  - Filters (status, category, author, date)
  - Search
  - Bulk actions (delete, publish, archive)
  - Pagination
  - Sort

- [ ] **Admin Article Form Component** - Haber oluştur/düzenle
  - Rich text editor (CKEditor or Quill)
  - Title, subtitle, summary
  - Category selection
  - Tags (multi-select with autocomplete)
  - Featured image upload
  - Gallery images upload
  - Video upload/URL
  - Co-authors selection
  - Status (draft, pending, published, archived)
  - Visibility (public, premium, subscriber_only)
  - Flags (featured, breaking, trending)
  - Publish date & expire date
  - SEO fields (meta title, description, keywords, og_image)
  - Preview
  - Save as draft
  - Publish

- [ ] **Admin Article Revisions Component** - Haber revizyonları
  - Revision history
  - Compare revisions
  - Restore revision

## 🟡 Medium Priority

### Admin Panel - Category Management
- [ ] **Admin Category List Component**
  - Tree view (hierarchical)
  - CRUD operations
  - Drag & drop reordering
  - Active/inactive toggle

- [ ] **Admin Category Form Component**
  - Name, slug, description
  - Parent category selection
  - Icon & color picker
  - Order
  - SEO fields

### Admin Panel - Tag Management
- [ ] **Admin Tag List Component**
  - Data table
  - Search
  - Usage count
  - CRUD operations

- [ ] **Admin Tag Form Component**
  - Name, slug, description

### Admin Panel - User Management
- [ ] **Admin User List Component**
  - Data table
  - Filters (user_type, is_active, is_verified)
  - Search
  - CRUD operations
  - Bulk actions

- [ ] **Admin User Form Component**
  - User info
  - User type selection
  - Permissions
  - Active/verified toggles

- [ ] **Admin Author Profile Management**
  - Author list
  - Author form
  - Statistics

### Admin Panel - Comment Management
- [ ] **Admin Comment List Component**
  - Data table
  - Filters (status, article)
  - Search
  - Moderation actions (approve, reject, spam)
  - Bulk actions

- [ ] **Admin Comment Detail Component**
  - Comment content
  - User info
  - Article link
  - Moderation actions
  - Reply

### Admin Panel - Media Library
- [ ] **Admin Media Library Component**
  - Grid view
  - List view
  - Upload (drag & drop)
  - Filters (type, date)
  - Search
  - Preview
  - Edit metadata
  - Delete

- [ ] **Admin Media Upload Component**
  - Drag & drop
  - Multiple files
  - Progress bar
  - Metadata form

### Comment System (Public)
- [ ] **Comment List Component**
  - Hierarchical comments
  - Pagination
  - Sort options
  - Like/dislike

- [ ] **Comment Form Component**
  - Text input
  - Reply to comment
  - Edit comment
  - Delete comment

### Bookmark System
- [ ] **Bookmark Service** - API integration

- [ ] **Bookmark Button Component**
  - Add/remove bookmark
  - Folder selection

- [ ] **Bookmarks Page Component**
  - Folder list
  - Bookmarked articles
  - Create/edit/delete folders
  - Notes
  - Tags
  - Reminders

- [ ] **Reading History Component**
  - History list
  - Clear history
  - Resume reading

- [ ] **Reading Lists Component**
  - Create/edit/delete lists
  - Add/remove articles
  - Public/private toggle
  - Share list

## 🟢 Low Priority

### Admin Panel - Advertisement Management
- [ ] **Admin Advertisement Zone List**
- [ ] **Admin Advertisement Zone Form**
- [ ] **Admin Advertiser List**
- [ ] **Admin Advertiser Form**
- [ ] **Admin Campaign List**
- [ ] **Admin Campaign Form**
- [ ] **Admin Advertisement List**
- [ ] **Admin Advertisement Form**
- [ ] **Admin Advertisement Statistics**

### Admin Panel - Newsletter Management
- [ ] **Admin Newsletter List**
- [ ] **Admin Newsletter Form**
- [ ] **Admin Newsletter Subscribers**
- [ ] **Admin Newsletter Send**

### Admin Panel - Analytics
- [ ] **Admin Analytics Dashboard**
  - Page views
  - Unique visitors
  - Popular articles
  - Traffic sources
  - Device/browser stats
  - Geographic data

### Admin Panel - SEO Management
- [ ] **Admin SEO Settings**
  - Sitemap configuration
  - Robots.txt editor
  - RSS feeds settings
  - Meta tags defaults

### Admin Panel - Site Settings
- [ ] **Admin General Settings**
  - Site name, description
  - Logo, favicon
  - Social links
  - Contact info

- [ ] **Admin Theme Settings**
  - Color scheme
  - Layout options
  - Typography

### Shared Components
- [ ] **Header Component**
  - Logo
  - Navigation menu
  - Search bar
  - User menu
  - Mobile menu

- [ ] **Footer Component**
  - Links
  - Social media
  - Newsletter subscription
  - Copyright

- [ ] **Sidebar Component**
  - Popular articles
  - Categories
  - Tags cloud
  - Advertisement zones

- [ ] **Breadcrumb Component**
  - Dynamic breadcrumbs
  - Structured data

- [ ] **Share Buttons Component**
  - Facebook, Twitter, LinkedIn, WhatsApp
  - Copy link
  - Share count

- [ ] **Pagination Component**
  - Page numbers
  - Previous/Next
  - Page size selector

- [ ] **Loading Spinner Component**
  - Global loader
  - Inline loader

- [ ] **Confirmation Dialog Component**
  - Reusable confirmation modal

- [ ] **Image Cropper Component**
  - Crop & resize images
  - Preview

### Shared Pipes
- [ ] **Truncate Pipe** - Metni kısalt
- [ ] **Time Ago Pipe** - Relative time (2 saat önce)
- [ ] **Safe HTML Pipe** - HTML sanitization
- [ ] **Highlight Pipe** - Search term highlighting

### Shared Directives
- [ ] **Lazy Load Directive** - Image lazy loading
- [ ] **Infinite Scroll Directive** - Infinite scrolling
- [ ] **Click Outside Directive** - Detect outside clicks
- [ ] **Debounce Directive** - Input debouncing

### PWA Features
- [ ] **Service Worker** - Offline support
- [ ] **Push Notifications** - Browser notifications
- [ ] **Install Prompt** - Add to home screen
- [ ] **Offline Page** - Custom offline page

### Testing
- [ ] **Unit Tests** - Component tests
- [ ] **Integration Tests** - Service tests
- [ ] **E2E Tests** - End-to-end tests

### Documentation
- [ ] **Component Documentation** - Storybook
- [ ] **API Documentation** - API usage guide
- [ ] **Deployment Guide** - Step-by-step deployment

### Performance Optimization
- [ ] **Lazy Loading Images** - Intersection Observer
- [ ] **Virtual Scrolling** - For long lists
- [ ] **OnPush Change Detection** - Optimize change detection
- [ ] **Bundle Size Optimization** - Tree shaking, code splitting
- [ ] **Caching Strategy** - HTTP caching, service worker

### Accessibility (a11y)
- [ ] **ARIA Labels** - Screen reader support
- [ ] **Keyboard Navigation** - Tab navigation
- [ ] **Focus Management** - Focus trapping
- [ ] **Color Contrast** - WCAG compliance
- [ ] **Alt Text** - Image descriptions

### Internationalization (i18n)
- [ ] **Multi-language Support** - TR/EN
- [ ] **Translation Files** - JSON translation files
- [ ] **Language Switcher** - UI language selection
- [ ] **RTL Support** - Right-to-left languages

## 📊 Progress Tracking

### Tamamlanan (✅)
- Core Infrastructure (Models, Services, Interceptors, Guards)
- API Integration
- Authentication Service
- Storage Service
- SEO Service
- Notification Service
- Loading Service
- Article Service
- App Component
- Home Component
- Login Component

### Devam Eden (🔄)
- N/A

### Beklemede (⏸️)
- Tüm yukarıdaki TODO items

## 🎯 Sprint Planning

### Sprint 1 (Week 1-2)
- Article Detail Component
- Register Component
- Admin Dashboard
- Admin Article List

### Sprint 2 (Week 3-4)
- Admin Article Form
- Category Management
- Tag Management
- User Management

### Sprint 3 (Week 5-6)
- Comment System
- Media Library
- Bookmark System
- Shared Components

### Sprint 4 (Week 7-8)
- Advertisement Management
- Newsletter Management
- Analytics
- SEO Management

### Sprint 5 (Week 9-10)
- Testing
- Performance Optimization
- Accessibility
- Documentation

## 📝 Notes

- Her component için unit test yazılmalı
- Responsive design (mobile-first)
- SEO optimization (meta tags, structured data)
- Accessibility (ARIA, keyboard navigation)
- Performance (lazy loading, code splitting)
- Error handling (user-friendly messages)
- Loading states (skeleton screens)
- Empty states (no data messages)
- Form validation (client-side + server-side)
- Security (XSS protection, CSRF tokens)
