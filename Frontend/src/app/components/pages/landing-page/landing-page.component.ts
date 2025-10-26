import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { RoomService } from '../../../services/room.service';
import { RoomPhotoService } from '../../../services/room-photo.service';
import { RoomModel, RoomPhotoModel } from '../../../models/room.model';
import { HotelModel } from '../../../models/hotel.model';
import { debounceTime, Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  checkInDate: string = '';
  checkOutDate: string = '';
  searchTerm: string = '';
  roomTypeFilter: string = 'ALL';

  hotels: HotelModel[] = [];
  filteredHotels: HotelModel[] = [];
  availableRooms: RoomModel[] = [];
  filteredRooms: RoomModel[] = [];
  roomPhotosMap: Map<number, RoomPhotoModel[]> = new Map();
  isLoading: boolean = false;
  searchPerformed: boolean = false;

  showCalendar: boolean = false;
  selectedDateType: 'checkIn' | 'checkOut' = 'checkIn';
  currentMonth: Date = new Date();
  calendarDays: any[] = [];
  minDate: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private roomPhotoService: RoomPhotoService,
    private router: Router
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.filterHotels(term);
    });
  }

  // Helper method to convert date to YYYY-MM-DD without timezone issues
  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = this.formatDateToISO(today);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkInDate = this.formatDateToISO(tomorrow);

    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    this.checkOutDate = this.formatDateToISO(dayAfter);

    this.loadAllHotels();
    this.generateCalendar();
  }

  loadAllHotels(): void {
    this.isLoading = true;
    this.hotelService.getExistingHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.filteredHotels = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.isLoading = false;
      },
    });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  filterHotels(term: string): void {
    if (!term.trim()) {
      this.filteredHotels = this.hotels;
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.filteredHotels = this.hotels.filter(
      (hotel) =>
        hotel.hotelName.toLowerCase().includes(lowerTerm) ||
        hotel.location.toLowerCase().includes(lowerTerm) ||
        (hotel.description &&
          hotel.description.toLowerCase().includes(lowerTerm))
    );
  }

  searchAvailableRooms(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (new Date(this.checkInDate) >= new Date(this.checkOutDate)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    this.isLoading = true;
    this.searchPerformed = true;

    this.roomService
      .getAvailableRooms(this.checkInDate, this.checkOutDate)
      .subscribe({
        next: (data) => {
          this.availableRooms = data;
          this.filteredRooms = data;
          this.applyRoomTypeFilter();
          this.loadRoomPhotos();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching rooms:', error);
          this.isLoading = false;
        },
      });
  }

  loadRoomPhotos(): void {
    if (this.availableRooms.length === 0) return;

    const photoRequests = this.availableRooms.map((room) =>
      this.roomPhotoService.getPhotosByRoomId(room.roomId)
    );

    forkJoin(photoRequests).subscribe({
      next: (photosArrays) => {
        this.availableRooms.forEach((room, index) => {
          this.roomPhotosMap.set(room.roomId, photosArrays[index]);
        });
      },
      error: (error) => {
        console.error('Error loading room photos:', error);
      },
    });
  }

  filterByRoomType(type: string): void {
    this.roomTypeFilter = type;
    this.applyRoomTypeFilter();
  }

  applyRoomTypeFilter(): void {
    if (this.roomTypeFilter === 'ALL') {
      this.filteredRooms = this.availableRooms;
    } else {
      this.filteredRooms = this.availableRooms.filter(
        (room) => room.type === this.roomTypeFilter
      );
    }
  }

  getPrimaryPhoto(room: RoomModel): string {
    const photos = this.roomPhotosMap.get(room.roomId);
    if (photos && photos.length > 0) {
      const primary = photos.find((p) => p.isPrimary);
      return primary ? primary.photoUrl : photos[0].photoUrl;
    }
    return 'assets/room-placeholder.jpg';
  }

  openCalendar(type: 'checkIn' | 'checkOut'): void {
    this.selectedDateType = type;
    this.showCalendar = true;
    this.generateCalendar();
  }

  closeCalendar(): void {
    this.showCalendar = false;
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push({ day: null, disabled: true });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;

      let isBeforeCheckIn = false;
      if (this.selectedDateType === 'checkOut' && this.checkInDate) {
        const checkInDateObj = new Date(this.checkInDate);
        isBeforeCheckIn = date <= checkInDateObj;
      }

      this.calendarDays.push({
        day: day,
        date: date,
        disabled: isPast || isBeforeCheckIn,
        selected: this.isDateSelected(date),
        isCheckIn: this.isCheckInDate(date),
        isCheckOut: this.isCheckOutDate(date),
        isBetween: this.isDateBetween(date),
      });
    }
  }

  isDateSelected(date: Date): boolean {
    const dateStr = this.formatDateToISO(date);
    return dateStr === this.checkInDate || dateStr === this.checkOutDate;
  }

  isCheckInDate(date: Date): boolean {
    return this.formatDateToISO(date) === this.checkInDate;
  }

  isCheckOutDate(date: Date): boolean {
    return this.formatDateToISO(date) === this.checkOutDate;
  }

  isDateBetween(date: Date): boolean {
    if (!this.checkInDate || !this.checkOutDate) return false;
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    return date > checkIn && date < checkOut;
  }

  selectDate(dayObj: any): void {
    if (dayObj.disabled || !dayObj.date) return;

    const dateStr = this.formatDateToISO(dayObj.date);

    if (this.selectedDateType === 'checkIn') {
      this.checkInDate = dateStr;
      if (new Date(this.checkOutDate) <= new Date(dateStr)) {
        const nextDay = new Date(dayObj.date);
        nextDay.setDate(nextDay.getDate() + 1);
        this.checkOutDate = this.formatDateToISO(nextDay);
      }
    } else {
      this.checkOutDate = dateStr;
    }

    this.generateCalendar();
    this.closeCalendar();
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1
    );
    this.generateCalendar();
  }

  getMonthYear(): string {
    return this.currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  bookRoom(room: RoomModel): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // Store booking intent before redirecting to signin
      const bookingIntent = {
        room: room,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        returnUrl: '/booking',
      };
      localStorage.setItem('bookingIntent', JSON.stringify(bookingIntent));

      alert('Please sign in to book a room');
      this.router.navigate(['/signin']);
      return;
    }

    // User is already logged in, proceed to booking
    this.router.navigate(['/booking'], {
      state: {
        room: room,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
      },
    });
  }

  clearSearch(): void {
    this.searchPerformed = false;
    this.availableRooms = [];
    this.filteredRooms = [];
    this.roomPhotosMap.clear();
    this.searchTerm = '';
    this.roomTypeFilter = 'ALL';
    this.filteredHotels = this.hotels;
  }

  calculateNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateTotalPrice(room: RoomModel): number {
    return room.pricePerNight * this.calculateNights();
  }

  getRoomTypeLabel(type: string): string {
    const labels: any = {
      SINGLE: 'Single Room',
      DOUBLE: 'Double Room',
      SUITE: 'Suite',
    };
    return labels[type] || type;
  }

  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  getFormattedCheckIn(): string {
    return this.formatDateForDisplay(this.checkInDate);
  }

  getFormattedCheckOut(): string {
    return this.formatDateForDisplay(this.checkOutDate);
  }
}
