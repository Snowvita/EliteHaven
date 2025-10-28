package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.dto.BookingRequestDto;
import com.hms.elite_haven.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a new booking (without payment)
    @PostMapping("/create_booking")
    public ResponseEntity<BookingEntity> createBooking(@Valid @RequestBody BookingRequestDto bookingDto) {
        BookingEntity createdBooking = bookingService.createBooking(bookingDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
    }


    // Confirm booking (after payment)
    @PutMapping("/confirm_booking/{bookingId}")
    public ResponseEntity<BookingEntity> confirmBooking(@PathVariable Long bookingId) {
        BookingEntity confirmedBooking = bookingService.confirmBooking(bookingId);
        return ResponseEntity.ok(confirmedBooking);
    }

    // Cancel booking (only if PENDING)
    @PutMapping("/cancel_booking/{bookingId}")
    public ResponseEntity<BookingEntity> cancelBooking(@PathVariable Long bookingId) {
        BookingEntity cancelledBooking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(cancelledBooking);
    }

    // Check-in
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PutMapping("/checkin/{bookingId}")
    public ResponseEntity<BookingEntity> checkIn(@PathVariable Long bookingId) {
        BookingEntity checkedInBooking = bookingService.checkIn(bookingId);
        return ResponseEntity.ok(checkedInBooking);
    }

    // Check-out
    @PutMapping("/checkout/{bookingId}")
    public ResponseEntity<BookingEntity> checkOut(@PathVariable Long bookingId) {
        BookingEntity checkedOutBooking = bookingService.checkOut(bookingId);
        return ResponseEntity.ok(checkedOutBooking);
    }

    // Get all bookings
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/all_bookings")
    public ResponseEntity<List<BookingEntity>> getAllBookings() {
        List<BookingEntity> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Get booking by ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<BookingEntity> getBookingById(@PathVariable Long bookingId) {
        BookingEntity booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    // Get bookings by user
    @GetMapping("/user_bookings/{userId}")
    public ResponseEntity<List<BookingEntity>> getBookingsByUser(@PathVariable Long userId) {
        List<BookingEntity> bookings = bookingService.getBookingByUserId(userId);
        return ResponseEntity.ok(bookings);
    }
}
