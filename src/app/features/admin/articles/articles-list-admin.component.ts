import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../core/services/article.service';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { Article } from '../../../core/models/article.model';
import { Category } from '../../../core/models/category.model';
import { Tag } from '../../../core/models/tag.model';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ArticleFilters {
  search: string;
  category: string;
  tag: string;
  status: string;
  ordering: string;
}

@Component({
  selector: 'app-articles-list-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Haberler</h1>
          <p class="text-gray-600 mt-1">Tüm haberleri görüntüleyin ve yönetin</p>
        </div>
        <button
          [routerLink]="['/admin/articles/create']"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <span class="material-icons text-xl">add</span>
          Yeni Haber Ekle
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ara</label>
            <input
              type="text"
              [(ngModel)]="filters.search"
              (ngModelChange)="onFilterChange()"
              placeholder="Başlık veya içerik ara..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              [(ngModel)]="filters.category"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tüm Kategoriler</option>
              @for (category of categories(); track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select
              [(ngModel)]="filters.status"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tümü</option>
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşiv</option>
            </select>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sırala</label>
            <select
              [(ngModel)]="filters.ordering"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="-created_at">En Yeni</option>
              <option value="created_at">En Eski</option>
              <option value="-views_count">En Çok Görüntülenen</option>
              <option value="title">Başlık (A-Z)</option>
              <option value="-title">Başlık (Z-A)</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        @if (hasActiveFilters()) {
          <div class="mt-4 flex items-center gap-2 flex-wrap">
            <span class="text-sm text-gray-600">Aktif Filtreler:</span>
            @if (filters.search) {
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {{ filters.search }}
                <button (click)="clearFilter('search')" class="hover:text-blue-900">
                  <span class="material-icons text-sm">close</span>
                </button>
              </span>
            }
            @if (filters.category) {
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {{ getCategoryName(filters.category) }}
                <button (click)="clearFilter('category')" class="hover:text-blue-900">
                  <span class="material-icons text-sm">close</span>
                </button>
              </span>
            }
            @if (filters.status) {
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {{ getStatusLabel(filters.status) }}
                <button (click)="clearFilter('status')" class="hover:text-blue-900">
                  <span class="material-icons text-sm">close</span>
                </button>
              </span>
            }
            <button
              (click)="clearAllFilters()"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Tümünü Temizle
            </button>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-600 mt-4">Yükleniyor...</p>
        </div>
      }

      <!-- Articles Table -->
      @else if (articles().length > 0) {
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Haber
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (article of articles(); track article.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <!-- Article Info -->
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        @if (article.featured_image) {
                          <img
                            [src]="article.featured_image"
                            [alt]="article.title"
                            class="h-12 w-20 object-cover rounded mr-4">
                        }
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ article.title }}
                          </p>
                          <p class="text-sm text-gray-500 truncate">
                            {{ article.author?.display_name || 'Yazar Yok' }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <!-- Category -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [style.background-color]="article.category?.color_code || '#6B7280'"
                        [style.color]="'white'">
                        {{ article.category?.name || 'Yok' }}
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800': article.status === 'published',
                          'bg-yellow-100 text-yellow-800': article.status === 'draft',
                          'bg-gray-100 text-gray-800': article.status === 'archived'
                        }">
                        {{ getStatusLabel(article.status) }}
                      </span>
                    </td>

                    <!-- Stats -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-1">
                          <span class="material-icons text-sm">visibility</span>
                          {{ formatNumber(article.views_count) }}
                        </div>
                        <div class="flex items-center gap-1">
                          <span class="material-icons text-sm">comment</span>
                          {{ article.comments_count || 0 }}
                        </div>
                      </div>
                    </td>

                    <!-- Date -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="flex flex-col gap-1">
                        <div>{{ formatDate(article.created_at) }}</div>
                        @if (article.published_at) {
                          <div class="text-xs text-gray-400">
                            Yayın: {{ formatDate(article.published_at) }}
                          </div>
                        }
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          [href]="'/article/' + article.slug"
                          target="_blank"
                          class="text-gray-600 hover:text-gray-900 transition-colors"
                          title="Görüntüle">
                          <span class="material-icons text-xl">visibility</span>
                        </a>
                        <button
                          [routerLink]="['/admin/articles/edit', article.id]"
                          class="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Düzenle">
                          <span class="material-icons text-xl">edit</span>
                        </button>
                        <button
                          (click)="deleteArticle(article)"
                          class="text-red-600 hover:text-red-900 transition-colors"
                          title="Sil">
                          <span class="material-icons text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage() === 1"
                  [class.opacity-50]="currentPage() === 1"
                  [class.cursor-not-allowed]="currentPage() === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Önceki
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage() === totalPages()"
                  [class.opacity-50]="currentPage() === totalPages()"
                  [class.cursor-not-allowed]="currentPage() === totalPages()"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Sonraki
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Toplam <span class="font-medium">{{ totalCount() }}</span> haberin
                    <span class="font-medium">{{ (currentPage() - 1) * pageSize() + 1 }}</span> -
                    <span class="font-medium">{{ Math.min(currentPage() * pageSize(), totalCount()) }}</span> arası gösteriliyor
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      (click)="previousPage()"
                      [disabled]="currentPage() === 1"
                      [class.opacity-50]="currentPage() === 1"
                      [class.cursor-not-allowed]="currentPage() === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="material-icons text-xl">chevron_left</span>
                    </button>

                    @for (page of getPageNumbers(); track page) {
                      @if (page === '...') {
                        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      } @else {
                        <button
                          (click)="goToPage(+page)"
                          [class.bg-blue-50]="currentPage() === +page"
                          [class.border-blue-500]="currentPage() === +page"
                          [class.text-blue-600]="currentPage() === +page"
                          [class.z-10]="currentPage() === +page"
                          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          {{ page }}
                        </button>
                      }
                    }

                    <button
                      (click)="nextPage()"
                      [disabled]="currentPage() === totalPages()"
                      [class.opacity-50]="currentPage() === totalPages()"
                      [class.cursor-not-allowed]="currentPage() === totalPages()"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="material-icons text-xl">chevron_right</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty State -->
      @else {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <span class="material-icons text-6xl text-gray-400 mb-4">article</span>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Haber Bulunamadı</h3>
          <p class="text-gray-600 mb-6">
            @if (hasActiveFilters()) {
              Filtrelere uygun haber bulunamadı. Filtreleri temizlemeyi deneyin.
            } @else {
              Henüz haber eklenmemiş. İlk haberi eklemek için butona tıklayın.
            }
          </p>
          <button
            [routerLink]="['/admin/articles/create']"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors">
            <span class="material-icons">add</span>
            İlk Haberi Ekle
          </button>
        </div>
      }
    </div>
  `
})
export class ArticlesListAdminComponent implements OnInit {
  Math = Math;

  // Signals
  articles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  pageSize = signal(20);
  totalCount = signal(0);

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  // Filters
  filters: ArticleFilters = {
    search: '',
    category: '',
    tag: '',
    status: '',
    ordering: '-created_at'
  };

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadArticles();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.results);
      }
    });
  }

  loadArticles() {
    this.loading.set(true);

    const params: any = {
      page: this.currentPage(),
      page_size: this.pageSize(),
      ordering: this.filters.ordering
    };

    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.tag) params.tags = this.filters.tag;
    if (this.filters.status) params.status = this.filters.status;

    this.articleService.getArticles(params).subscribe({
      next: (response) => {
        this.articles.set(response.results);
        this.totalCount.set(response.count);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load articles:', error);
        this.loading.set(false);
      }
    });
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.loadArticles();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.search || this.filters.category || this.filters.tag || this.filters.status);
  }

  clearFilter(filterName: keyof ArticleFilters) {
    this.filters[filterName] = '';
    this.onFilterChange();
  }

  clearAllFilters() {
    this.filters = {
      search: '',
      category: '',
      tag: '',
      status: '',
      ordering: '-created_at'
    };
    this.onFilterChange();
  }

  deleteArticle(article: Article) {
    if (!confirm(`"${article.title}" başlıklı haberi silmek istediğinizden emin misiniz?`)) {
      return;
    }

    this.articleService.deleteArticle(article.id).subscribe({
      next: () => {
        alert('Haber başarıyla silindi!');
        this.loadArticles();
      },
      error: (error) => {
        console.error('Failed to delete article:', error);
        alert('Haber silinirken bir hata oluştu!');
      }
    });
  }

  // Pagination
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadArticles();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadArticles();
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadArticles();
  }

  getPageNumbers(): (number | string)[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  }

  // Helpers
  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id.toString() === categoryId);
    return category?.name || 'Bilinmeyen';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'draft': 'Taslak',
      'published': 'Yayında',
      'archived': 'Arşiv'
    };
    return labels[status] || status;
  }

  formatDate(dateString: string): string {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: tr });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
