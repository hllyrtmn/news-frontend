import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ SSR kontrolü - Server-side'da her zaman geçir
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  console.log('🛡️ ADMIN GUARD');
  console.log('  Platform:', isPlatformBrowser(platformId) ? 'Browser' : 'Server');

  // ✅ SSR kontrolü - Server-side'da her zaman geçir
  if (!isPlatformBrowser(platformId)) {
    console.log('  Server-side render - geçiliyor');
    return true;
  }

  console.log('  hasToken:', authService.hasToken());

  if (!authService.hasToken()) {
    console.log('❌ Token yok - Login sayfasına yönlendiriliyor');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const user = authService.currentUser();
  console.log('  currentUser:', user);

  if (user?.user_type === 'admin' || user?.is_staff || user?.is_superuser) {
    console.log('✅ Admin erişimi onaylandı');
    return true;
  }

  console.log('❌ Admin yetkisi yok - Anasayfaya yönlendiriliyor');
  router.navigate(['/']);
  return false;
};

export const editorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.hasToken()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (authService.isEditor()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const authorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.hasToken()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (authService.isAuthor()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  console.log('🛡️ GUEST GUARD');
  console.log('  Platform:', isPlatformBrowser(platformId) ? 'Browser' : 'Server');

  // ✅ SSR kontrolü - Server-side'da her zaman geçir
  if (!isPlatformBrowser(platformId)) {
    console.log('  Server-side render - geçiliyor');
    return true;
  }

  console.log('  hasToken:', authService.hasToken());

  if (!authService.hasToken()) {
    console.log('✅ Token yok - Login sayfasına erişim izni verildi');
    return true;
  }

  console.log('❌ Zaten login - Anasayfaya yönlendiriliyor');
  router.navigate(['/']);
  return false;
};
