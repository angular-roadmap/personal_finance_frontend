import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/api.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    if (this.authService.sessionExpiredMessage()) {
      this.errorMessage.set(this.authService.sessionExpiredMessage());
      setTimeout(() => {
        this.errorMessage.set(null);
        this.authService.sessionExpiredMessage.set(null);
      }, 5000);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const credentials: LoginRequest = this.loginForm.getRawValue();

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if (!response.success) {
            this.errorMessage.set(response.message || 'Login failed');
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          this.errorMessage.set('Invalid credentials. Please try again.');
          this.isLoading.set(false);
        }
      });
    }
  }
}