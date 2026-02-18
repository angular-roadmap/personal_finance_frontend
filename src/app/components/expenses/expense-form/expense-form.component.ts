import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { CategoryService } from '../../../services/category.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  public categoryService = inject(CategoryService);

  showToast = signal(false);
  recentExpenses = signal<any[]>([]);

  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    categoryId: [null, Validators.required]
  });

  ngOnInit() {
    this.categoryService.refresh();
    this.loadRecentExpenses();
  }

  loadRecentExpenses() {
    this.expenseService.getExpenses(0, 5).subscribe({
      next: (res) => this.recentExpenses.set(res.content),
      error: (err) => console.error('Failed to load recent expenses:', err)
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.showToast.set(true);
      
      const formValue = this.expenseForm.value;
      const payload = {
        description: formValue.description,
        amount: formValue.amount,
        date: formValue.date,
        category: { id: formValue.categoryId }
      };

      this.expenseService.createExpense(payload).subscribe({
        next: () => {
          this.expenseForm.reset({
            date: new Date().toISOString().substring(0, 10),
            categoryId: null
          });
          this.showToast.set(true);
          setTimeout(() => this.showToast.set(false), 3000);
          this.loadRecentExpenses();
        },
        error: () => this.showToast.set(false)
      });
    }
  }
}