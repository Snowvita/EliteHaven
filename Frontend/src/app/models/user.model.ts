export interface LoginModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  fullName: string;
  email: string;
  phone: number; // Registration uses 'phone'
  password: string;
}

export interface UserModel {
  userId?: number;
  fullName: string;
  email: string;
  phoneNumber: number; // Backend returns 'phoneNumber' in UserDetailsDto
  role: string; // Single role as string
  isDeleted?: number;
}

export interface RoleModel {
  roleId: number;
  roleName: string;
}

export interface ChangePasswordModel {
  userId: number;
  oldPassword: string;
  newPassword: string;
}
