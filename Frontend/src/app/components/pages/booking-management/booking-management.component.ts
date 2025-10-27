import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { BookingModel, BookingStatus } from '../../../models/booking.model';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.css'],
})
export class BookingManagementComponent implements OnInit {
  allBookings: BookingModel[] = [];
  filteredBookings: BookingModel[] = [];

  selectedStatus: string = 'ALL';
  searchTerm: string = '';
  isLoading: boolean = true;

  showDetailsModal: boolean = false;
  selectedBooking: BookingModel | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;

    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {

        this.allBookings = bookings;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoading = false;
      },
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.allBookings;

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter((b) => b.status === this.selectedStatus);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.user.fullName.toLowerCase().includes(term) ||
          b.room.roomNumber.toLowerCase().includes(term) ||
          b.room.hotel.hotelName.toLowerCase().includes(term) ||
          b.bookingId.toString().includes(term)
      );
    }

    this.filteredBookings = filtered;
  }

  searchBookings(): void {
    this.applyFilters();
  }

  openDetailsModal(booking: BookingModel): void {
    this.selectedBooking = booking;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBooking = null;
  }

  // REMOVED confirmBooking() - customers do this
  // REMOVED cancelBooking() - customers do this

  checkIn(bookingId: number): void {
    if (!confirm('Check in this guest?')) return;

    this.bookingService.checkIn(bookingId).subscribe({
      next: () => {
        this.successMessage = 'Guest checked in successfully!';
        this.loadBookings();
        this.closeDetailsModal();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to check in';
      },
    });
  }

  checkOut(bookingId: number): void {
    if (!confirm('Check out this guest?')) return;

    this.bookingService.checkOut(bookingId).subscribe({
      next: () => {
        this.successMessage = 'Guest checked out successfully!';
        this.loadBookings();
        this.closeDetailsModal();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to check out';
      },
    });
  }

  getStatusBadgeClass(status: BookingStatus): string {
    return (
      {
        PENDING: 'badge-pending',
        CONFIRMED: 'badge-confirmed',
        CHECKED_IN: 'badge-checked-in',
        CANCELLED: 'badge-cancelled',
        COMPLETED: 'badge-completed',
      }[status] || ''
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  }

  calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
