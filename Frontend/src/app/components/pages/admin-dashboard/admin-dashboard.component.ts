import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { RoomService } from '../../../services/room.service';
import { BookingService } from '../../../services/booking.service';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  isLoading: boolean = true;
  adminName: string = '';

  // Statistics
  stats = {
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    availableRooms: 0,
  };

  // Recent activities
  recentBookings: any[] = [];

  constructor(
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private bookingService: BookingService,
    private userService: UserService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadAdminData();
  }

  checkAdminAccess(): void {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) {
      alert('Please sign in');
      this.router.navigate(['/signin']);
      return;
    }

    const userDetails = JSON.parse(userDetailsStr);
    if (userDetails.role !== 'ADMIN') {
      alert('Access denied. Admin only.');
      this.router.navigate(['/']);
      return;
    }

    this.adminName = userDetails.fullName;
  }

  loadAdminData(): void {
    this.isLoading = true;

    // Load all statistics
    Promise.all([
      this.loadHotelStats(),
      this.loadRoomStats(),
      this.loadBookingStats(),
      this.loadUserStats(),
      this.loadPaymentStats(),
    ])
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading admin data:', error);
        this.isLoading = false;
      });
  }

  loadHotelStats(): Promise<void> {
    return new Promise((resolve) => {
      this.hotelService.getExistingHotels().subscribe({
        next: (hotels) => {
          this.stats.totalHotels = hotels.length;
          resolve();
        },
        error: () => resolve(),
      });
    });
  }

  loadRoomStats(): Promise<void> {
    return new Promise((resolve) => {
      this.roomService.getAllRooms().subscribe({
        next: (rooms) => {
          this.stats.totalRooms = rooms.length;
          // Count available rooms by checking status
          this.stats.availableRooms = rooms.filter(
            (r: any) => r.status === 'AVAILABLE' || !r.status
          ).length;
          resolve();
        },
        error: () => resolve(),
      });
    });
  }

  loadBookingStats(): Promise<void> {
    return new Promise((resolve) => {
      this.bookingService.getAllBookings().subscribe({
        next: (bookings) => {
          this.stats.totalBookings = bookings.length;
          this.stats.activeBookings = bookings.filter(
            (b: any) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
          ).length;
          this.stats.pendingBookings = bookings.filter(
            (b: any) => b.status === 'PENDING'
          ).length;

          // Get recent bookings (last 5)
          this.recentBookings = bookings
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5);

          resolve();
        },
        error: () => resolve(),
      });
    });
  }

  loadUserStats(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.stats.totalUsers = users.length;
          resolve();
        },
        error: () => resolve(),
      });
    });
  }

  loadPaymentStats(): Promise<void> {
    return new Promise((resolve) => {
      this.paymentService.getAllPayments().subscribe({
        next: (payments) => {
          // Use type assertion for payment status comparison
          this.stats.totalRevenue = payments
            .filter((p: any) => p.paymentStatus === 'SUCCESS')
            .reduce((sum: number, p: any) => sum + p.amount, 0);
          resolve();
        },
        error: () => resolve(),
      });
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

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/signin']);
  }
}
