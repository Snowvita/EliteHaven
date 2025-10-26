import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomModel } from '../models/room.model'; // update import path if needed

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  addRoom(room: RoomModel): Observable<RoomModel> {
    return this.http.post<RoomModel>(`${this.baseUrl}/add_room`, room);
  }

  updateRoom(room: RoomModel): Observable<RoomModel> {
    return this.http.put<RoomModel>(`${this.baseUrl}/update_room`, room);
  }

  getRoomById(roomId: number): Observable<RoomModel> {
    return this.http.get<RoomModel>(`${this.baseUrl}/get_room/${roomId}`);
  }

  getAllRooms(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${this.baseUrl}/all_rooms`);
  }

  getRoomsByHotel(hotelId: number): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${this.baseUrl}/room_hotel/${hotelId}`);
  }

  getAvailableRooms(
    checkIn: string,
    checkOut: string
  ): Observable<RoomModel[]> {
    // Dates should be in ISO format: 'YYYY-MM-DD'
    return this.http.get<RoomModel[]>(
      `${this.baseUrl}/available?checkIn=${checkIn}&checkOut=${checkOut}`
    );
  }

  softDeleteRoom(roomId: number): Observable<RoomModel> {
    return this.http.delete<RoomModel>(`${this.baseUrl}/soft_delete/${roomId}`);
  }

  hardDeleteRoom(roomId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/hard_delete/${roomId}`);
  }
}
