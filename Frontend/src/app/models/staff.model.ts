import { HotelModel } from './hotel.model';
import { UserModel } from './user.model';

export interface StaffModel {
  staffId?: number;
  user: UserModel;
  fullName: string;
  email: string;
  phone: number;
  role: string;
  hotel: HotelModel; // Changed from hotel to hotelEntity
  hiredDate: string; // ISO string
}

export interface StaffRegisterModel {
  fullName: string;
  email: string;
  phone: number;
  role: string;
  hotelId: number;
  password?: string;
}
