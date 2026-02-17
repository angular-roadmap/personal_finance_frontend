import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/expenses';

  getExpenses(page = 0, size = 10): Observable<any> {
    return this.http.get(`${this.API_URL}?page=${page}&size=${size}`);
  }

  getStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/stats`);
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post(this.API_URL, expense);
  }
}