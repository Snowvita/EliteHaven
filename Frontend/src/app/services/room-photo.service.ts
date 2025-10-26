import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomPhotoModel } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomPhotoService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  addPhoto(roomPhoto: RoomPhotoModel): Observable<RoomPhotoModel> {
    return this.http.post<RoomPhotoModel>(
      `${this.baseUrl}/add_photo`,
      roomPhoto
    );
  }

  getPhotosByRoomId(roomId: number): Observable<RoomPhotoModel[]> {
    return this.http.get<RoomPhotoModel[]>(
      `${this.baseUrl}/room_photos/${roomId}`
    );
  }

  getPhotoById(photoId: number): Observable<RoomPhotoModel> {
    return this.http.get<RoomPhotoModel>(`${this.baseUrl}/photo/${photoId}`);
  }

  updatePhoto(roomPhoto: RoomPhotoModel): Observable<RoomPhotoModel> {
    return this.http.put<RoomPhotoModel>(
      `${this.baseUrl}/update_photo`,
      roomPhoto
    );
  }

  deletePhoto(photoId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete_photo/${photoId}`);
  }
}
