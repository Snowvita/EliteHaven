import { HotelModel } from './hotel.model';
import { UserModel } from './user.model';

export interface ReviewModel {
  reviewId: number;
  user: UserModel;
  hotel: HotelModel;
  rating: number;
  comment?: string;
  createdAt: string;
}
