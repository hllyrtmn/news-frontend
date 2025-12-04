import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, Meta, Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { NotificationService } from '../../../core/services/notification.service';
import { SeoService } from '../../../core/services/seo.service';
import { ArticleService } from '../services/article.service';

// Models
import { Article } from '../../../core/models';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss'
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private seoService = inject(SeoService);
  private notificationService = inject(NotificationService);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();

  // Signals
  article = signal<Article | null>(null);
  relatedArticles = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Computed properties
  get articleContent(): SafeHtml {
    const content = this.article()?.content || '';
    return this.sanitizer.sanitize(1, content) || '';
  }

  get readingTime(): string {
    const minutes = this.article()?.read_time || 0;
    return `${minutes} dakika okuma`;
  }

  get publishDate(): string {
    const date = this.article()?.published_at;
    if (!date) return '';
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const slug = params['slug'];
        if (slug) {
          this.loadArticle(slug);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadArticle(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.articleService.getArticleBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.article.set(article);
          this.updateSEO(article);
          this.incrementViews(slug);
          this.loadRelatedArticles(article.id);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading article:', error);
          this.error.set('Haber yüklenirken bir hata oluştu.');
          this.notificationService.error('Haber bulunamadı!');
          this.isLoading.set(false);
          // Redirect to home after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      });
  }

  private updateSEO(article: Article): void {
    // Update meta tags
    this.seoService.updateTags({
      title: article.meta_title || article.title,
      description: article.meta_description || article.summary,
      keywords: article.meta_keywords,
      image: article.og_image || article.featured_image?.file,
      type: 'article',
      author: article.author.display_name,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      section: article.category.name,
      tags: article.tags.map(t => t.name)
    });

    // Generate structured data
    this.seoService.generateArticleStructuredData(article);

    // Generate breadcrumb
    const breadcrumbs = [
      { name: 'Ana Sayfa', url: window.location.origin },
      { name: article.category.name, url: `${window.location.origin}/category/${article.category.slug}` },
      { name: article.title, url: window.location.href }
    ];
    this.seoService.generateBreadcrumbStructuredData(breadcrumbs);
  }

  private incrementViews(slug: string): void {
    // Increment view count (fire and forget)
    this.articleService.incrementViews(slug).subscribe({
      error: (error) => console.error('Error incrementing views:', error)
    });
  }

  private loadRelatedArticles(articleId: number): void {
    // TODO: Implement related articles API call
    // For now, we'll leave it empty
    this.relatedArticles.set([]);
  }

  // Share functionality
  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnTwitter(): void {
    const article = this.article();
    if (!article) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  shareOnWhatsApp(): void {
    const article = this.article();
    if (!article) return;

    const text = encodeURIComponent(`${article.title} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.notificationService.success('Link kopyalandı!');
    }).catch(() => {
      this.notificationService.error('Link kopyalanamadı!');
    });
  }

  // Navigation
  goToCategory(categorySlug: string): void {
    this.router.navigate(['/category', categorySlug]);
  }

  goToTag(tagSlug: string): void {
    this.router.navigate(['/tag', tagSlug]);
  }

  goToAuthor(authorSlug: string): void {
    this.router.navigate(['/author', authorSlug]);
  }

  // Print article
  printArticle(): void {
    window.print();
  }
}
