import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  constructor() {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const rawForm = this.loginForm.getRawValue();
      this.authService.login(rawForm.email.trim(), rawForm.password).subscribe({
        next: () => {
          alert('Login successful');
          // Redirect to home or another page if needed
          window.location.href = '/';
        },
        error: (err) => alert('Error: ' + err.message),
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
