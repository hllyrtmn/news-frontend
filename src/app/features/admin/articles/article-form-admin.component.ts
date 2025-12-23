import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Category } from '../../../core/models/category.model';
import { Tag } from '../../../core/models/tag.model';
import { ArticleService } from '../../articles/services/article.service';

@Component({
  selector: 'app-article-form-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CKEditorModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditMode() ? 'Haber Düzenle' : 'Yeni Haber Ekle' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ isEditMode() ? 'Mevcut haberi düzenleyin' : 'Yeni bir haber oluşturun ve yayınlayın' }}
          </p>
        </div>
        <button
          [routerLink]="['/admin/articles']"
          class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <span class="material-icons">arrow_back</span>
          Geri Dön
        </button>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-600 mt-4">Yükleniyor...</p>
        </div>
      }

      <!-- Form -->
      @else {
        <form [formGroup]="articleForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Title -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  formControlName="title"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Haber başlığını girin...">
                @if (articleForm.get('title')?.invalid && articleForm.get('title')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Başlık zorunludur</p>
                }
              </div>

              <!-- Summary -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Özet
                </label>
                <textarea
                  formControlName="summary"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Haber özetini girin (opsiyonel)..."></textarea>
              </div>

              <!-- Content -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  İçerik *
                </label>
                <ckeditor
                  [editor]="Editor"
                  formControlName="content"
                  [config]="editorConfig"></ckeditor>
                @if (articleForm.get('content')?.invalid && articleForm.get('content')?.touched) {
                  <p class="mt-1 text-sm text-red-600">İçerik zorunludur</p>
                }
              </div>

              <!-- SEO Section -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span class="material-icons">search</span>
                  SEO Bilgileri
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      SEO Başlık
                    </label>
                    <input
                      type="text"
                      formControlName="meta_title"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Arama motorları için başlık...">
                    <p class="mt-1 text-xs text-gray-500">
                      {{ articleForm.get('meta_title')?.value?.length || 0 }} / 60 karakter
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      SEO Açıklama
                    </label>
                    <textarea
                      formControlName="meta_description"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Arama motorları için açıklama..."></textarea>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ articleForm.get('meta_description')?.value?.length || 0 }} / 160 karakter
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Anahtar Kelimeler
                    </label>
                    <input
                      type="text"
                      formControlName="meta_keywords"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="kelime1, kelime2, kelime3...">
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Status & Publish -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Yayın Durumu</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Durum *
                    </label>
                    <select
                      formControlName="status"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="draft">Taslak</option>
                      <option value="published">Yayınla</option>
                      <option value="archived">Arşivle</option>
                    </select>
                  </div>

                  @if (articleForm.get('status')?.value === 'published') {
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          formControlName="is_featured"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <span class="ml-2 text-sm text-gray-700">Öne Çıkan Haber</span>
                      </label>
                    </div>
                  }
                </div>
              </div>

              <!-- Featured Image -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Kapak Görseli</h3>

                @if (imagePreview()) {
                  <div class="relative">
                    <img
                      [src]="imagePreview()"
                      alt="Preview"
                      class="w-full h-48 object-cover rounded-lg">
                    <button
                      type="button"
                      (click)="removeImage()"
                      class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <span class="material-icons text-sm">close</span>
                    </button>
                  </div>
                } @else {
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <span class="material-icons text-4xl text-gray-400 mb-2">image</span>
                    <p class="text-sm text-gray-600 mb-2">Görsel yükleyin</p>
                    <input
                      type="file"
                      (change)="onImageSelect($event)"
                      accept="image/*"
                      class="hidden"
                      #fileInput>
                    <button
                      type="button"
                      (click)="fileInput.click()"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Dosya Seç
                    </button>
                  </div>
                }

                <input type="hidden" formControlName="featured_image">
              </div>

              <!-- Category -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Kategori *</h3>
                <select
                  formControlName="category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Kategori Seçin</option>
                  @for (category of categories(); track category.id) {
                    <option [value]="category.id">{{ category.name }}</option>
                  }
                </select>
                @if (articleForm.get('category')?.invalid && articleForm.get('category')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Kategori seçimi zorunludur</p>
                }
              </div>

              <!-- Tags -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Etiketler</h3>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  @for (tag of tags(); track tag.id) {
                    <label class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        [value]="tag.id"
                        (change)="onTagChange($event, tag.id)"
                        [checked]="selectedTags().includes(tag.id)"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                      <span class="ml-2 text-sm text-gray-700">{{ tag.name }}</span>
                    </label>
                  }
                </div>
                @if (selectedTags().length > 0) {
                  <div class="mt-4 flex flex-wrap gap-2">
                    @for (tagId of selectedTags(); track tagId) {
                      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {{ getTagName(tagId) }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- Actions -->
              <div class="bg-white rounded-lg shadow-sm p-6 space-y-3">
                <button
                  type="submit"
                  [disabled]="saving() || articleForm.invalid"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  @if (saving()) {
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Kaydediliyor...
                  } @else {
                    <span class="material-icons">save</span>
                    {{ isEditMode() ? 'Değişiklikleri Kaydet' : 'Haberi Kaydet' }}
                  }
                </button>

                <button
                  type="button"
                  [routerLink]="['/admin/articles']"
                  [disabled]="saving()"
                  class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  İptal
                </button>
              </div>
            </div>
          </div>
        </form>
      }
    </div>
  `
})
export class ArticleFormAdminComponent implements OnInit {
  public Editor = ClassicEditor;
  public editorConfig = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'blockQuote', 'insertTable', '|',
      'undo', 'redo'
    ],
    language: 'tr',
    placeholder: 'Haber içeriğini buraya yazın...'
  };

  articleForm!: FormGroup;
  loading = signal(false);
  saving = signal(false);
  isEditMode = signal(false);
  articleId: number | null = null;

  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);
  selectedTags = signal<number[]>([]);
  imagePreview = signal<string | null>(null);
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadCategories();
    this.loadTags();

    // Check if edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.articleId = +params['id'];
        this.loadArticle(this.articleId);
      }
    });
  }

  initForm() {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      summary: [''],
      content: ['', Validators.required],
      category: ['', Validators.required],
      status: ['draft', Validators.required],
      is_featured: [false],
      featured_image: [''],
      meta_title: [''],
      meta_description: [''],
      meta_keywords: ['']
    });

    // Auto-generate slug from title
    this.articleForm.get('title')?.valueChanges.subscribe(title => {
      if (!this.isEditMode() && title) {
        const slug = this.generateSlug(title);
        this.articleForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.results);
      }
    });
  }

  loadTags() {
    this.tagService.getTags().subscribe({
      next: (response) => {
        this.tags.set(response.results);
      }
    });
  }

  loadArticle(id: number) {
    this.loading.set(true);
    this.articleService.getArticle(id).subscribe({
      next: (article) => {
        this.articleForm.patchValue({
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          category: article.category?.id,
          status: article.status,
          is_featured: article.is_featured,
          featured_image: article.featured_image,
          meta_title: article.meta_title,
          meta_description: article.meta_description,
          meta_keywords: article.meta_keywords
        });

        if (article.featured_image) {
          this.imagePreview.set(article.featured_image);
        }

        if (article.tags) {
          this.selectedTags.set(article.tags.map(tag => tag.id));
        }

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load article:', error);
        alert('Haber yüklenirken bir hata oluştu!');
        this.router.navigate(['/admin/articles']);
      }
    });
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];

      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage() {
    this.imagePreview.set(null);
    this.imageFile = null;
    this.articleForm.patchValue({ featured_image: '' });
  }

  onTagChange(event: Event, tagId: number) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedTags.update(tags => [...tags, tagId]);
    } else {
      this.selectedTags.update(tags => tags.filter(id => id !== tagId));
    }
  }

  getTagName(tagId: number): string {
    const tag = this.tags().find(t => t.id === tagId);
    return tag?.name || '';
  }

  generateSlug(title: string): string {
    const turkishMap: Record<string, string> = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };

    return title
      .split('')
      .map(char => turkishMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async onSubmit() {
    if (this.articleForm.invalid) {
      Object.keys(this.articleForm.controls).forEach(key => {
        this.articleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving.set(true);

    const formData = new FormData();

    // Add form fields
    Object.keys(this.articleForm.value).forEach(key => {
      const value = this.articleForm.get(key)?.value;
      if (value !== null && value !== '' && key !== 'featured_image') {
        formData.append(key, value);
      }
    });

    // Add tags
    this.selectedTags().forEach(tagId => {
      formData.append('tags', tagId.toString());
    });

    // Add image if selected
    if (this.imageFile) {
      formData.append('featured_image', this.imageFile);
    }

    const request = this.isEditMode()
      ? this.articleService.updateArticle(this.articleId!, formData)
      : this.articleService.createArticle(formData);

    request.subscribe({
      next: (article) => {
        alert(this.isEditMode() ? 'Haber başarıyla güncellendi!' : 'Haber başarıyla oluşturuldu!');
        this.router.navigate(['/admin/articles']);
      },
      error: (error) => {
        console.error('Failed to save article:', error);
        alert('Haber kaydedilirken bir hata oluştu!');
        this.saving.set(false);
      }
    });
  }
}
