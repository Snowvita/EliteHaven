import { HotelModel } from './hotel.model';

export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE';

export interface RoomModel {
  roomId: number;
  hotel: HotelModel;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  isDeleted?: number;
}

export interface RoomPhotoModel {
  photoId: number;
  photoUrl: string;
  room: RoomModel;
  isPrimary: boolean;
}

export interface RoomServiceModel {
  serviceId: number;
  serviceName: string;
}
