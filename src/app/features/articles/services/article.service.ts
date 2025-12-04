import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  Article,
  ArticleListItem,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleFilters,
  PaginatedResponse
} from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private apiService: ApiService) {}

  // Get all articles with filters
  getArticles(filters?: ArticleFilters): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.BASE,
      filters
    );
  }

  // Get single article by slug
  getArticleBySlug(slug: string): Observable<Article> {
    return this.apiService.get<Article>(API_ENDPOINTS.ARTICLES.DETAIL(slug));
  }

  // Get featured articles
  getFeaturedArticles(): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.FEATURED
    );
  }

  // Get breaking news
  getBreakingNews(): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.BREAKING
    );
  }

  // Get trending articles
  getTrendingArticles(): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.TRENDING
    );
  }

  // Get articles by category
  getArticlesByCategory(categorySlug: string, page?: number): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.BY_CATEGORY(categorySlug),
      { page }
    );
  }

  // Get articles by tag
  getArticlesByTag(tagSlug: string, page?: number): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.BY_TAG(tagSlug),
      { page }
    );
  }

  // Get articles by author
  getArticlesByAuthor(authorSlug: string, page?: number): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.BY_AUTHOR(authorSlug),
      { page }
    );
  }

  // Search articles
  searchArticles(query: string, page?: number): Observable<PaginatedResponse<ArticleListItem>> {
    return this.apiService.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES.SEARCH(query),
      { page }
    );
  }

  // Create article (admin/editor/author)
  createArticle(data: ArticleCreateRequest): Observable<Article> {
    const formData = this.prepareFormData(data);
    return this.apiService.upload<Article>(API_ENDPOINTS.ARTICLES.BASE, formData);
  }

  // Update article (admin/editor/author)
  updateArticle(id: number, data: ArticleUpdateRequest): Observable<Article> {
    const formData = this.prepareFormData(data);
    return this.apiService.put<Article>(`${API_ENDPOINTS.ARTICLES.BASE}${id}/`, formData);
  }

  // Delete article (admin/editor)
  deleteArticle(id: number): Observable<void> {
    return this.apiService.delete<void>(`${API_ENDPOINTS.ARTICLES.BASE}${id}/`);
  }

  // Increment article views
  incrementViews(slug: string): Observable<void> {
    return this.apiService.post<void>(`${API_ENDPOINTS.ARTICLES.DETAIL(slug)}increment_views/`, {});
  }

  // Prepare FormData for article creation/update
  private prepareFormData(data: any): FormData {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value === null || value === undefined) {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          formData.append(key, item.toString());
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    return formData;
  }
}
