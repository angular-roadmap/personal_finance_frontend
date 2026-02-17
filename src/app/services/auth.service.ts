import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface JwtResponse {
  token: string;
  type: string;
}


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

  isAdmin = computed(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Decode the middle part of the JWT (the payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      // This matches the "claim" name we used in Spring Boot
      return payload.role === 'ROLE_ADMIN';
    } catch (e) {
      return false;
    }
  });

  login(credentials: { username: string; password: string }) {
    return this.http.post<JwtResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
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