import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  user: any = null;
  isEditMode: boolean = false;
  isChangingPassword: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  editForm = {
    fullName: '',
    email: '',
    phoneNumber: 0,
  };

  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) {
      alert('Please sign in to view profile');
      this.router.navigate(['/signin']);
      return;
    }

    this.user = JSON.parse(userDetailsStr);
    this.editForm = {
      fullName: this.user.fullName || '',
      email: this.user.email || '',
      phoneNumber: this.user.phoneNumber || 0,
    };
    this.isLoading = false;
  }

  enableEditMode(): void {
    this.isEditMode = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.loadUserProfile();
    this.errorMessage = '';
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.editForm.fullName || !this.editForm.email) {
      this.errorMessage = 'Name and email are required';
      return;
    }

    const updateData = {
      userId: this.user.userId,
      fullName: this.editForm.fullName,
      email: this.editForm.email,
      phoneNumber: this.editForm.phoneNumber,
      role: this.user.role,
    };

    this.userService.updateUser(updateData).subscribe({
      next: (response) => {
        const updatedUser = { ...this.user, ...updateData };
        localStorage.setItem('userDetails', JSON.stringify(updatedUser));

        this.user = updatedUser;
        this.isEditMode = false;
        this.successMessage = 'Profile updated successfully!';

        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.message || 'Failed to update profile';
      },
    });
  }

  togglePasswordChange(): void {
    this.isChangingPassword = !this.isChangingPassword;
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  changePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.passwordForm.oldPassword ||
      !this.passwordForm.newPassword ||
      !this.passwordForm.confirmPassword
    ) {
      this.errorMessage = 'All password fields are required';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    if (this.passwordForm.newPassword.length < 8) {
      this.errorMessage = 'New password must be at least 8 characters';
      return;
    }

    const passwordData = {
      userId: this.user.userId,
      oldPassword: this.passwordForm.oldPassword,
      newPassword: this.passwordForm.newPassword,
      confirmNewPassword: this.passwordForm.confirmPassword,
    };

    this.userService.changePassword(passwordData).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.isChangingPassword = false;
        this.passwordForm = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        };

        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.errorMessage = error.error?.message || 'Failed to change password';
      },
    });
  }

  get passwordsMatch(): boolean {
    if (!this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      return true;
    }
    return this.passwordForm.newPassword === this.passwordForm.confirmPassword;
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
