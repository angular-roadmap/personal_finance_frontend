import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse, JwtResponse, LoginRequest, RegisterRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);

  sessionExpiredMessage = signal<string | null>(null);
  isAuthenticated = signal<boolean>(false);
  private tokenInitialized = false;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    if (isPlatformBrowser(this.platformId) && !this.tokenInitialized) {
      this.tokenInitialized = true;
      const token = localStorage.getItem('token');
      console.log('[AuthService] Initializing auth, token exists:', !!token);

      if (token) {
        const isValid = this.validateToken(token);
        console.log('[AuthService] Token is valid:', isValid);
        this.isAuthenticated.set(isValid);
      }
    }
  }

  private validateToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('[AuthService] Token payload:', payload);

      // If no expiration field, treat as valid (backend will validate)
      if (!payload.exp) {
        console.log('[AuthService] No exp field - treating as valid');
        return true;
      }

      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        console.warn('[AuthService] Token expired!');
        this.handleExpiredToken();
        return false;
      }

      return true;
    } catch (e) {
      console.error('[AuthService] Token validation error:', e);
      return false;
    }
  }

  private handleExpiredToken() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.sessionExpiredMessage.set('Your session has expired. Please log in again.');
    }
  }

  isTokenValid(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('[AuthService] isTokenValid - not in browser');
      return false;
    }

    // Make sure auth is initialized
    this.initializeAuth();

    const token = localStorage.getItem('token');
    console.log('[AuthService] isTokenValid called, token exists:', !!token);
    console.log('[AuthService] isAuthenticated signal value:', this.isAuthenticated());

    if (!token) {
      this.isAuthenticated.set(false);
      return false;
    }

    return this.validateToken(token);
  }

  isAdmin(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ROLE_ADMIN';
    } catch (e) {
      return false;
    }
  }

  login(credentials: LoginRequest) {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(res => {
          if (isPlatformBrowser(this.platformId) && res.success) {
            localStorage.setItem('token', res.data.token);
            this.isAuthenticated.set(true);
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  register(credentials: RegisterRequest) {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/register`, credentials);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isAuthenticated.set(false);
      this.sessionExpiredMessage.set(null);
      this.router.navigate(['/login']);
    }
  }
}
