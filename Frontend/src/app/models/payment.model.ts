import { BookingModel } from './booking.model';

export type PaymentMethod = 'CASH' | 'CARD' | 'UPI';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface PaymentModel {
  paymentId: number;
  booking: BookingModel;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate: string;
}
