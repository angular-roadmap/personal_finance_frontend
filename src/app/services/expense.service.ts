import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ApiResponse, 
  PageResponse, 
  ExpenseDTO, 
  ExpenseCreateRequest, 
  CategorySum 
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/expenses';

  getExpenses(page = 0, size = 10): Observable<ApiResponse<PageResponse<ExpenseDTO>>> {
    return this.http.get<ApiResponse<PageResponse<ExpenseDTO>>>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  getStats(
    startDate: string, 
    endDate: string, 
    targetUser?: string
  ): Observable<ApiResponse<CategorySum[]>> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (targetUser && targetUser.trim() !== '') {
      params = params.set('targetUser', targetUser);
    }

    return this.http.get<ApiResponse<CategorySum[]>>(`${this.API_URL}/stats`, { params });
  }

  createExpense(expense: ExpenseCreateRequest): Observable<ApiResponse<ExpenseDTO>> {
    return this.http.post<ApiResponse<ExpenseDTO>>(this.API_URL, expense);
  }

  updateExpense(id: number, expense: ExpenseCreateRequest): Observable<ApiResponse<ExpenseDTO>> {
    return this.http.put<ApiResponse<ExpenseDTO>>(`${this.API_URL}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}