import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomServiceModel } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomServiceService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  saveService(service: RoomServiceModel): Observable<RoomServiceModel> {
    return this.http.post<RoomServiceModel>(
      `${this.baseUrl}/save_service`,
      service
    );
  }

  getAllServices(): Observable<RoomServiceModel[]> {
    return this.http.get<RoomServiceModel[]>(`${this.baseUrl}/all_services`);
  }

  getServiceById(serviceId: number): Observable<RoomServiceModel> {
    return this.http.get<RoomServiceModel>(
      `${this.baseUrl}/service/${serviceId}`
    );
  }

  deleteService(serviceId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/delete_service/${serviceId}`
    );
  }

  getServicesByBooking(bookingId: number): Observable<RoomServiceModel[]> {
    return this.http.get<RoomServiceModel[]>(
      `${this.baseUrl}/service_booking/${bookingId}`
    );
  }

  getServicesByRoom(roomId: number): Observable<RoomServiceModel[]> {
    return this.http.get<RoomServiceModel[]>(
      `${this.baseUrl}/service_room/${roomId}`
    );
  }
}
