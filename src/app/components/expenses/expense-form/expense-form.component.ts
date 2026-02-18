import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { CategoryService } from '../../../services/category.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseCreateRequest, ExpenseDTO } from '../../../models/api.models';

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
  toastMessage = signal('');
  recentExpenses = signal<ExpenseDTO[]>([]);

  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    categoryId: [null as number | null, Validators.required]
  });

  ngOnInit() {
    this.categoryService.refresh();
    this.loadRecentExpenses();
  }

  loadRecentExpenses() {
    this.expenseService.getExpenses(0, 5).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.recentExpenses.set(res.data.content);
        }
      },
      error: (err) => console.error('Failed to load recent expenses:', err)
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      
      const expenseData: ExpenseCreateRequest = {
        description: formValue.description!,
        amount: formValue.amount!,
        date: formValue.date!,
        categoryId: formValue.categoryId!
      };

      this.expenseService.createExpense(expenseData).subscribe({
        next: (response) => {
          if (response.success) {
            this.expenseForm.reset({
              date: new Date().toISOString().substring(0, 10),
              categoryId: null,
              amount: null,
              description: ''
            });
            
            this.toastMessage.set(response.message || 'Expense created successfully!');
            this.showToast.set(true);
            setTimeout(() => this.showToast.set(false), 3000);
            
            this.loadRecentExpenses();
          }
        },
        error: (err) => {
          this.toastMessage.set('Failed to create expense');
          this.showToast.set(true);
          setTimeout(() => this.showToast.set(false), 3000);
          console.error('Error creating expense:', err);
        }
      });
    }
  }
}