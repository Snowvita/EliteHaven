import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { StaffService } from '../../../services/staff.service';
import { BookingModel } from '../../../models/booking.model';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css'],
})
export class StaffDashboardComponent implements OnInit {
  staffName: string = '';
  staffRole: string = '';
  assignedHotel: string = 'Not Assigned';
  hotelId: number | null = null;

  // Statistics
  todayCheckIns: number = 0;
  todayCheckOuts: number = 0;
  currentGuests: number = 0;
  pendingBookings: number = 0;

  // Today's bookings
  todayCheckInBookings: BookingModel[] = [];
  todayCheckOutBookings: BookingModel[] = [];

  // Filtering and sorting
  checkInSearchTerm: string = '';
  checkOutSearchTerm: string = '';
  checkInSortBy: string = 'name'; // name, room
  checkOutSortBy: string = 'name'; // name, room

  isLoading: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private bookingService: BookingService,
    private staffService: StaffService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStaffInfo();
  }

  loadStaffInfo(): void {
    const userDetailsStr = localStorage.getItem('userDetails');

    if (!userDetailsStr) {
      this.router.navigate(['/signin']);
      return;
    }

    const userDetails = JSON.parse(userDetailsStr);
    const userEmail = userDetails.email;
    this.staffName = userDetails.fullName;

    this.staffService.getAllStaff().subscribe({
      next: (staffList) => {
        const currentStaff = staffList.find((s) => s.user.email === userEmail);

        if (currentStaff) {
          this.staffRole = currentStaff.role || 'Staff';
          this.assignedHotel = currentStaff.hotel?.hotelName || 'Not Assigned';
          this.hotelId = currentStaff.hotel?.hotelId ?? null;

          this.loadBookingStats();
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading staff info:', error);
        this.isLoading = false;
      },
    });
  }

  loadBookingStats(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        const hotelBookings = this.hotelId
          ? bookings.filter((b) => b.room.hotel.hotelId === this.hotelId)
          : bookings;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Today's check-ins
        this.todayCheckInBookings = hotelBookings.filter((b) => {
          const checkIn = new Date(b.checkInDate);
          checkIn.setHours(0, 0, 0, 0);
          return (
            checkIn.getTime() === today.getTime() && b.status === 'CONFIRMED'
          );
        });

        // Today's check-outs
        this.todayCheckOutBookings = hotelBookings.filter((b) => {
          const checkOut = new Date(b.checkOutDate);
          checkOut.setHours(0, 0, 0, 0);
          return (
            checkOut.getTime() === today.getTime() && b.status === 'CHECKED_IN'
          );
        });

        this.todayCheckIns = this.todayCheckInBookings.length;
        this.todayCheckOuts = this.todayCheckOutBookings.length;
        this.currentGuests = hotelBookings.filter(
          (b) => b.status === 'CHECKED_IN'
        ).length;
        this.pendingBookings = hotelBookings.filter(
          (b) => b.status === 'PENDING'
        ).length;

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoading = false;
      },
    });
  }

  // Enhanced filter and sort for check-ins
  getFilteredCheckInBookings(): BookingModel[] {
    let filtered = [...this.todayCheckInBookings];

    // Apply search filter
    if (this.checkInSearchTerm.trim()) {
      const term = this.checkInSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.user.fullName.toLowerCase().includes(term) ||
          b.room.roomNumber.toLowerCase().includes(term) ||
          (b.user.phoneNumber?.toString() || '').includes(term)
      );
    }

    // Apply sorting
    if (this.checkInSortBy === 'name') {
      filtered.sort((a, b) => a.user.fullName.localeCompare(b.user.fullName));
    } else if (this.checkInSortBy === 'room') {
      filtered.sort((a, b) =>
        a.room.roomNumber.localeCompare(b.room.roomNumber)
      );
    }

    return filtered;
  }

  // Enhanced filter and sort for check-outs
  getFilteredCheckOutBookings(): BookingModel[] {
    let filtered = [...this.todayCheckOutBookings];

    // Apply search filter
    if (this.checkOutSearchTerm.trim()) {
      const term = this.checkOutSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.user.fullName.toLowerCase().includes(term) ||
          b.room.roomNumber.toLowerCase().includes(term) ||
          (b.user.phoneNumber?.toString() || '').includes(term)
      );
    }

    // Apply sorting
    if (this.checkOutSortBy === 'name') {
      filtered.sort((a, b) => a.user.fullName.localeCompare(b.user.fullName));
    } else if (this.checkOutSortBy === 'room') {
      filtered.sort((a, b) =>
        a.room.roomNumber.localeCompare(b.room.roomNumber)
      );
    }

    return filtered;
  }

  checkIn(bookingId: number): void {
    if (!confirm('Check in this guest?')) return;

    this.bookingService.checkIn(bookingId).subscribe({
      next: () => {
        this.successMessage = 'Guest checked in successfully!';
        this.loadBookingStats();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to check in';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  checkOut(bookingId: number): void {
    if (!confirm('Check out this guest?')) return;

    this.bookingService.checkOut(bookingId).subscribe({
      next: () => {
        this.successMessage = 'Guest checked out successfully!';
        this.loadBookingStats();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to check out';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }

  viewAllCheckIns(): void {
    this.router.navigate(['/staff-bookings'], {
      queryParams: { filter: 'CONFIRMED' },
    });
  }

  viewAllCheckOuts(): void {
    this.router.navigate(['/staff-bookings'], {
      queryParams: { filter: 'CHECKED_IN' },
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  }
}
