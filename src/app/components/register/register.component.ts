import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      return alert('Please fill in all required fields correctly.');
    }
    const { email, password, username } = this.registerForm.getRawValue(); // or use .value as needed
    this.authService.register(email.trim(), password, username).subscribe({
      next: () => {
        this.router.navigate(['']);
        return alert('Registration successful');
      },
      error: (err) => alert('Error: ' + err.message),
    });
  }
}
