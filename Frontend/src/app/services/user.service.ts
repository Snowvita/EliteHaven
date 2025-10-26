import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model'; // Update path as needed
import { RegisterModel } from '../models/user.model'; // Update path as needed
import { ChangePasswordModel } from '../models/user.model'; // Update path as needed

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  registerUser(dto: RegisterModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/register_user`, dto);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/all_users`);
  }

  getAllActiveUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/active_users`);
  }

  getUserById(userId: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/user/${userId}`);
  }

  getUserByEmail(email: string): Observable<UserModel> {
    return this.http.get<UserModel>(
      `${this.baseUrl}/user/email?email=${encodeURIComponent(email)}`
    );
  }

  updateUser(dto: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/update_user`, dto);
  }

  changePassword(dto: ChangePasswordModel): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/change-password`, dto);
  }

  deleteUser(userId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete_user/${userId}`);
  }
}
