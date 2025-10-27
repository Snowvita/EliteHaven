import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StaffService } from '../../../services/staff.service';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css'],
})
export class AddStaffComponent implements OnInit {
  hotels: any[] = [];

  staffForm = {
    fullName: '',
    email: '',
    phone: 0,
    hotelId: 0,
    password: '',
    confirmPassword: '',
  };

  isLoading: boolean = false;
  isLoadingHotels: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private staffService: StaffService,
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getExistingHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.isLoadingHotels = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.errorMessage = 'Failed to load hotels';
        this.isLoadingHotels = false;
      },
    });
  }

  get passwordsMatch(): boolean {
    if (!this.staffForm.password || !this.staffForm.confirmPassword) {
      return true;
    }
    return this.staffForm.password === this.staffForm.confirmPassword;
  }

  addStaff(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (
      !this.staffForm.fullName ||
      !this.staffForm.email ||
      !this.staffForm.password ||
      !this.staffForm.hotelId
    ) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.staffForm.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.staffForm.email)) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    this.isLoading = true;

    const staffData = {
      fullName: this.staffForm.fullName,
      email: this.staffForm.email,
      phone: this.staffForm.phone,
      hotelId: this.staffForm.hotelId,
      role: 'STAFF',
      password: this.staffForm.password,
    };

    this.staffService.createStaff(staffData).subscribe({
      next: (response) => {
        this.successMessage = 'Staff member added successfully!';
        this.isLoading = false;

        // Reset form
        this.staffForm = {
          fullName: '',
          email: '',
          phone: 0,
          hotelId: 0,
          password: '',
          confirmPassword: '',
        };

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error adding staff:', error);
        this.errorMessage =
          error.error?.message || 'Failed to add staff member';
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
