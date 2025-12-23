import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly CURRENT_USER_KEY = 'current_user';

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ✅ SSR-safe localStorage access
  private getStorage(): Storage | null {
    return this.isBrowser ? localStorage : null;
  }

  // Access Token
  setAccessToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  getAccessToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem(this.ACCESS_TOKEN_KEY) : null;
  }

  removeAccessToken(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.ACCESS_TOKEN_KEY);
    }
  }

  // Refresh Token
  setRefreshToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem(this.REFRESH_TOKEN_KEY) : null;
  }

  removeRefreshToken(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  // Current User
  setCurrentUser(user: User): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  getCurrentUser(): User | null {
    const storage = this.getStorage();
    if (!storage) {
      return null;
    }

    const userJson = storage.getItem(this.CURRENT_USER_KEY);
    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  removeCurrentUser(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  // Remove all tokens and user data
  removeTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  // Clear all storage
  clear(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.clear();
    }
  }

  // Check if running in browser
  isBrowserPlatform(): boolean {
    return this.isBrowser;
  }
}
