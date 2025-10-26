import { RoomModel } from './room.model';
import { StaffModel } from './staff.model';
import { UserModel } from './user.model';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CANCELLED';

export interface BookingModel {
  bookingId: number;
  room: RoomModel;
  user: UserModel;
  bookedByStaff?: StaffModel;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
}

export interface CreateBookingModel {
  roomId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
}
