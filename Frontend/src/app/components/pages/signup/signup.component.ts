import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  phone: number | null = null;
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (
      !this.fullName ||
      !this.email ||
      !this.phone ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (!this.isValidPhone(this.phone)) {
      this.errorMessage = 'Phone number must be exactly 10 digits';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    const registerData = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      password: this.password,
    };

    this.userService.registerUser(registerData).subscribe({
      next: (response) => {
        this.successMessage =
          'Registration successful! Redirecting to sign in...';
        this.isLoading = false;

        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: number | null): boolean {
    if (phone === null) return false;
    const phoneStr = phone.toString();
    // Exactly 10 digits, no more, no less
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneStr) && phoneStr.length === 10;
  }

  passwordsMatch(): boolean {
    return (
      this.password === this.confirmPassword && this.confirmPassword.length > 0
    );
  }

  passwordsDontMatch(): boolean {
    return (
      this.password !== this.confirmPassword && this.confirmPassword.length > 0
    );
  }
}
