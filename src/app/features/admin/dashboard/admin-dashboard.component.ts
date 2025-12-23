import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ArticleService } from '../../../features/articles/services/article.service';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalComments: number;
  totalUsers: number;
  pendingComments: number;
  todayArticles: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  template: `
    <div class="admin-dashboard">
      <!-- Page Header -->
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">Hoş geldiniz! İşte sistemin genel durumu.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Articles -->
        <mat-card class="stat-card">
          <mat-card-content class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Toplam Haber</p>
              <h3 class="text-3xl font-bold">{{ stats().totalArticles }}</h3>
              <p class="text-xs text-green-600 mt-1">
                <mat-icon class="text-xs align-middle">trending_up</mat-icon>
                +{{ stats().todayArticles }} bugün
              </p>
            </div>
            <div class="icon-wrapper bg-blue-100 text-blue-600 p-4 rounded-full">
              <mat-icon class="text-4xl">article</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Total Views -->
        <mat-card class="stat-card">
          <mat-card-content class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Toplam Görüntülenme</p>
              <h3 class="text-3xl font-bold">{{ formatNumber(stats().totalViews) }}</h3>
              <p class="text-xs text-gray-500 mt-1">Tüm zamanlar</p>
            </div>
            <div class="icon-wrapper bg-green-100 text-green-600 p-4 rounded-full">
              <mat-icon class="text-4xl">visibility</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Total Comments -->
        <mat-card class="stat-card">
          <mat-card-content class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Toplam Yorum</p>
              <h3 class="text-3xl font-bold">{{ stats().totalComments }}</h3>
              <p class="text-xs text-orange-600 mt-1">
                <mat-icon class="text-xs align-middle">pending</mat-icon>
                {{ stats().pendingComments }} onay bekliyor
              </p>
            </div>
            <div class="icon-wrapper bg-orange-100 text-orange-600 p-4 rounded-full">
              <mat-icon class="text-4xl">comment</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Total Users -->
        <mat-card class="stat-card">
          <mat-card-content class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Toplam Kullanıcı</p>
              <h3 class="text-3xl font-bold">{{ stats().totalUsers }}</h3>
              <p class="text-xs text-gray-500 mt-1">Aktif üyeler</p>
            </div>
            <div class="icon-wrapper bg-purple-100 text-purple-600 p-4 rounded-full">
              <mat-icon class="text-4xl">people</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4">Hızlı İşlemler</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            mat-raised-button
            color="primary"
            routerLink="/admin/articles/create"
            class="h-24"
          >
            <div class="flex flex-col items-center gap-2">
              <mat-icon>add_circle</mat-icon>
              <span>Yeni Haber</span>
            </div>
          </button>

          <button
            mat-raised-button
            routerLink="/admin/comments"
            class="h-24"
          >
            <div class="flex flex-col items-center gap-2">
              <mat-icon>comment</mat-icon>
              <span>Yorumlar</span>
            </div>
          </button>

          <button
            mat-raised-button
            routerLink="/admin/media"
            class="h-24"
          >
            <div class="flex flex-col items-center gap-2">
              <mat-icon>photo_library</mat-icon>
              <span>Medya</span>
            </div>
          </button>

          <button
            mat-raised-button
            routerLink="/admin/users"
            class="h-24"
          >
            <div class="flex flex-col items-center gap-2">
              <mat-icon>people</mat-icon>
              <span>Kullanıcılar</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Recent Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Articles -->
        <mat-card>
          <mat-card-header>
            <mat-card-title class="flex items-center justify-between w-full">
              <span>Son Haberler</span>
              <button mat-button color="primary" routerLink="/admin/articles">
                Tümünü Gör
              </button>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (recentArticles().length > 0) {
              <div class="divide-y">
                @for (article of recentArticles(); track article.id) {
                  <div class="py-3 flex items-center gap-3">
                    @if (article.featured_image) {
                      <img
                        [src]="article.featured_image.file"
                        [alt]="article.title"
                        class="w-16 h-16 object-cover rounded"
                      >
                    } @else {
                      <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <mat-icon>image</mat-icon>
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-sm truncate">{{ article.title }}</h4>
                      <p class="text-xs text-gray-500">
                        {{ article.category.name }} • {{ article.views_count }} görüntülenme
                      </p>
                    </div>
                    <button
                      mat-icon-button
                      [routerLink]="['/admin/articles/edit', article.id]"
                    >
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8 text-gray-500">
                <mat-icon class="text-4xl mb-2">article</mat-icon>
                <p>Henüz haber yok</p>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <!-- Activity Feed -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Son Aktiviteler</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-feed space-y-4">
              @for (activity of activities; track activity.id) {
                <div class="flex items-start gap-3">
                  <div class="icon-wrapper flex-shrink-0"
                       [class]="'bg-' + activity.color + '-100 text-' + activity.color + '-600 p-2 rounded-full'">
                    <mat-icon class="text-sm">{{ activity.icon }}</mat-icon>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm">{{ activity.message }}</p>
                    <span class="text-xs text-gray-500">{{ activity.time }}</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1400px;
    }

    .stat-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .icon-wrapper mat-icon {
      width: 40px;
      height: 40px;
      font-size: 40px;
    }

    .activity-feed .icon-wrapper mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private articleService = inject(ArticleService);

  stats = signal<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalComments: 0,
    totalUsers: 0,
    pendingComments: 0,
    todayArticles: 0
  });

  recentArticles = signal<any[]>([]);

  // Mock data - backend'den gelecek
  activities = [
    {
      id: 1,
      icon: 'article',
      message: 'Yeni haber yayınlandı: "Ekonomide Yeni Gelişmeler"',
      time: '5 dakika önce',
      color: 'blue'
    },
    {
      id: 2,
      icon: 'comment',
      message: '3 yeni yorum onay bekliyor',
      time: '15 dakika önce',
      color: 'orange'
    },
    {
      id: 3,
      icon: 'person_add',
      message: 'Yeni kullanıcı kaydı: user@example.com',
      time: '1 saat önce',
      color: 'green'
    },
    {
      id: 4,
      icon: 'edit',
      message: '"Spor Haberleri" kategorisi güncellendi',
      time: '2 saat önce',
      color: 'purple'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load recent articles
    this.articleService.getArticles({ page: 1, page_size: 5 }).subscribe({
      next: (response) => {
        this.recentArticles.set(response.results || []);
        
        // Calculate stats from articles
        const articles = response.results || [];
        const totalViews = articles.reduce((sum, art) => sum + art.views_count, 0);
        
        this.stats.update(current => ({
          ...current,
          totalArticles: response.count || 0,
          publishedArticles: articles.filter(a => a.status === 'published').length,
          totalViews: totalViews
        }));
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });

    // Mock stats - gerçek API'den gelecek
    this.stats.update(current => ({
      ...current,
      totalComments: 156,
      totalUsers: 1247,
      pendingComments: 5,
      todayArticles: 3
    }));
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
