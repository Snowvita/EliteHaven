import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  createRole(role: RoleModel): Observable<RoleModel> {
    return this.http.post<RoleModel>(`${this.baseUrl}/create_role`, role);
  }

  getAllRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(`${this.baseUrl}/roles`);
  }

  getRoleById(roleId: number): Observable<RoleModel> {
    return this.http.get<RoleModel>(`${this.baseUrl}/role/${roleId}`);
  }

  getRoleByName(roleName: string): Observable<RoleModel> {
    return this.http.get<RoleModel>(`${this.baseUrl}/role_name/${roleName}`);
  }

  updateRole(role: RoleModel): Observable<RoleModel> {
    return this.http.put<RoleModel>(`${this.baseUrl}/update_role`, role);
  }

  deleteRole(roleId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete_role/${roleId}`);
  }
}
