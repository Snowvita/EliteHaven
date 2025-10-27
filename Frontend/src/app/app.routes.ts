import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { StaffDashboardComponent } from './components/pages/staff-dashboard/staff-dashboard.component';
import { BookingFormComponent } from './components/pages/booking-form/booking-form.component';
import { PaymentFormComponent } from './components/pages/payment-form/payment-form.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { MyBookingsComponent } from './components/pages/my-bookings/my-bookings.component';
import { authGuard, roleGuard } from './guards/auth.guard';
import { AdminProfileComponent } from './components/pages/admin-profile/admin-profile.component';
import { AddStaffComponent } from './components/pages/add-staff/add-staff.component';
import { HotelManagementComponent } from './components/pages/hotel-management/hotel-management.component';
import { RoomManagementComponent } from './components/pages/room-management/room-management.component';
import { UserManagementComponent } from './components/pages/user-management/user-management.component';
import { BookingManagementComponent } from './components/pages/booking-management/booking-management.component';
import { ReportsComponent } from './components/pages/reports/reports.component';
import { StaffBookingsComponent } from './components/pages/staff-bookings/staff-bookings.component';

export const routes: Routes = [
  // Public routes
  { path: '', component: LandingPageComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },

  // Protected routes - Admin/Staff Dashboards
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'staff-dashboard',
    component: StaffDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'STAFF' },
  },
  {
    path: 'staff-bookings',
    component: StaffBookingsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'STAFF' },
  },
  // Customer-specific routes
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [authGuard],
  },

  // Booking and Payment (require auth)
  {
    path: 'booking',
    component: BookingFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'payment',
    component: PaymentFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent,
    canActivate: [authGuard],
    // data: { role: 'ADMIN' },
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent,
    canActivate: [authGuard],
    // data: { role: 'STAFF' },
  },
  {
    path: 'admin/add-staff',
    component: AddStaffComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'admin/hotels',
    component: HotelManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'admin/rooms',
    component: RoomManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'admin/bookings',
    component: BookingManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'admin/reports',
    component: ReportsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
