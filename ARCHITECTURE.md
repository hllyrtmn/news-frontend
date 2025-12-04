# Proje Mimarisi

## Klasör Yapısı

```
src/app/
├── core/                          # Singleton servisler ve utilities
│   ├── guards/
│   │   └── auth.guard.ts          # ✅ Route guards (auth, admin, editor, author, guest)
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # ✅ JWT token management
│   │   ├── error.interceptor.ts   # ✅ Global error handling
│   │   └── loading.interceptor.ts # ✅ Loading state tracking
│   ├── services/
│   │   ├── api.service.ts         # ✅ Base HTTP service
│   │   ├── auth.service.ts        # ✅ Authentication
│   │   ├── storage.service.ts     # ✅ LocalStorage wrapper
│   │   ├── seo.service.ts         # ✅ SEO meta tags
│   │   ├── loading.service.ts     # ✅ Loading state
│   │   └── notification.service.ts # ✅ Toast notifications
│   ├── models/                    # ✅ TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── article.model.ts
│   │   ├── category.model.ts
│   │   ├── tag.model.ts
│   │   ├── comment.model.ts
│   │   ├── media.model.ts
│   │   ├── advertisement.model.ts
│   │   ├── bookmark.model.ts
│   │   ├── newsletter.model.ts
│   │   └── api-response.model.ts
│   └── constants/                 # ✅ Constants
│       ├── api-endpoints.ts       # API endpoint definitions
│       └── app-config.ts          # App configuration
│
├── shared/                        # Paylaşılan componentler
│   ├── components/                # TODO: Shared components
│   ├── directives/                # TODO: Custom directives
│   └── pipes/                     # TODO: Custom pipes
│
├── features/                      # Feature modülleri
│   ├── auth/
│   │   └── login/                 # ✅ Login component
│   ├── home/
│   │   └── home.component.ts      # ✅ Home page
│   ├── articles/
│   │   └── services/
│   │       └── article.service.ts # ✅ Article service
│   ├── user/                      # TODO: User profile
│   └── admin/                     # TODO: Admin panel
│
├── layouts/                       # TODO: Layout components
│   ├── main-layout/
│   ├── admin-layout/
│   └── auth-layout/
│
├── app.ts                         # ✅ Root component
├── app.config.ts                  # ✅ App providers
└── app.routes.ts                  # ✅ Route configuration
```

## Core Servisler

### ApiService
Base HTTP service. Tüm API çağrıları bu servis üzerinden yapılır.

```typescript
get<T>(endpoint, params?)
post<T>(endpoint, body, options?)
put<T>(endpoint, body)
patch<T>(endpoint, body)
delete<T>(endpoint)
upload<T>(endpoint, formData)
```

### AuthService
Authentication yönetimi. JWT token, login, logout, profile.

```typescript
login(credentials)
logout()
refreshToken()
getProfile()
updateProfile(data)
changePassword(data)
hasRole(role)
```

### StorageService
LocalStorage wrapper. Token, user, theme, language yönetimi.

```typescript
setItem(key, value)
getItem<T>(key)
removeItem(key)
getAccessToken()
setAccessToken(token)
getCurrentUser()
```

### SeoService
SEO meta tags, Open Graph, Twitter Cards, Structured Data.

```typescript
updateTags(data)
generateArticleStructuredData(article)
generateBreadcrumbStructuredData(items)
```

## HTTP Interceptors

### AuthInterceptor
- Her request'e JWT token ekler
- Token expire olduğunda otomatik refresh yapar
- 401 hatalarını handle eder

### ErrorInterceptor
- HTTP hatalarını yakalar
- User-friendly error messages gösterir
- Error notification gösterir

### LoadingInterceptor
- Request başladığında loading state'i aktif eder
- Request bittiğinde loading state'i kapatır

## Route Guards

### authGuard
Sadece giriş yapmış kullanıcılar erişebilir.

### adminGuard
Sadece admin kullanıcılar erişebilir.

### editorGuard
Sadece editor ve admin kullanıcılar erişebilir.

### authorGuard
Sadece author, editor ve admin kullanıcılar erişebilir.

### guestGuard
Sadece giriş yapmamış kullanıcılar erişebilir (login, register).

## State Management

Angular Signals kullanılıyor:

```typescript
// AuthService
private currentUserSignal = signal<User | null>(null);
private isAuthenticatedSignal = signal<boolean>(false);

currentUser = computed(() => this.currentUserSignal());
isAuthenticated = computed(() => this.isAuthenticatedSignal());
isAdmin = computed(() => ...);
```

## Routing Strategy

Lazy loading kullanılıyor:

```typescript
{
  path: 'admin',
  canActivate: [adminGuard],
  loadComponent: () => import('./features/admin/...')
}
```

## API Integration

### Endpoint Definitions

`core/constants/api-endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    PROFILE: '/auth/profile/',
    // ...
  },
  ARTICLES: {
    BASE: '/articles/',
    DETAIL: (slug) => `/articles/${slug}/`,
    // ...
  },
  // ...
};
```

### Usage

```typescript
this.apiService.get<Article>(API_ENDPOINTS.ARTICLES.DETAIL(slug))
```

## Component Architecture

### Standalone Components

Tüm componentler standalone:

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent { }
```

### Dependency Injection

`inject()` function kullanılıyor:

```typescript
private authService = inject(AuthService);
private router = inject(Router);
```

## Styling

### Tailwind CSS

Utility-first approach:

```html
<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Title</h1>
</div>
```

### Angular Material

Material Design components:

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Title</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    Content
  </mat-card-content>
</mat-card>
```

## SEO & SSR

### Server-Side Rendering

Angular Universal aktif. İlk render server-side yapılıyor.

### Meta Tags

Her sayfa için dynamic meta tags:

```typescript
this.seoService.updateTags({
  title: 'Page Title',
  description: 'Page description',
  image: 'og-image.jpg',
  type: 'article'
});
```

### Structured Data

JSON-LD format:

```typescript
this.seoService.generateArticleStructuredData(article);
```

## Error Handling

### Global Error Handler

ErrorInterceptor tüm HTTP hatalarını yakalar ve user-friendly messages gösterir.

### Notification Service

Toast notifications:

```typescript
this.notificationService.success('İşlem başarılı!');
this.notificationService.error('Bir hata oluştu!');
```

## Loading State

### Global Loading

LoadingService + LoadingInterceptor:

```typescript
// Component'te
isLoading = this.loadingService.isLoading;
```

```html
@if (isLoading()) {
  <div>Loading...</div>
}
```

## Form Handling

### Reactive Forms

```typescript
loginForm = this.fb.group({
  username: ['', [Validators.required]],
  password: ['', [Validators.required]]
});
```

### Validation

```html
@if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
  <mat-error>Username is required</mat-error>
}
```

## Best Practices

1. **Standalone Components**: NgModule kullanmıyoruz
2. **Signals**: State management için Angular Signals
3. **Inject Function**: Constructor injection yerine `inject()`
4. **Lazy Loading**: Route-based code splitting
5. **Type Safety**: Strict TypeScript
6. **Error Handling**: Global error interceptor
7. **SEO**: SSR + Meta tags + Structured data
8. **Responsive**: Mobile-first, Tailwind utilities
9. **Accessibility**: ARIA labels, keyboard navigation
10. **Performance**: Lazy loading, OnPush change detection

## Naming Conventions

- **Files**: kebab-case (article-list.component.ts)
- **Classes**: PascalCase (ArticleListComponent)
- **Variables**: camelCase (articleList)
- **Constants**: UPPER_SNAKE_CASE (API_ENDPOINTS)
- **Interfaces**: PascalCase (Article, User)
- **Services**: PascalCase + Service suffix (ArticleService)
- **Components**: PascalCase + Component suffix (ArticleListComponent)

## Code Organization

- **One component per file**
- **One service per file**
- **Group related files in folders**
- **Separate concerns** (presentation vs logic)
- **Keep components small** (< 200 lines)
- **Extract reusable logic** to services
- **Use pipes** for transformations
- **Use directives** for DOM manipulation
