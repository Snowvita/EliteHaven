import { BookingModel } from './booking.model';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface PaymentModel {
  paymentId: number;
  booking: BookingModel;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentDate: string;
}
