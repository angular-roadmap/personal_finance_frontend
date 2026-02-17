import { Component, OnInit, inject, signal } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  
  expenses = signal<any[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.expenseService.getExpenses().subscribe({
      next: (res) => this.expenses.set(res.content),
      error: () => console.error('Failed to load'),
      complete: () => this.isLoading.set(false)
    });
  }
}