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
import { Article, ArticleListItem, Comment } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../comments/comment.service';
import { CommentListComponent } from "../../comments/components/comment-list.component";
import { CommentFormComponent } from "../../comments/components/comment-form.component";

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
    MatProgressSpinnerModule,
    CommentListComponent,
    CommentFormComponent
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
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();

  // Signals
  article = signal<Article | null>(null);
  relatedArticles = signal<ArticleListItem[]>([]);
  comments = signal<Comment[]>([]);
  isLoading = signal<boolean>(true);
  isLoadingComments = signal<boolean>(false);
  isSubmittingComment = signal<boolean>(false);
  error = signal<string | null>(null);
  replyToComment = signal<Comment | null>(null);
  editComment = signal<Comment | null>(null);

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
          this.loadRelatedArticles(article);
          this.loadComments(article.id);
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

  private loadRelatedArticles(article: Article): void {
    // Get articles from same category, excluding current article
    this.articleService.getRelatedArticles(article.category.slug, article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.relatedArticles.set(response.results || []);
        },
        error: (error) => {
          console.error('Error loading related articles:', error);
        }
      });
  }

  private loadComments(articleId: number): void {
    this.isLoadingComments.set(true);
    this.commentService.getArticleComments(articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.comments.set(response.results || []);
          this.isLoadingComments.set(false);
        },
        error: (error) => {
          console.error('Error loading comments:', error);
          this.isLoadingComments.set(false);
        }
      });
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

  // Comment functionality
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onCommentSubmit(content: string): void {
    const article = this.article();
    if (!article) return;

    const replyTo = this.replyToComment();
    const data = {
      article: article.id,
      content,
      parent: replyTo?.id
    };

    this.isSubmittingComment.set(true);
    this.commentService.createComment(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Yorumunuz gönderildi! Moderasyon sonrası yayınlanacaktır.');
          this.loadComments(article.id);
          this.replyToComment.set(null);
          this.isSubmittingComment.set(false);
        },
        error: (error) => {
          console.error('Error creating comment:', error);
          this.notificationService.error('Yorum gönderilemedi!');
          this.isSubmittingComment.set(false);
        }
      });
  }

  onCommentUpdate(data: { id: number; content: string }): void {
    this.isSubmittingComment.set(true);
    this.commentService.updateComment(data.id, { content: data.content })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Yorumunuz güncellendi!');
          const article = this.article();
          if (article) {
            this.loadComments(article.id);
          }
          this.editComment.set(null);
          this.isSubmittingComment.set(false);
        },
        error: (error) => {
          console.error('Error updating comment:', error);
          this.notificationService.error('Yorum güncellenemedi!');
          this.isSubmittingComment.set(false);
        }
      });
  }

  onCommentReply(comment: Comment): void {
    this.replyToComment.set(comment);
    this.editComment.set(null);
  }

  onCommentEdit(comment: Comment): void {
    this.editComment.set(comment);
    this.replyToComment.set(null);
  }

  onCommentDelete(comment: Comment): void {
    this.commentService.deleteComment(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Yorum silindi!');
          const article = this.article();
          if (article) {
            this.loadComments(article.id);
          }
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          this.notificationService.error('Yorum silinemedi!');
        }
      });
  }

  onCommentLike(comment: Comment): void {
    this.commentService.likeComment(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const article = this.article();
          if (article) {
            this.loadComments(article.id);
          }
        },
        error: (error) => {
          console.error('Error liking comment:', error);
        }
      });
  }

  onCommentDislike(comment: Comment): void {
    this.commentService.dislikeComment(comment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const article = this.article();
          if (article) {
            this.loadComments(article.id);
          }
        },
        error: (error) => {
          console.error('Error disliking comment:', error);
        }
      });
  }

  onCommentReport(comment: Comment): void {
    const reason = prompt('Şikayet nedeninizi belirtin:');
    if (!reason) return;

    this.commentService.reportComment(comment.id, reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Şikayetiniz alındı!');
        },
        error: (error) => {
          console.error('Error reporting comment:', error);
          this.notificationService.error('Şikayet gönderilemedi!');
        }
      });
  }

  onCommentFormCancel(): void {
    this.replyToComment.set(null);
    this.editComment.set(null);
  }

  goToRelatedArticle(slug: string): void {
    this.router.navigate(['/article', slug]);
  }
}
