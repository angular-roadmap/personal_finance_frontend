import { Component, OnInit, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryCreateRequest } from '../../models/api.models';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss'
})
export class CategoryManagerComponent implements OnInit {
  private fb = inject(FormBuilder);
  public categoryService = inject(CategoryService);

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.categoryService.refresh();
  }

  showToast = signal(false);
  toastMessage = signal('');

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData: CategoryCreateRequest = {
        name: this.categoryForm.value.name!,
        description: this.categoryForm.value.description || ''
      };

      this.categoryService.create(categoryData).subscribe({
        next: (response) => {
          if (response.success) {
            this.categoryForm.reset();
            this.categoryService.refresh();
            
            this.toastMessage.set(response.message || 'Category saved successfully!');
            this.showToast.set(true);
            setTimeout(() => this.showToast.set(false), 3000);
          }
        },
        error: (err) => {
          this.toastMessage.set('Failed to create category');
          this.showToast.set(true);
          setTimeout(() => this.showToast.set(false), 3000);
          console.error('Error creating category:', err);
        }
      });
    }
  }
}