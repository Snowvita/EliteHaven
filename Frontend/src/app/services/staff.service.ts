import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StaffModel, StaffRegisterModel } from '../models/staff.model'; // Update paths as needed

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  createStaff(staffDto: StaffRegisterModel): Observable<StaffModel> {
    return this.http.post<StaffModel>(`${this.baseUrl}/create_staff`, staffDto);
  }

  getAllStaff(): Observable<StaffModel[]> {
    return this.http.get<StaffModel[]>(`${this.baseUrl}/all_staffs`);
  }

  getStaffById(staffId: number): Observable<StaffModel> {
    return this.http.get<StaffModel>(`${this.baseUrl}/staff/${staffId}`);
  }

  updateStaff(
    staffId: number,
    staffDto: StaffRegisterModel
  ): Observable<StaffModel> {
    return this.http.put<StaffModel>(
      `${this.baseUrl}/update_staff/${staffId}`,
      staffDto
    );
  }

  deleteStaff(staffId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete_staff/${staffId}`);
  }

  getStaffByHotel(hotelId: number): Observable<StaffModel[]> {
    return this.http.get<StaffModel[]>(
      `${this.baseUrl}/hotel_staff/${hotelId}`
    );
  }
}
