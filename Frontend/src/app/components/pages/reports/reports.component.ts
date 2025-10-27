import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { HotelService } from '../../../services/hotel.service';
import { UserService } from '../../../services/user.service';
import { BookingModel } from '../../../models/booking.model';
import { HotelModel } from '../../../models/hotel.model';

interface HotelStats {
  hotelName: string;
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
}

interface RoomTypeStats {
  type: string;
  count: number;
  revenue: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  allBookings: BookingModel[] = [];
  hotels: HotelModel[] = [];

  // Statistics
  totalRevenue: number = 0;
  totalBookings: number = 0;
  confirmedBookings: number = 0;
  cancelledBookings: number = 0;
  completedBookings: number = 0;
  pendingBookings: number = 0;
  checkedInBookings: number = 0;
  totalCustomers: number = 0;
  totalStaff: number = 0;

  // New Analytics
  averageBookingValue: number = 0;
  occupancyRate: number = 0;
  hotelStats: HotelStats[] = [];
  roomTypeStats: RoomTypeStats[] = [];
  topHotel: string = 'N/A';
  topRoomType: string = 'N/A';

  // Date filters
  startDate: string = '';
  endDate: string = '';

  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadData();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadData(): void {
    this.isLoading = true;

    // Load bookings
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.allBookings = bookings;
        this.loadHotelsAndCalculate();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load reports data';
        this.isLoading = false;
      },
    });

    // Load total users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.totalCustomers = users.filter(
          (u) => u.role === 'CUSTOMER' && (!u.isDeleted || u.isDeleted === 0)
        ).length;
        this.totalStaff = users.filter(
          (u) => u.role === 'STAFF' && (!u.isDeleted || u.isDeleted === 0)
        ).length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  loadHotelsAndCalculate(): void {
    this.hotelService.getExistingHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.calculateStatistics();
        this.calculateHotelStats();
        this.calculateRoomTypeStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.calculateStatistics();
        this.isLoading = false;
      },
    });
  }

  calculateStatistics(): void {
    // Filter bookings by date range
    const filtered = this.allBookings.filter((booking) => {
      const bookingDate = new Date(booking.checkInDate);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return bookingDate >= start && bookingDate <= end;
    });

    this.totalBookings = filtered.length;
    this.confirmedBookings = filtered.filter(
      (b) => b.status === 'CONFIRMED'
    ).length;
    this.cancelledBookings = filtered.filter(
      (b) => b.status === 'CANCELLED'
    ).length;
    this.completedBookings = filtered.filter(
      (b) => b.status === 'COMPLETED'
    ).length;
    this.pendingBookings = filtered.filter(
      (b) => b.status === 'PENDING'
    ).length;
    this.checkedInBookings = filtered.filter(
      (b) => b.status === 'CHECKED_IN'
    ).length;

    // Calculate revenue (only from confirmed, checked in, and completed)
    const revenueBookings = filtered.filter(
      (b) =>
        b.status === 'CONFIRMED' ||
        b.status === 'COMPLETED' ||
        b.status === 'CHECKED_IN'
    );

    this.totalRevenue = revenueBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );

    // Average booking value
    this.averageBookingValue =
      revenueBookings.length > 0
        ? this.totalRevenue / revenueBookings.length
        : 0;

    // Occupancy rate (simplified calculation)
    const totalPossibleBookings = this.hotels.length * 30; // Assuming 30 days average
    this.occupancyRate =
      totalPossibleBookings > 0
        ? (this.confirmedBookings / totalPossibleBookings) * 100
        : 0;
  }

  calculateHotelStats(): void {
    const filtered = this.allBookings.filter((booking) => {
      const bookingDate = new Date(booking.checkInDate);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return bookingDate >= start && bookingDate <= end;
    });

    const hotelMap = new Map<string, HotelStats>();

    filtered.forEach((booking) => {
      const hotelName = booking.room.hotel.hotelName;

      if (!hotelMap.has(hotelName)) {
        hotelMap.set(hotelName, {
          hotelName,
          totalBookings: 0,
          revenue: 0,
          occupancyRate: 0,
        });
      }

      const stats = hotelMap.get(hotelName)!;
      stats.totalBookings++;

      if (
        booking.status === 'CONFIRMED' ||
        booking.status === 'COMPLETED' ||
        booking.status === 'CHECKED_IN'
      ) {
        stats.revenue += booking.totalPrice || 0;
      }
    });

    this.hotelStats = Array.from(hotelMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    );

    // Find top hotel
    if (this.hotelStats.length > 0) {
      this.topHotel = this.hotelStats[0].hotelName;
    }
  }

  calculateRoomTypeStats(): void {
    const filtered = this.allBookings.filter((booking) => {
      const bookingDate = new Date(booking.checkInDate);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return bookingDate >= start && bookingDate <= end;
    });

    const roomTypeMap = new Map<string, RoomTypeStats>();

    filtered.forEach((booking) => {
      const type = booking.room.type || 'Unknown';

      if (!roomTypeMap.has(type)) {
        roomTypeMap.set(type, {
          type,
          count: 0,
          revenue: 0,
        });
      }

      const stats = roomTypeMap.get(type)!;
      stats.count++;

      if (
        booking.status === 'CONFIRMED' ||
        booking.status === 'COMPLETED' ||
        booking.status === 'CHECKED_IN'
      ) {
        stats.revenue += booking.totalPrice || 0;
      }
    });

    this.roomTypeStats = Array.from(roomTypeMap.values()).sort(
      (a, b) => b.count - a.count
    );

    // Find top room type
    if (this.roomTypeStats.length > 0) {
      this.topRoomType = this.roomTypeStats[0].type;
    }
  }

  applyDateFilter(): void {
    this.calculateStatistics();
    this.calculateHotelStats();
    this.calculateRoomTypeStats();
  }

  exportToCSV(): void {
    const filtered = this.allBookings.filter((booking) => {
      const bookingDate = new Date(booking.checkInDate);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return bookingDate >= start && bookingDate <= end;
    });

    const csv = this.generateCSV(filtered);
    this.downloadCSV(
      csv,
      `bookings-report-${this.startDate}-to-${this.endDate}.csv`
    );
  }

  generateCSV(bookings: BookingModel[]): string {
    const headers = [
      'Booking ID',
      'Guest',
      'Phone',
      'Hotel',
      'Room',
      'Room Type',
      'Check-In',
      'Check-Out',
      'Status',
      'Price',
    ];
    const rows = bookings.map((b) => [
      b.bookingId,
      b.user.fullName,
      b.user.phoneNumber || 'N/A',
      b.room.hotel.hotelName,
      b.room.roomNumber,
      b.room.type || 'N/A',
      b.checkInDate,
      b.checkOutDate,
      b.status,
      b.totalPrice || 0,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
