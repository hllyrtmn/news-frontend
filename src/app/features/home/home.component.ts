import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ArticleService } from '../articles/services/article.service';
import { ArticleListItem } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Son Haberler</h1>

      <!-- Breaking News -->
      @if (breakingNews.length > 0) {
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-4 text-red-600">Son Dakika</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (article of breakingNews; track article.id) {
              <mat-card class="cursor-pointer hover:shadow-lg transition-shadow" (click)="goToArticle(article.slug)">
                @if (article.featured_image) {
                  <img mat-card-image [src]="article.featured_image.file" [alt]="article.title">
                }
                <mat-card-header>
                  <mat-card-title>{{ article.title }}</mat-card-title>
                  <mat-card-subtitle>{{ article.category.name }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ article.summary }}</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary" (click)="$event.stopPropagation()">
                    Devamını Oku
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </section>
      }

      <!-- Featured Articles -->
      @if (featuredArticles.length > 0) {
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-4">Öne Çıkan Haberler</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (article of featuredArticles; track article.id) {
              <mat-card class="cursor-pointer hover:shadow-lg transition-shadow" (click)="goToArticle(article.slug)">
                @if (article.featured_image) {
                  <img mat-card-image [src]="article.featured_image.file" [alt]="article.title">
                }
                <mat-card-header>
                  <mat-card-title class="text-base">{{ article.title }}</mat-card-title>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-button color="primary" (click)="$event.stopPropagation()">
                    Oku
                  </button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </section>
      }

      <!-- Latest Articles -->
      <section>
        <h2 class="text-2xl font-bold mb-4">Tüm Haberler</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (article of articles; track article.id) {
            <mat-card class="cursor-pointer hover:shadow-lg transition-shadow" (click)="goToArticle(article.slug)">
              @if (article.featured_image) {
                <img mat-card-image [src]="article.featured_image.file" [alt]="article.title">
              }
              <mat-card-header>
                <mat-card-title>{{ article.title }}</mat-card-title>
                <mat-card-subtitle>
                  {{ article.category.name }} • {{ article.author.display_name }}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{ article.summary }}</p>
                <div class="text-sm text-gray-500 mt-2">
                  {{ article.views_count }} görüntülenme • {{ article.read_time }} dk okuma
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary" (click)="$event.stopPropagation()">
                  Devamını Oku
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      </section>

      @if (isLoading) {
        <div class="text-center py-8">
          <p>Yükleniyor...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  private articleService = inject(ArticleService);
  private router = inject(Router);

  articles: ArticleListItem[] = [];
  featuredArticles: ArticleListItem[] = [];
  breakingNews: ArticleListItem[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadArticles();
    this.loadFeaturedArticles();
    this.loadBreakingNews();
  }

  goToArticle(slug: string): void {
    this.router.navigate(['/article', slug]);
  }

  loadArticles(): void {
    this.isLoading = true;
    this.articleService.getArticles({ page: 1, page_size: 12 }).subscribe({
      next: (response) => {
        this.articles = response.results || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.isLoading = false;
      }
    });
  }

  loadFeaturedArticles(): void {
    this.articleService.getFeaturedArticles().subscribe({
      next: (response) => {
        this.featuredArticles = (response.results || []).slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading featured articles:', error);
      }
    });
  }

  loadBreakingNews(): void {
    this.articleService.getBreakingNews().subscribe({
      next: (response) => {
        this.breakingNews = (response.results || []).slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading breaking news:', error);
      }
    });
  }
}
