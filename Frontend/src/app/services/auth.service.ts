import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginModel, UserModel } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: LoginModel): Observable<{token: string, userDetails: UserModel}> {
    return this.http.post<{token: string, userDetails: UserModel}>('/api/v1/auth/login', data);
  }
}
