import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { StaffService } from '../../../services/staff.service';
import { HotelService } from '../../../services/hotel.service';
import { UserModel } from '../../../models/user.model';
import { StaffModel, StaffRegisterModel } from '../../../models/staff.model';
import { HotelModel } from '../../../models/hotel.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  hotels: HotelModel[] = [];
  staffData: StaffModel[] = [];

  selectedRole: string = 'ALL';
  searchTerm: string = '';
  isLoading: boolean = true;

  showEditModal: boolean = false;
  showDetailsModal: boolean = false;
  selectedUser: any = null;

  errorMessage: string = '';
  successMessage: string = '';

  editForm = {
    fullName: '',
    email: '',
    phone: 0,
    role: '',
    hotelId: 0,
  };

  constructor(
    private userService: UserService,
    private staffService: StaffService,
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    this.loadUsers();
  }

  loadHotels(): void {
    this.hotelService.getExistingHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
      },
    });
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userService.getAllUsers().subscribe({
      next: (users) => {

        // Count deleted users
        const deletedCount = users.filter((u) => u.isDeleted === 1).length;

        this.allUsers = users; // Keep ALL users
        this.loadStaffDetails();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      },
    });
  }

  loadStaffDetails(): void {
    this.staffService.getAllStaff().subscribe({
      next: (staffList) => {
        this.staffData = staffList;

        this.allUsers = this.allUsers.map((user) => {
          if (user.role === 'STAFF') {
            const staffInfo = staffList.find(
              (s) => s.user?.userId === user.userId
            );

            if (staffInfo) {
              return {
                ...user,
                staffId: (staffInfo as any).staffId,
                staffRole: staffInfo.role || 'Not Assigned',
                hotelName: staffInfo.hotel?.hotelName || 'No Hotel',
                hotelId: staffInfo.hotel?.hotelId || null,
                hireDate: this.formatDate(staffInfo.hiredDate),
              };
            }
          }
          return user;
        });

        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading staff details:', error);
        this.applyFilters();
        this.isLoading = false;
      },
    });
  }

  filterByRole(role: string): void {
    this.selectedRole = role;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.allUsers;

    // Filter by role or deleted status
    if (this.selectedRole === 'DELETED') {
      filtered = filtered.filter((u) => u.isDeleted === 1);
    } else if (this.selectedRole !== 'ALL') {
      filtered = filtered.filter(
        (u) =>
          u.role === this.selectedRole && (!u.isDeleted || u.isDeleted === 0)
      );
    } else {
      // Show only active users in ALL tab
      filtered = filtered.filter((u) => !u.isDeleted || u.isDeleted === 0);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  searchUsers(): void {
    this.applyFilters();
  }

  openDetailsModal(user: any): void {
    this.selectedUser = { ...user };

    if (user.role === 'STAFF') {
      const staffInfo = this.staffData.find(
        (s) => s.user?.userId === user.userId
      );

      if (staffInfo) {
        this.selectedUser = {
          ...user,
          staffId: (staffInfo as any).staffId,
          staffRole: staffInfo.role || 'Not Assigned',
          hotelName: staffInfo.hotel?.hotelName || 'No Hotel Assigned',
          hotelId: staffInfo.hotel?.hotelId || null,
          hireDate: this.formatDate(staffInfo.hiredDate),
        };
      }
    }

    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  openEditModal(user: any): void {
    this.selectedUser = user;
    this.editForm = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
      role: user.staffRole || user.role,
      hotelId: user.hotelId || 0,
    };
    this.showEditModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  updateUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedUser || !this.selectedUser.userId) {
      this.errorMessage = 'Invalid user selection';
      return;
    }

    if (!this.editForm.fullName || !this.editForm.email) {
      this.errorMessage = 'Full name and email are required';
      return;
    }

    if (!this.editForm.phone || this.editForm.phone < 1000000000) {
      this.errorMessage = 'Valid phone number is required';
      return;
    }

    if (this.selectedUser.role === 'STAFF') {
      const staffId = this.selectedUser.staffId;

      if (!staffId) {
        this.errorMessage = 'Staff ID not found';
        return;
      }

      const staffUpdateData: StaffRegisterModel = {
        fullName: this.editForm.fullName,
        email: this.editForm.email,
        phone: this.editForm.phone,
        role: this.editForm.role,
        hotelId: this.editForm.hotelId || 0,
        password: '',
      };

      this.staffService.updateStaff(staffId, staffUpdateData).subscribe({
        next: () => {
          this.closeEditModal();
          this.successMessage = 'Staff member updated successfully!';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating staff:', error);
          this.errorMessage =
            error.error?.message || 'Failed to update staff member';
        },
      });
    } else {
      const updateData: UserModel = {
        userId: this.selectedUser.userId,
        fullName: this.editForm.fullName,
        email: this.editForm.email,
        phoneNumber: this.editForm.phone,
        role: this.editForm.role,
      };

      this.userService.updateUser(updateData).subscribe({
        next: () => {
          this.closeEditModal();
          this.successMessage = 'User updated successfully!';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = error.error?.message || 'Failed to update user';
        },
      });
    }
  }

  deleteUser(user: any): void {
    if (!user.userId) {
      this.errorMessage = 'Invalid user data';
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete user "${user.fullName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    if (user.role === 'STAFF') {
      const staffId = user.staffId;

      if (!staffId) {
        this.errorMessage = 'Staff ID not found';
        return;
      }

      this.staffService.deleteStaff(staffId).subscribe({
        next: () => {
          this.successMessage = 'Staff member deleted successfully!';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loadUsers();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          console.error('Error deleting staff:', error);
          this.errorMessage =
            error.error?.message || 'Failed to delete staff member';
        },
      });
    } else {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully!';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loadUsers();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = error.error?.message || 'Failed to delete user';
        },
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    return (
      {
        CUSTOMER: 'badge-customer',
        STAFF: 'badge-staff',
        ADMIN: 'badge-admin',
      }[role] || ''
    );
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
