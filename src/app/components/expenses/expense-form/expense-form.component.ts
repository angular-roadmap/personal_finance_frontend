import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  public categoryService = inject(CategoryService); // Inject to get categories signal

  showToast = signal(false);

  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    categoryId: [null, Validators.required] // We use categoryId for the form
  });

  ngOnInit() {
    this.categoryService.refresh(); // Load categories for the dropdown
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.showToast.set(true);
      
      // Prepare the payload to match the backend Expense entity
      const formValue = this.expenseForm.value;
      const payload = {
        description: formValue.description,
        amount: formValue.amount,
        date: formValue.date,
        category: { id: formValue.categoryId } // Sending as a Category object with an ID
      };

      this.expenseService.createExpense(payload).subscribe({
        next: () => {
          this.expenseForm.reset({
            date: new Date().toISOString().substring(0, 10),
            categoryId: null
          });
          this.showToast.set(true);
          setTimeout(() => this.showToast.set(false), 3000); // Hide toast after 3 seconds
        },
        error: () => this.showToast.set(false)
      });
    }
  }
}