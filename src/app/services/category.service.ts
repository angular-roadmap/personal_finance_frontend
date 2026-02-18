import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, CategoryDTO, CategoryCreateRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/categories';
  
  // Master signal for categories
  categories = signal<CategoryDTO[]>([]);

  refresh() {
    this.http.get<ApiResponse<CategoryDTO[]>>(this.API_URL)
      .pipe(
        tap(response => this.categories.set(response.data))
      )
      .subscribe();
  }

  create(category: CategoryCreateRequest): Observable<ApiResponse<CategoryDTO>> {
    return this.http.post<ApiResponse<CategoryDTO>>(this.API_URL, category);
  }

  getAll(): Observable<ApiResponse<CategoryDTO[]>> {
    return this.http.get<ApiResponse<CategoryDTO[]>>(this.API_URL);
  }
}