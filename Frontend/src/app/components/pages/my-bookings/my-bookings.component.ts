import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  cancelledBookings: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserBookings();
  }

  loadUserBookings(): void {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) {
      alert('Please sign in to view bookings');
      this.router.navigate(['/signin']);
      return;
    }

    const userDetails = JSON.parse(userDetailsStr);
    this.isLoading = true;

    this.bookingService.getBookingsByUser(userDetails.userId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.categorizeBookings();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoading = false;
      },
    });
  }

  categorizeBookings(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.upcomingBookings = this.bookings.filter(
      (b) =>
        (b.status === 'CONFIRMED' || b.status === 'PENDING') &&
        new Date(b.checkInDate) >= today
    );

    this.pastBookings = this.bookings.filter(
      (b) =>
        b.status === 'COMPLETED' ||
        (b.status === 'CONFIRMED' && new Date(b.checkOutDate) < today)
    );

    this.cancelledBookings = this.bookings.filter(
      (b) => b.status === 'CANCELLED'
    );
  }

  canCancelBooking(booking: any): boolean {
    if (booking.status !== 'CONFIRMED') return false;

    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    const hoursDiff =
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60);

    return hoursDiff > 24; // Can cancel if more than 24 hours before check-in
  }

  cancelBooking(booking: any): void {
    if (
      !confirm(
        'Are you sure you want to cancel this booking? This action cannot be undone.'
      )
    ) {
      return;
    }

    this.bookingService.cancelBooking(booking.bookingId).subscribe({
      next: () => {
        alert('Booking cancelled successfully');
        this.loadUserBookings(); // Reload bookings
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
        alert(error.error?.message || 'Failed to cancel booking');
      },
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      CONFIRMED: 'status-confirmed',
      PENDING: 'status-pending',
      CANCELLED: 'status-cancelled',
      COMPLETED: 'status-completed',
      CHECKED_IN: 'status-checked-in',
    };
    return statusMap[status] || 'status-default';
  }

  getStatusLabel(status: string): string {
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
