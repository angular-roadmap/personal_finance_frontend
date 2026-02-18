import { Component, OnInit, inject, signal } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';
import { AuthService } from '../../../services/auth.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseDTO } from '../../../models/api.models';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  public authService = inject(AuthService);
  
  expenses = signal<ExpenseDTO[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  pageSize = 20;
  totalPages = signal(0);
  totalElements = signal(0);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.expenseService.getExpenses(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.expenses.set(response.data.content);
          this.totalPages.set(response.data.totalPages);
          this.totalElements.set(response.data.totalElements);
        }
      },
      error: (err) => {
        console.error('Failed to load expenses:', err);
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadData();
    }
  }

  previousPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadData();
    }
  }
}
