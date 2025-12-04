import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { Comment, PaginatedResponse } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

export interface CommentCreateData {
  article: number;
  content: string;
  parent?: number;
}

export interface CommentUpdateData {
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiService = inject(ApiService);

  // Get comments for an article
  getArticleComments(articleId: number, params?: any): Observable<PaginatedResponse<Comment>> {
    return this.apiService.get<PaginatedResponse<Comment>>(
      `${API_ENDPOINTS.COMMENTS.LIST}?article=${articleId}`,
      params
    );
  }

  // Get comment by ID
  getComment(id: number): Observable<Comment> {
    return this.apiService.get<Comment>(
      API_ENDPOINTS.COMMENTS.DETAIL(id)
    );
  }

  // Create comment
  createComment(data: CommentCreateData): Observable<Comment> {
    return this.apiService.post<Comment>(API_ENDPOINTS.COMMENTS.CREATE, data);
  }

  // Update comment
  updateComment(id: number, data: CommentUpdateData): Observable<Comment> {
    return this.apiService.put<Comment>(
      API_ENDPOINTS.COMMENTS.UPDATE(id),
      data
    );
  }

  // Delete comment
  deleteComment(id: number): Observable<void> {
    return this.apiService.delete<void>(
      API_ENDPOINTS.COMMENTS.DELETE(id)
    );
  }

  // Like comment
  likeComment(id: number): Observable<void> {
    return this.apiService.post<void>(
      API_ENDPOINTS.COMMENTS.LIKE(id),
      {}
    );
  }

  // Dislike comment (NOT IMPLEMENTED IN BACKEND)
  dislikeComment(id: number): Observable<void> {
    // Backend'de dislike endpoint yok, like'ı toggle olarak kullan
    console.warn('Dislike endpoint not implemented in backend');
    return this.likeComment(id);
  }

  // Report comment (NOT IMPLEMENTED IN BACKEND)
  reportComment(id: number, reason: string): Observable<void> {
    console.warn('Report endpoint not implemented in backend');
    // Geçici olarak empty observable döndür
    return of(undefined) as Observable<void>;
  }
}
