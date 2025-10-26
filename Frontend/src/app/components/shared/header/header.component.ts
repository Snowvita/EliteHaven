import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Added RouterLinkActive
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  showProfileMenu: boolean = false;

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getUserName(): string {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) return '';
    try {
      const userDetails = JSON.parse(userDetailsStr);
      return userDetails.fullName || userDetails.email || 'User';
    } catch {
      return '';
    }
  }

  getUserEmail(): string {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) return '';
    try {
      const userDetails = JSON.parse(userDetailsStr);
      return userDetails.email || '';
    } catch {
      return '';
    }
  }

  getRole(): string {
    const userDetailsStr = localStorage.getItem('userDetails');
    if (!userDetailsStr) return '';
    try {
      const userDetails = JSON.parse(userDetailsStr);
      return userDetails.role || '';
    } catch {
      return '';
    }
  }

  navigateToHome(): void {
    if (this.isLoggedIn()) {
      const role = this.getRole();
      if (role === 'CUSTOMER') {
        this.router.navigate(['/']);
      } else {
        this.navigateToDashboard();
      }
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
    } else if (role === 'CUSTOMER') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/']);
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.showProfileMenu = false;
    }
  }

  logout(): void {
    this.showProfileMenu = false;
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    this.router.navigate(['/']);
  }
}
