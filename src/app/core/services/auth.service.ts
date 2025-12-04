import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  TokenRefreshResponse,
  UserPreference
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Computed signals
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.user_type === 'admin' || user?.is_superuser || false;
  });
  isEditor = computed(() => {
    const user = this.currentUserSignal();
    return user?.user_type === 'editor' || user?.user_type === 'admin' || user?.is_superuser || false;
  });
  isAuthor = computed(() => {
    const user = this.currentUserSignal();
    return ['author', 'editor', 'admin'].includes(user?.user_type || '') || user?.is_superuser || false;
  });

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  // Initialize authentication state from storage
  private initializeAuth(): void {
    const token = this.storageService.getAccessToken();
    const user = this.storageService.getCurrentUser();
    
    if (token && user) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Register
  register(data: RegisterRequest): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.AUTH.REGISTER, data).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  // Logout
  logout(): void {
    this.storageService.removeTokens();
    this.storageService.removeCurrentUser();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/auth/login']);
  }

  // Refresh token
  refreshToken(): Observable<TokenRefreshResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<TokenRefreshResponse>(
      API_ENDPOINTS.AUTH.TOKEN_REFRESH,
      { refresh: refreshToken }
    ).pipe(
      tap(response => {
        this.storageService.setAccessToken(response.access);
        if (response.refresh) {
          this.storageService.setRefreshToken(response.refresh);
        }
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Get current user profile
  getProfile(): Observable<User> {
    return this.apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        this.storageService.setCurrentUser(user);
      })
    );
  }

  // Update profile
  updateProfile(data: Partial<User>): Observable<User> {
    return this.apiService.patch<User>(API_ENDPOINTS.AUTH.PROFILE, data).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        this.storageService.setCurrentUser(user);
      })
    );
  }

  // Change password
  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  // Get user preferences
  getPreferences(): Observable<UserPreference> {
    return this.apiService.get<UserPreference>(API_ENDPOINTS.AUTH.PREFERENCES);
  }

  // Update user preferences
  updatePreferences(data: Partial<UserPreference>): Observable<UserPreference> {
    return this.apiService.patch<UserPreference>(API_ENDPOINTS.AUTH.PREFERENCES, data);
  }

  // Handle successful authentication
  private handleAuthSuccess(response: LoginResponse): void {
    this.storageService.setAccessToken(response.access);
    this.storageService.setRefreshToken(response.refresh);
    this.storageService.setCurrentUser(response.user);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    return user?.user_type === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSignal();
    return roles.includes(user?.user_type || '');
  }

  // Get access token
  getAccessToken(): string | null {
    return this.storageService.getAccessToken();
  }

  // Check if token exists
  hasToken(): boolean {
    return !!this.storageService.getAccessToken();
  }
}
