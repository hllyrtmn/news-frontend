import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Bir hata oluştu';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Hata: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
            break;
          case 400:
            errorMessage = error.error?.message || error.error?.error || 'Geçersiz istek';
            // Handle validation errors
            if (error.error?.errors) {
              const errors = error.error.errors;
              const firstError = Object.values(errors)[0];
              if (Array.isArray(firstError) && firstError.length > 0) {
                errorMessage = firstError[0];
              }
            }
            break;
          case 401:
            errorMessage = 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
            break;
          case 403:
            errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
            break;
          case 404:
            errorMessage = 'İstenen kaynak bulunamadı.';
            break;
          case 500:
            errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
            break;
          case 503:
            errorMessage = 'Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
            break;
          default:
            errorMessage = error.error?.message || error.error?.error || `Hata kodu: ${error.status}`;
        }
      }

      // Show error notification (except for 401 which is handled by auth interceptor)
      if (error.status !== 401) {
        notificationService.error(errorMessage);
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        error: error.error,
        url: error.url
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        error: error.error
      }));
    })
  );
};
