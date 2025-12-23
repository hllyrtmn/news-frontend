import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { filter, map } from 'rxjs';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDivider
],
  template: `
    <header class="admin-header bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <button
          mat-icon-button
          (click)="onToggleSidebar()"
          class="lg:hidden"
        >
          <mat-icon>menu</mat-icon>
        </button>

        <!-- Breadcrumbs -->
        <nav class="breadcrumbs hidden md:flex items-center gap-2 text-sm text-gray-600">
          <a routerLink="/admin" class="hover:text-blue-600">Admin</a>
          <mat-icon class="text-xs">chevron_right</mat-icon>
          <span class="text-gray-900 font-semibold">{{ currentPage }}</span>
        </nav>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-3">
        <!-- Quick Actions -->
        <button
          mat-icon-button
          routerLink="/admin/articles/create"
          matTooltip="Yeni Haber Ekle"
        >
          <mat-icon class="text-blue-600">add_circle</mat-icon>
        </button>

        <!-- Notifications -->
        <button
          mat-icon-button
          [matMenuTriggerFor]="notificationsMenu"
          [matBadge]="notificationCount"
          matBadgeColor="warn"
          matBadgeSize="small"
          [matBadgeHidden]="notificationCount === 0"
        >
          <mat-icon>notifications</mat-icon>
        </button>
        <mat-menu #notificationsMenu="matMenu" class="notification-menu">
          <div class="px-4 py-3 border-b">
            <h3 class="font-semibold">Bildirimler</h3>
          </div>
          @if (notificationCount > 0) {
            <div class="max-h-96 overflow-y-auto">
              @for (notification of notifications; track notification.id) {
                <button mat-menu-item class="notification-item">
                  <div class="flex items-start gap-3">
                    <mat-icon [class]="'text-' + notification.type">
                      {{ notification.icon }}
                    </mat-icon>
                    <div class="flex-1">
                      <p class="text-sm">{{ notification.message }}</p>
                      <span class="text-xs text-gray-500">{{ notification.time }}</span>
                    </div>
                  </div>
                </button>
              }
            </div>
            <div class="px-4 py-2 border-t text-center">
              <button mat-button color="primary" class="text-sm">
                Tümünü Gör
              </button>
            </div>
          } @else {
            <div class="px-4 py-8 text-center text-gray-500">
              <mat-icon class="text-4xl mb-2">notifications_none</mat-icon>
              <p>Bildirim yok</p>
            </div>
          }
        </mat-menu>

        <!-- View Site -->
        <button
          mat-button
          routerLink="/"
          target="_blank"
          class="hidden sm:flex"
        >
          <mat-icon>open_in_new</mat-icon>
          <span class="ml-2">Siteyi Görüntüle</span>
        </button>

        <!-- User Menu -->
        <button
          mat-button
          [matMenuTriggerFor]="userMenu"
          class="user-menu-button"
        >
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <mat-icon class="text-white text-sm">person</mat-icon>
            </div>
            <span class="hidden md:inline">{{ currentUser()?.username }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </div>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="px-4 py-3 border-b">
            <p class="font-semibold">{{ currentUser()?.username }}</p>
            <p class="text-sm text-gray-500">{{ currentUser()?.email }}</p>
          </div>
          <button mat-menu-item routerLink="/admin/profile">
            <mat-icon>person</mat-icon>
            <span>Profilim</span>
          </button>
          <button mat-menu-item routerLink="/admin/settings">
            <mat-icon>settings</mat-icon>
            <span>Ayarlar</span>
          </button>
          <mat-divider />
          <button mat-menu-item (click)="logout()" class="text-red-600">
            <mat-icon>logout</mat-icon>
            <span>Çıkış Yap</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      height: 64px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .breadcrumbs a {
      transition: color 0.2s;
    }

    .user-menu-button {
      border-radius: 20px;
    }

    ::ng-deep .notification-menu {
      width: 360px;
      max-width: 90vw;
    }

    .notification-item {
      height: auto !important;
      padding: 12px 16px !important;
      white-space: normal !important;
      line-height: 1.4 !important;
    }

    .notification-item:hover {
      background-color: #f3f4f6;
    }

    .text-info { color: #3b82f6; }
    .text-success { color: #10b981; }
    .text-warning { color: #f59e0b; }
    .text-error { color: #ef4444; }
  `]
})
export class AdminHeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser = this.authService.currentUser;
  currentPage = 'Dashboard';
  notificationCount = 3; // Dynamic yapılacak

  // Mock notifications - backend'den gelecek
  notifications = [
    {
      id: 1,
      type: 'info',
      icon: 'comment',
      message: '5 yeni yorum onay bekliyor',
      time: '5 dakika önce'
    },
    {
      id: 2,
      type: 'success',
      icon: 'article',
      message: 'Yeni haber yayınlandı',
      time: '1 saat önce'
    },
    {
      id: 3,
      type: 'warning',
      icon: 'person',
      message: '2 yeni kullanıcı kaydı',
      time: '2 saat önce'
    }
  ];

  constructor() {
    // Update breadcrumb on route change
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getCurrentPageTitle())
      )
      .subscribe(title => {
        this.currentPage = title;
      });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      this.authService.logout();
    }
  }

  private getCurrentPageTitle(): string {
    const url = this.router.url;

    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/articles')) return 'Haberler';
    if (url.includes('/categories')) return 'Kategoriler';
    if (url.includes('/tags')) return 'Etiketler';
    if (url.includes('/users')) return 'Kullanıcılar';
    if (url.includes('/comments')) return 'Yorumlar';
    if (url.includes('/media')) return 'Medya';
    if (url.includes('/advertisements')) return 'Reklamlar';
    if (url.includes('/newsletter')) return 'Newsletter';
    if (url.includes('/settings')) return 'Ayarlar';
    if (url.includes('/profile')) return 'Profil';

    return 'Dashboard';
  }
}
