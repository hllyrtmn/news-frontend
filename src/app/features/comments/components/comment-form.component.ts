import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="comment-form p-4 bg-gray-50 rounded-lg">
      @if (replyTo) {
        <div class="mb-3 p-3 bg-blue-50 rounded flex items-start justify-between">
          <div class="flex-1">
            <div class="text-sm font-semibold text-blue-900 mb-1">
              {{ replyTo.user_name }} kullanıcısına yanıt veriyorsunuz
            </div>
            <div class="text-xs text-blue-700 line-clamp-2">
              {{ replyTo.content }}
            </div>
          </div>
          <button mat-icon-button (click)="cancelReply()">
            <mat-icon class="text-blue-900">close</mat-icon>
          </button>
        </div>
      }

      @if (editMode && editComment) {
        <div class="mb-3 p-3 bg-amber-50 rounded flex items-start justify-between">
          <div class="flex items-center gap-2">
            <mat-icon class="text-amber-900">edit</mat-icon>
            <span class="text-sm font-semibold text-amber-900">
              Yorumunuzu düzenliyorsunuz
            </span>
          </div>
          <button mat-icon-button (click)="cancelEdit()">
            <mat-icon class="text-amber-900">close</mat-icon>
          </button>
        </div>
      }

      <form [formGroup]="commentForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full" appearance="outline">
          <mat-label>
            {{ editMode ? 'Yorumunuzu düzenleyin' : (replyTo ? 'Yanıtınızı yazın' : 'Yorumunuzu yazın') }}
          </mat-label>
          <textarea
            matInput
            formControlName="content"
            rows="4"
            placeholder="Düşüncelerinizi paylaşın..."
            [maxlength]="maxLength"
          ></textarea>
          <mat-hint align="end">
            {{ commentForm.get('content')?.value?.length || 0 }} / {{ maxLength }}
          </mat-hint>
          @if (commentForm.get('content')?.hasError('required') && commentForm.get('content')?.touched) {
            <mat-error>Yorum alanı boş bırakılamaz</mat-error>
          }
          @if (commentForm.get('content')?.hasError('minlength')) {
            <mat-error>Yorum en az {{ minLength }} karakter olmalıdır</mat-error>
          }
        </mat-form-field>

        <div class="flex items-center justify-between mt-3">
          <div class="text-xs text-gray-500">
            <mat-icon class="text-sm align-middle mr-1">info</mat-icon>
            Yorumunuz moderasyon sonrası yayınlanacaktır
          </div>

          <div class="flex gap-2">
            @if (editMode || replyTo) {
              <button
                mat-button
                type="button"
                (click)="editMode ? cancelEdit() : cancelReply()"
              >
                İptal
              </button>
            }

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="commentForm.invalid || isSubmitting"
            >
              @if (isSubmitting) {
                <span>Gönderiliyor...</span>
              } @else {
                <span>{{ editMode ? 'Güncelle' : 'Gönder' }}</span>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }
  `]
})
export class CommentFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() replyTo: Comment | null = null;
  @Input() editMode: boolean = false;
  @Input() editComment: Comment | null = null;
  @Input() isSubmitting: boolean = false;
  @Input() minLength: number = 10;
  @Input() maxLength: number = 1000;

  @Output() commentSubmitted = new EventEmitter<string>();
  @Output() commentUpdated = new EventEmitter<{ id: number; content: string }>();
  @Output() cancelled = new EventEmitter<void>();

  commentForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const content = this.editMode && this.editComment ? this.editComment.content : '';

    this.commentForm = this.fb.group({
      content: [
        content,
        [
          Validators.required,
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength)
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const content = this.commentForm.get('content')?.value.trim();

      if (this.editMode && this.editComment) {
        this.commentUpdated.emit({
          id: this.editComment.id,
          content
        });
      } else {
        this.commentSubmitted.emit(content);
      }
    }
  }

  cancelReply(): void {
    this.commentForm.reset();
    this.cancelled.emit();
  }

  cancelEdit(): void {
    this.commentForm.reset();
    this.cancelled.emit();
  }

  reset(): void {
    this.commentForm.reset();
  }
}
