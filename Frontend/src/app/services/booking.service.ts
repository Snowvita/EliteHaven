import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingModel, CreateBookingModel } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  createBooking(data: CreateBookingModel): Observable<BookingModel> {
    return this.http.post<BookingModel>(`${this.baseUrl}/create_booking`, data);
  }

  confirmBooking(bookingId: number): Observable<BookingModel> {
    return this.http.put<BookingModel>(
      `${this.baseUrl}/confirm_booking/${bookingId}`,
      {}
    );
  }

  cancelBooking(bookingId: number): Observable<BookingModel> {
    return this.http.put<BookingModel>(
      `${this.baseUrl}/cancel_booking/${bookingId}`,
      {}
    );
  }

  checkIn(bookingId: number): Observable<BookingModel> {
    return this.http.put<BookingModel>(
      `${this.baseUrl}/checkin/${bookingId}`,
      {}
    );
  }

  checkOut(bookingId: number): Observable<BookingModel> {
    return this.http.put<BookingModel>(
      `${this.baseUrl}/checkout/${bookingId}`,
      {}
    );
  }

  getAllBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.baseUrl}/all_bookings`);
  }

  getBookingById(bookingId: number): Observable<BookingModel> {
    return this.http.get<BookingModel>(`${this.baseUrl}/booking/${bookingId}`);
  }

  getBookingsByUser(userId: number): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(
      `${this.baseUrl}/user_bookings/${userId}`
    );
  }
}
