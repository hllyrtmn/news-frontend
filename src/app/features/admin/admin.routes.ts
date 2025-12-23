import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],  // ✅ GUARD
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'articles',
        loadChildren: () => import('./articles/articles-admin.routes').then(m => m.ARTICLES_ADMIN_ROUTES)
      }
    ]
  }
];
