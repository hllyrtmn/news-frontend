import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_CONFIG } from '../constants/app-config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Set item to localStorage
  setItem(key: string, value: any): void {
    if (!this.isBrowser) return;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  // Get item from localStorage
  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from localStorage', error);
      return null;
    }
  }

  // Remove item from localStorage
  removeItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  // Clear all localStorage
  clear(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  // Token management
  getAccessToken(): string | null {
    return this.getItem<string>(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    this.setItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.getItem<string>(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.setItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  removeTokens(): void {
    this.removeItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User management
  getCurrentUser(): any {
    return this.getItem(APP_CONFIG.STORAGE_KEYS.USER);
  }

  setCurrentUser(user: any): void {
    this.setItem(APP_CONFIG.STORAGE_KEYS.USER, user);
  }

  removeCurrentUser(): void {
    this.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
  }

  // Theme management
  getTheme(): string | null {
    return this.getItem<string>(APP_CONFIG.STORAGE_KEYS.THEME);
  }

  setTheme(theme: string): void {
    this.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
  }

  // Language management
  getLanguage(): string | null {
    return this.getItem<string>(APP_CONFIG.STORAGE_KEYS.LANGUAGE);
  }

  setLanguage(language: string): void {
    this.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, language);
  }

  // Recent searches
  getRecentSearches(): string[] {
    return this.getItem<string[]>(APP_CONFIG.STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  addRecentSearch(query: string): void {
    const searches = this.getRecentSearches();
    const filtered = searches.filter(s => s !== query);
    filtered.unshift(query);
    const limited = filtered.slice(0, 10); // Keep only last 10 searches
    this.setItem(APP_CONFIG.STORAGE_KEYS.RECENT_SEARCHES, limited);
  }

  clearRecentSearches(): void {
    this.removeItem(APP_CONFIG.STORAGE_KEYS.RECENT_SEARCHES);
  }
}
