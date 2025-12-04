import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="bg-blue-600 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Haber Sitesi</h1>
            <nav class="flex gap-4">
              <a routerLink="/" class="hover:underline">Ana Sayfa</a>
              <a routerLink="/auth/login" class="hover:underline">Giriş</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="min-h-screen bg-gray-50">
        <router-outlet />
      </main>

      <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4 text-center">
          <p>&copy; 2024 Haber Sitesi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class App {
  title = 'news-frontend';
}
