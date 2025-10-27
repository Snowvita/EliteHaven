import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  showProfileMenu: boolean = false; // ← Make sure this exists

  constructor(private router: Router) {}

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      return JSON.parse(userDetails).role;
    }
    return '';
  }

  getUserName(): string {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      return JSON.parse(userDetails).fullName;
    }
    return '';
  }

  getUserEmail(): string {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      return JSON.parse(userDetails).email;
    }
    return '';
  }

  logout(): void {
    localStorage.clear();
    this.showProfileMenu = false;
    this.router.navigate(['/signin']);
  }

  navigateToHome(): void {
    const role = this.getRole();
    if (role === 'ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'STAFF') {
      this.router.navigate(['/staff-dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  navigateToDashboard(): void {
    const role = this.getRole();
    if (role === 'ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'STAFF') {
      this.router.navigate(['/staff-dashboard']);
    }
  }
}
