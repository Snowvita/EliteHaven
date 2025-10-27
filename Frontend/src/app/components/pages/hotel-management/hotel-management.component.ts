import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-management.component.html',
  styleUrls: ['./hotel-management.component.css'],
})
export class HotelManagementComponent implements OnInit {
  hotels: any[] = [];
  filteredHotels: any[] = [];
  isLoading: boolean = true;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  searchTerm: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  hotelForm = {
    hotelId: 0,
    hotelName: '',
    location: '',
    description: '',
    contactNumber: '',
    photoUrl: '',
    isDeleted: 0,
  };

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.isLoading = true;
    this.hotelService.getExistingHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.filteredHotels = hotels;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.errorMessage = 'Failed to load hotels';
        this.isLoading = false;
      },
    });
  }

  searchHotels(): void {
    if (!this.searchTerm.trim()) {
      this.filteredHotels = this.hotels;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredHotels = this.hotels.filter(
      (hotel) =>
        hotel.hotelName.toLowerCase().includes(term) ||
        hotel.location.toLowerCase().includes(term)
    );
  }

  openAddModal(): void {
    this.resetForm();
    this.showAddModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  openEditModal(hotel: any): void {
    this.hotelForm = { ...hotel };
    this.showEditModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.hotelForm = {
      hotelId: 0,
      hotelName: '',
      location: '',
      description: '',
      contactNumber: '',
      photoUrl: '',
      isDeleted: 0,
    };
  }

  addHotel(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.hotelForm.hotelName || !this.hotelForm.location) {
      this.errorMessage = 'Hotel name and location are required';
      return;
    }

    // Remove hotelId for creation - it's auto-generated
    const { hotelId, ...hotelData } = this.hotelForm;

    this.hotelService.createHotel(hotelData).subscribe({
      next: (response) => {
        this.closeAddModal();
        this.successMessage = 'Hotel added successfully!';

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.loadHotels();

        // Clear success message after showing it
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error adding hotel:', error);
        this.errorMessage = error.error?.message || 'Failed to add hotel';
      },
    });
  }

  updateHotel(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.hotelForm.hotelName || !this.hotelForm.location) {
      this.errorMessage = 'Hotel name and location are required';
      return;
    }

    this.hotelService.updateHotel(this.hotelForm).subscribe({
      next: (response) => {
        this.closeEditModal();
        this.successMessage = 'Hotel updated successfully!';

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.loadHotels();

        // Clear success message after showing it
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating hotel:', error);
        this.errorMessage = error.error?.message || 'Failed to update hotel';
      },
    });
  }

  deleteHotel(hotelId: number, hotelName: string): void {
    if (
      !confirm(
        `Are you sure you want to delete "${hotelName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    this.hotelService.deleteHotel(hotelId).subscribe({
      next: () => {
        this.successMessage = 'Hotel deleted successfully!';
        this.loadHotels();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Error deleting hotel:', error);
        this.errorMessage = error.error?.message || 'Failed to delete hotel';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
