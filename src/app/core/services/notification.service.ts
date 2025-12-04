import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  // Show success message
  success(message: string, duration?: number): void {
    this.snackBar.open(message, 'Kapat', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['success-snackbar']
    });
  }

  // Show error message
  error(message: string, duration?: number): void {
    this.snackBar.open(message, 'Kapat', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['error-snackbar']
    });
  }

  // Show warning message
  warning(message: string, duration?: number): void {
    this.snackBar.open(message, 'Kapat', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['warning-snackbar']
    });
  }

  // Show info message
  info(message: string, duration?: number): void {
    this.snackBar.open(message, 'Kapat', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['info-snackbar']
    });
  }

  // Show custom message
  show(message: string, action: string = 'Kapat', config?: MatSnackBarConfig): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config
    });
  }

  // Dismiss all notifications
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
