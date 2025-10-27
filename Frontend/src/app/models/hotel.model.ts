export interface HotelModel {
  hotelId?: number;
  hotelName: string;
  location: string;
  contactNumber?: string;
  description?: string;
  photoUrl?: string; // Add this field
  isDeleted?: number;
}
