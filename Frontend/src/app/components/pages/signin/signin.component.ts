import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem(
          'userDetails',
          JSON.stringify(response.userDetails)
        );

        const userDetails = response.userDetails;
        const role = userDetails.role || '';

        // Check if there's a booking intent
        const bookingIntentStr = localStorage.getItem('bookingIntent');
        console.log('Booking intent found:', bookingIntentStr); // DEBUG

        if (bookingIntentStr && role === 'CUSTOMER') {
          // Navigate to booking page WITHOUT removing bookingIntent
          console.log('Redirecting to booking page'); // DEBUG
          this.router.navigate(['/booking']);
          this.isLoading = false;
          return;
        }

        // Normal login flow - Navigate based on role
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'STAFF') {
          this.router.navigate(['/staff-dashboard']);
        } else if (role === 'CUSTOMER') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/']);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage =
          error.error?.message ||
          'Invalid email or password. Please try again.';
        this.isLoading = false;
      },
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
