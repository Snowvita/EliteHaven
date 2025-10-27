import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { HotelService } from '../../../services/hotel.service';
import { RoomPhotoService } from '../../../services/room-photo.service';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.css'],
})
export class RoomManagementComponent implements OnInit {
  rooms: any[] = [];
  filteredRooms: any[] = [];
  hotels: any[] = [];
  isLoading: boolean = true;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showPhotoModal: boolean = false;
  searchTerm: string = '';
  selectedHotelFilter: number = 0;
  errorMessage: string = '';
  successMessage: string = '';

  currentRoomForPhotos: any = null;
  roomPhotos: any[] = [];
  newPhotoUrl: string = '';
  isLoadingPhotos: boolean = false;

  roomTypes = ['SINGLE', 'DOUBLE', 'SUITE'];

  roomForm = {
    roomId: 0,
    hotel: { hotelId: 0 },
    roomNumber: '',
    type: 'SINGLE',
    pricePerNight: 0,
    isDeleted: 0,
  };

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private roomPhotoService: RoomPhotoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    this.loadRooms();
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

  loadRooms(): void {
    this.isLoading = true;
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        // Filter out rooms whose hotel is deleted
        this.rooms = rooms.filter(
          (room) => room.hotel && room.hotel.isDeleted === 0
        );
        this.filteredRooms = this.rooms;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.errorMessage = 'Failed to load rooms';
        this.isLoading = false;
      },
    });
  }

  filterRooms(): void {
    let filtered = this.rooms;

    // Filter by hotel
    if (this.selectedHotelFilter !== 0) {
      filtered = filtered.filter(
        (room) => room.hotel.hotelId === this.selectedHotelFilter
      );
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.roomNumber.toLowerCase().includes(term) ||
          room.hotel.hotelName.toLowerCase().includes(term) ||
          room.type.toLowerCase().includes(term)
      );
    }

    this.filteredRooms = filtered;
  }

  onHotelFilterChange(): void {
    this.filterRooms();
  }

  searchRooms(): void {
    this.filterRooms();
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

  openEditModal(room: any): void {
    this.roomForm = {
      roomId: room.roomId,
      hotel: { hotelId: room.hotel.hotelId },
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      isDeleted: room.isDeleted || 0,
    };
    this.showEditModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.roomForm = {
      roomId: 0,
      hotel: { hotelId: 0 },
      roomNumber: '',
      type: 'SINGLE',
      pricePerNight: 0,
      isDeleted: 0,
    };
  }

  addRoom(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.roomForm.hotel.hotelId ||
      !this.roomForm.roomNumber ||
      !this.roomForm.pricePerNight
    ) {
      this.errorMessage = 'Hotel, room number, and price are required';
      return;
    }

    if (this.roomForm.pricePerNight <= 0) {
      this.errorMessage = 'Price must be greater than zero';
      return;
    }

    // Make sure hotelId is a number
    const hotelId = Number(this.roomForm.hotel.hotelId);

    // Fetch the full hotel object first
    const selectedHotel = this.hotels.find((h) => h.hotelId === hotelId);

    if (!selectedHotel) {
      console.error('Hotel not found. Available hotels:', this.hotels);
      console.error('Looking for hotelId:', hotelId);
      this.errorMessage =
        'Selected hotel not found. Please refresh and try again.';
      return;
    }

    // Prepare room data with full hotel object and proper type casting
    const roomData: any = {
      hotel: selectedHotel,
      roomNumber: this.roomForm.roomNumber,
      type: this.roomForm.type as any,
      pricePerNight: this.roomForm.pricePerNight,
      isDeleted: 0,
    };

    this.roomService.addRoom(roomData).subscribe({
      next: (response) => {
        this.closeAddModal();
        this.successMessage = 'Room added successfully!';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.loadRooms();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error adding room:', error);
        this.errorMessage = error.error?.message || 'Failed to add room';
      },
    });
  }

  updateRoom(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.roomForm.hotel.hotelId ||
      !this.roomForm.roomNumber ||
      !this.roomForm.pricePerNight
    ) {
      this.errorMessage = 'Hotel, room number, and price are required';
      return;
    }

    if (this.roomForm.pricePerNight <= 0) {
      this.errorMessage = 'Price must be greater than zero';
      return;
    }

    // Make sure hotelId is a number
    const hotelId = Number(this.roomForm.hotel.hotelId);

    // Fetch the full hotel object
    const selectedHotel = this.hotels.find((h) => h.hotelId === hotelId);

    if (!selectedHotel) {
      console.error('Hotel not found. Available hotels:', this.hotels);
      console.error('Looking for hotelId:', hotelId);
      this.errorMessage =
        'Selected hotel not found. Please refresh and try again.';
      return;
    }

    // Prepare room data with full hotel object and proper type casting
    const roomData: any = {
      roomId: this.roomForm.roomId,
      hotel: selectedHotel,
      roomNumber: this.roomForm.roomNumber,
      type: this.roomForm.type as any,
      pricePerNight: this.roomForm.pricePerNight,
      isDeleted: this.roomForm.isDeleted,
    };

    this.roomService.updateRoom(roomData).subscribe({
      next: (response) => {
        this.closeEditModal();
        this.successMessage = 'Room updated successfully!';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.loadRooms();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating room:', error);
        this.errorMessage = error.error?.message || 'Failed to update room';
      },
    });
  }

  deleteRoom(roomId: number, roomNumber: string): void {
    if (
      !confirm(
        `Are you sure you want to delete Room ${roomNumber}? This action cannot be undone.`
      )
    ) {
      return;
    }

    this.roomService.softDeleteRoom(roomId).subscribe({
      next: () => {
        this.successMessage = 'Room deleted successfully!';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.loadRooms();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Error deleting room:', error);
        this.errorMessage = error.error?.message || 'Failed to delete room';
      },
    });
  }

  // Photo Management Methods
  openPhotoModal(room: any): void {
    this.currentRoomForPhotos = room;
    this.showPhotoModal = true;
    this.loadRoomPhotos(room.roomId);
    this.newPhotoUrl = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  closePhotoModal(): void {
    this.showPhotoModal = false;
    this.currentRoomForPhotos = null;
    this.roomPhotos = [];
    this.newPhotoUrl = '';
  }

  loadRoomPhotos(roomId: number): void {
    this.isLoadingPhotos = true;
    this.roomPhotoService.getPhotosByRoomId(roomId).subscribe({
      next: (photos) => {
        this.roomPhotos = photos;
        this.isLoadingPhotos = false;
      },
      error: (error) => {
        console.error('Error loading photos:', error);
        this.isLoadingPhotos = false;
      },
    });
  }

  addPhoto(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.newPhotoUrl.trim()) {
      this.errorMessage = 'Please enter a photo URL';
      return;
    }

    const photoData = {
      photoUrl: this.newPhotoUrl,
      room: this.currentRoomForPhotos,
      isPrimary: this.roomPhotos.length === 0,
    };

    this.roomPhotoService.addPhoto(photoData as any).subscribe({
      next: (response) => {
        this.successMessage = 'Photo added successfully!';
        this.newPhotoUrl = '';
        this.loadRoomPhotos(this.currentRoomForPhotos.roomId);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Error adding photo:', error);
        this.errorMessage = error.error?.message || 'Failed to add photo';
      },
    });
  }

  setPrimaryPhoto(photoId: number): void {
    this.roomPhotoService.getPhotoById(photoId).subscribe({
      next: (photo) => {
        // Update all photos to not primary
        this.roomPhotos.forEach((p) => {
          if (p.isPrimary && p.photoId !== photoId) {
            this.roomPhotoService
              .updatePhoto({ ...p, isPrimary: false })
              .subscribe();
          }
        });

        // Set this photo as primary
        this.roomPhotoService
          .updatePhoto({ ...photo, isPrimary: true })
          .subscribe({
            next: () => {
              this.successMessage = 'Primary photo updated!';
              this.loadRoomPhotos(this.currentRoomForPhotos.roomId);
              setTimeout(() => (this.successMessage = ''), 3000);
            },
          });
      },
    });
  }

  deletePhoto(photoId: number): void {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    this.roomPhotoService.deletePhoto(photoId).subscribe({
      next: () => {
        this.successMessage = 'Photo deleted successfully!';
        this.loadRoomPhotos(this.currentRoomForPhotos.roomId);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Error deleting photo:', error);
        this.errorMessage = error.error?.message || 'Failed to delete photo';
      },
    });
  }

  getHotelName(hotelId: number): string {
    const hotel = this.hotels.find((h) => h.hotelId === hotelId);
    return hotel ? hotel.hotelName : 'Unknown';
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
