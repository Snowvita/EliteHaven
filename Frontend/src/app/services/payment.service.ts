import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentModel } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  // NEW: Process payment for a booking
  processPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pay`, paymentData);
  }

  payBooking(payment: PaymentModel): Observable<PaymentModel> {
    return this.http.post<PaymentModel>(`${this.baseUrl}/pay`, payment);
  }

  getAllPayments(): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(`${this.baseUrl}/all_payments`);
  }

  getPaymentById(paymentId: number): Observable<PaymentModel> {
    return this.http.get<PaymentModel>(
      `${this.baseUrl}/get_payment/${paymentId}`
    );
  }

  getPaymentsByBooking(bookingId: number): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(
      `${this.baseUrl}/get_payment_booking/${bookingId}`
    );
  }

  getTotalRevenueByHotel(hotelId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/revenue/hotel/${hotelId}`);
  }

  getDailyPayments(date: string): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(
      `${this.baseUrl}/report/daily?date=${date}`
    );
  }

  getMonthlyPayments(year: number, month: number): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(
      `${this.baseUrl}/report/monthly?year=${year}&month=${month}`
    );
  }

  getMonthlyRevenue(year: number, month: number): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/revenue/monthly?year=${year}&month=${month}`
    );
  }
}
