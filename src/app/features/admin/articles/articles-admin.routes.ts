import { Routes } from '@angular/router';

export const ARTICLES_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./articles-list-admin.component').then(m => m.ArticlesListAdminComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./article-form-admin.component').then(m => m.ArticleFormAdminComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./article-form-admin.component').then(m => m.ArticleFormAdminComponent)
  }
];
