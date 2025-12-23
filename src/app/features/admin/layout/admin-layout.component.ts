import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { AdminHeaderComponent } from './admin-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  template: `
    <div class="admin-layout flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <app-admin-sidebar
        [isCollapsed]="isSidebarCollapsed()"
        (toggleSidebar)="toggleSidebar()"
        class="transition-all duration-300"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <app-admin-header
          (toggleSidebar)="toggleSidebar()"
        />

        <!-- Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .admin-layout {
      width: 100vw;
    }
  `]
})
export class AdminLayoutComponent {
  isSidebarCollapsed = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(value => !value);
  }
}
