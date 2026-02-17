import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);
  
  // Initialize signals safely
  isAuthenticated = signal<boolean>(
    isPlatformBrowser(this.platformId) ? !!localStorage.getItem('token') : false
  );
  
  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.API_URL}/login`, credentials, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('token', token);
          this.isAuthenticated.set(true);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}