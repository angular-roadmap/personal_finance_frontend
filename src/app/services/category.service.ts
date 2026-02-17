import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/categories';
  
  // Master signal for categories
  categories = signal<any[]>([]);

  refresh() {
    this.http.get<any[]>(this.API_URL).subscribe(data => this.categories.set(data));
  }

  create(category: any) {
    return this.http.post(this.API_URL, category);
  }
}