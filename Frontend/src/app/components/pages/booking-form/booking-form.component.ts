import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { RoomModel } from '../../../models/room.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  room: RoomModel | null = null;
  checkInDate: string = '';
  checkOutDate: string = '';
  guests: number = 1;
  maxGuests: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private bookingService: BookingService) {
    // Get navigation state in CONSTRUCTOR, not ngOnInit
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.room = navigation.extras.state['room'];
      this.checkInDate = navigation.extras.state['checkIn'];
      this.checkOutDate = navigation.extras.state['checkOut'];
      console.log('Got data from navigation state in constructor');
    }
  }

  ngOnInit(): void {
    console.log('BookingForm ngOnInit started');

    // If we didn't get data from navigation, check localStorage
    if (!this.room || !this.checkInDate || !this.checkOutDate) {
      const bookingIntentStr = localStorage.getItem('bookingIntent');
      console.log(
        'Retrieved bookingIntent from localStorage:',
        bookingIntentStr
      );

      if (bookingIntentStr) {
        try {
          const bookingIntent = JSON.parse(bookingIntentStr);
          this.room = bookingIntent.room;
          this.checkInDate = bookingIntent.checkIn;
          this.checkOutDate = bookingIntent.checkOut;
          localStorage.removeItem('bookingIntent');
          console.log('Got data from localStorage');
        } catch (error) {
          console.error('Error parsing bookingIntent:', error);
        }
      }
    }

    // Final validation
    if (!this.room || !this.checkInDate || !this.checkOutDate) {
      console.error('Missing booking data:', {
        room: this.room,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
      });
      alert('Invalid booking data. Please select a room from the search page.');
      this.router.navigate(['/']);
      return;
    }

    this.maxGuests = this.getMaxGuestsForRoomType(this.room.type);
    console.log('Booking data loaded successfully');
  }

  getMaxGuestsForRoomType(roomType: string): number {
    const capacityMap: any = {
      SINGLE: 2,
      DOUBLE: 3,
      SUITE: 6,
    };
    return capacityMap[roomType] || 1;
  }

  calculateNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateTotalPrice(): number {
    if (!this.room) return 0;
    return this.room.pricePerNight * this.calculateNights();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getRoomTypeLabel(type: string): string {
    const labels: any = {
      SINGLE: 'Single Room',
      DOUBLE: 'Double Room',
      SUITE: 'Suite',
    };
    return labels[type] || type;
  }

  onSubmit(): void {
    if (!this.room) return;

    if (this.guests < 1 || this.guests > this.maxGuests) {
      this.errorMessage = `Number of guests must be between 1 and ${this.maxGuests}`;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) {
      alert('User not logged in');
      this.router.navigate(['/signin']);
      return;
    }

    const userDetails = JSON.parse(userDetailsStr);

    const bookingData = {
      userId: userDetails.userId,
      roomId: this.room.roomId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      numberOfGuests: this.guests,
      totalPrice: this.calculateTotalPrice(),
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking created:', response);

        // Store payment intent in localStorage as fallback
        const paymentIntent = {
          bookingId: response.bookingId,
          amount: this.calculateTotalPrice(),
        };
        localStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));

        // Redirect to payment page
        this.router.navigate(['/payment'], {
          state: {
            bookingId: response.bookingId,
            amount: this.calculateTotalPrice(),
          },
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.errorMessage =
          error.error?.message || 'Failed to create booking. Please try again.';
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
