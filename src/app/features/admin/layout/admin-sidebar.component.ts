import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
  children?: MenuItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <aside 
      class="admin-sidebar bg-gray-900 text-white transition-all duration-300 flex flex-col"
      [class.collapsed]="isCollapsed"
      [style.width]="isCollapsed ? '80px' : '260px'"
    >
      <!-- Logo -->
      <div class="sidebar-logo p-4 flex items-center justify-between border-b border-gray-800">
        @if (!isCollapsed) {
          <div class="flex items-center gap-3">
            <mat-icon class="text-blue-500">dashboard</mat-icon>
            <h1 class="text-xl font-bold">Admin Panel</h1>
          </div>
        } @else {
          <mat-icon class="text-blue-500 mx-auto">dashboard</mat-icon>
        }
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">
          @for (item of menuItems; track item.route) {
            <li>
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                class="nav-item flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-gray-800"
                [matTooltip]="isCollapsed ? item.label : ''"
                matTooltipPosition="right"
              >
                <mat-icon>{{ item.icon }}</mat-icon>
                @if (!isCollapsed) {
                  <span class="flex-1">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="badge bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {{ item.badge }}
                    </span>
                  }
                }
              </a>
            </li>
          }
        </ul>

        <mat-divider class="my-4 border-gray-800" />

        <!-- Settings & Logout -->
        <ul class="space-y-1 px-3">
          <li>
            <a
              routerLink="/admin/settings"
              class="nav-item flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-gray-800"
              [matTooltip]="isCollapsed ? 'Ayarlar' : ''"
              matTooltipPosition="right"
            >
              <mat-icon>settings</mat-icon>
              @if (!isCollapsed) {
                <span>Ayarlar</span>
              }
            </a>
          </li>
          <li>
            <button
              (click)="logout()"
              class="nav-item w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-red-900"
              [matTooltip]="isCollapsed ? 'Çıkış Yap' : ''"
              matTooltipPosition="right"
            >
              <mat-icon>logout</mat-icon>
              @if (!isCollapsed) {
                <span>Çıkış Yap</span>
              }
            </button>
          </li>
        </ul>
      </nav>

      <!-- User Info -->
      <div class="sidebar-footer border-t border-gray-800 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <mat-icon>person</mat-icon>
          </div>
          @if (!isCollapsed) {
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">{{ currentUser()?.username }}</p>
              <p class="text-xs text-gray-400 truncate">{{ currentUser()?.email }}</p>
            </div>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      height: 100vh;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .sidebar-nav {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    .sidebar-nav::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .nav-item {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      border: none;
      background: transparent;
      text-align: left;
    }

    .nav-item.active {
      background-color: #1e40af !important;
      color: white;
    }

    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .collapsed .nav-item {
      justify-content: center;
    }
  `]
})
export class AdminSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser = this.authService.currentUser;

  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/admin/dashboard'
    },
    {
      icon: 'article',
      label: 'Haberler',
      route: '/admin/articles'
    },
    {
      icon: 'category',
      label: 'Kategoriler',
      route: '/admin/categories'
    },
    {
      icon: 'label',
      label: 'Etiketler',
      route: '/admin/tags'
    },
    {
      icon: 'people',
      label: 'Kullanıcılar',
      route: '/admin/users'
    },
    {
      icon: 'comment',
      label: 'Yorumlar',
      route: '/admin/comments',
      badge: 5 // Pending comments count - dynamic yapılacak
    },
    {
      icon: 'photo_library',
      label: 'Medya',
      route: '/admin/media'
    },
    {
      icon: 'campaign',
      label: 'Reklamlar',
      route: '/admin/advertisements'
    },
    {
      icon: 'email',
      label: 'Newsletter',
      route: '/admin/newsletter'
    }
  ];

  logout(): void {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      this.authService.logout();
    }
  }
}
