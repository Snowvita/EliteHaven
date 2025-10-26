import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelModel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  getAllHotels(): Observable<HotelModel[]> {
    return this.http.get<HotelModel[]>(`${this.baseUrl}/all_hotels`);
  }

  getExistingHotels(): Observable<HotelModel[]> {
    return this.http.get<HotelModel[]>(`${this.baseUrl}/existing_hotels`);
  }

  getHotelById(hotelId: number): Observable<HotelModel> {
    return this.http.get<HotelModel>(`${this.baseUrl}/get_hotel/${hotelId}`);
  }

  getHotelByName(hotelName: string): Observable<HotelModel> {
    return this.http.get<HotelModel>(
      `${this.baseUrl}/get_hotel_name/${hotelName}`
    );
  }

  createHotel(hotel: HotelModel): Observable<HotelModel> {
    return this.http.post<HotelModel>(`${this.baseUrl}/create_hotel`, hotel);
  }

  updateHotel(hotel: HotelModel): Observable<HotelModel> {
    return this.http.put<HotelModel>(`${this.baseUrl}/update_hotel`, hotel);
  }

  deleteHotel(hotelId: number): Observable<HotelModel> {
    return this.http.delete<HotelModel>(
      `${this.baseUrl}/delete_hotel/${hotelId}`
    );
  }
}
