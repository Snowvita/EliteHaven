import { HotelModel } from './hotel.model';
import { UserModel } from './user.model';

export interface StaffModel {
  user: UserModel;
  fullName: string;
  email: string;
  phone: number;
  role: string;
  hotelEntity: HotelModel;
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
