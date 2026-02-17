import { Component, OnInit, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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

  onSubmit() {
    if (this.categoryForm.valid) {
      const val = this.categoryForm.getRawValue();
      this.categoryService.create(val as any).subscribe(() => {
        this.categoryForm.reset();
        this.categoryService.refresh();
        
        // Show toast and hide after 3 seconds
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
      });
    }
  }
}