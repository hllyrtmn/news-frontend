import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Comment } from '../../../core/models/comment.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="comment-list">
      @if (comments().length === 0 && !isLoading()) {
        <div class="text-center py-8 text-gray-500">
          <mat-icon class="text-4xl mb-2">chat_bubble_outline</mat-icon>
          <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
      }

      @for (comment of comments(); track comment.id) {
        <div class="comment mb-4 p-4 bg-white rounded-lg border"
             [class.ml-12]="comment.parent">
          <!-- Comment Header -->
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <mat-icon>person</mat-icon>
              </div>
              <div>
                <div class="font-semibold">{{ comment.user_name }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</div>
              </div>
            </div>

            <!-- Comment Actions Menu -->
            @if (canModifyComment(comment)) {
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="onEdit(comment)">
                  <mat-icon>edit</mat-icon>
                  <span>Düzenle</span>
                </button>
                <button mat-menu-item (click)="onDelete(comment)">
                  <mat-icon>delete</mat-icon>
                  <span>Sil</span>
                </button>
              </mat-menu>
            } @else {
              <button mat-icon-button [matMenuTriggerFor]="reportMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #reportMenu="matMenu">
                <button mat-menu-item (click)="onReport(comment)">
                  <mat-icon>flag</mat-icon>
                  <span>Şikayet Et</span>
                </button>
              </mat-menu>
            }
          </div>

          <!-- Comment Content -->
          <div class="comment-content mb-3 text-gray-700">
            {{ comment.content }}
          </div>

          <!-- Comment Footer -->
          <div class="flex items-center gap-4 text-sm">
            <button
              mat-button
              class="text-gray-600"
              (click)="onLike(comment)"
              [disabled]="!isAuthenticated()"
            >
              <mat-icon class="text-sm">thumb_up</mat-icon>
              <span class="ml-1">{{ comment.likes_count }}</span>
            </button>

            <button
              mat-button
              class="text-gray-600"
              (click)="onDislike(comment)"
              [disabled]="!isAuthenticated()"
            >
              <mat-icon class="text-sm">thumb_down</mat-icon>
              <span class="ml-1">{{ comment.dislikes_count }}</span>
            </button>

            <button
              mat-button
              class="text-gray-600"
              (click)="onReply(comment)"
              [disabled]="!isAuthenticated()"
            >
              <mat-icon class="text-sm">reply</mat-icon>
              <span class="ml-1">Yanıtla</span>
            </button>
          </div>

          <!-- Nested Replies -->
          @if (comment.replies && comment.replies.length > 0) {
            <div class="mt-4 ml-8">
              @for (reply of comment.replies; track reply.id) {
                <div class="comment mb-3 p-3 bg-gray-50 rounded-lg border">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <mat-icon class="text-sm">person</mat-icon>
                      </div>
                      <div>
                        <div class="font-semibold text-sm">{{ reply.user_name }}</div>
                        <div class="text-xs text-gray-500">{{ formatDate(reply.created_at) }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-700 mb-2">{{ reply.content }}</div>
                  <div class="flex items-center gap-3 text-xs">
                    <button mat-button class="text-gray-600" (click)="onLike(reply)" [disabled]="!isAuthenticated()">
                      <mat-icon class="text-xs">thumb_up</mat-icon>
                      <span class="ml-1">{{ reply.likes_count }}</span>
                    </button>
                    <button mat-button class="text-gray-600" (click)="onDislike(reply)" [disabled]="!isAuthenticated()">
                      <mat-icon class="text-xs">thumb_down</mat-icon>
                      <span class="ml-1">{{ reply.dislikes_count }}</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      @if (isLoading()) {
        <div class="text-center py-4">
          <p class="text-gray-500">Yorumlar yükleniyor...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .comment {
      transition: box-shadow 0.2s;
    }

    .comment:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .comment-content {
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }
  `]
})
export class CommentListComponent {
  private authService = inject(AuthService);
  private commentService = inject(CommentService);
  private notificationService = inject(NotificationService);

  @Input() set commentList(value: Comment[]) {
    this.comments.set(value || []);
  }

  @Output() replyClicked = new EventEmitter<Comment>();
  @Output() editClicked = new EventEmitter<Comment>();
  @Output() deleteClicked = new EventEmitter<Comment>();
  @Output() likeClicked = new EventEmitter<Comment>();
  @Output() dislikeClicked = new EventEmitter<Comment>();
  @Output() reportClicked = new EventEmitter<Comment>();

  comments = signal<Comment[]>([]);
  isLoading = signal<boolean>(false);

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  canModifyComment(comment: Comment): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return false;

    // User can modify their own comments or if they're admin/moderator
    return comment.user === currentUser.id ||
           currentUser.user_type === 'admin' ||
           currentUser.user_type === 'editor';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;

    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onReply(comment: Comment): void {
    this.replyClicked.emit(comment);
  }

  onEdit(comment: Comment): void {
    this.editClicked.emit(comment);
  }

  onDelete(comment: Comment): void {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      this.deleteClicked.emit(comment);
    }
  }

  onLike(comment: Comment): void {
    this.likeClicked.emit(comment);
  }

  onDislike(comment: Comment): void {
    this.dislikeClicked.emit(comment);
  }

  onReport(comment: Comment): void {
    this.reportClicked.emit(comment);
  }
}
