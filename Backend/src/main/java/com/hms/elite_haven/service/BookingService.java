package com.hms.elite_haven.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.utils.BookingStatus;

@Service
public class BookingService {

    @Autowired
    private BookingDao bookingDao;

    // Create booking (without payment)
    public BookingEntity createBooking(BookingEntity booking) {
        booking.setStatus(BookingStatus.PENDING);
        return bookingDao.save(booking);
    }

    // Confirm booking (after payment)
    public BookingEntity confirmBooking(BookingEntity booking) {
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingDao.save(booking);
    }

    // Cancel booking (only if PENDING)
    public BookingEntity cancelBooking(Long bookingId) {
        BookingEntity booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingDao.save(booking);
    }

    // Check-in
    public BookingEntity checkIn(Long bookingId) {
        BookingEntity booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CHECKED_IN);
        return bookingDao.save(booking);
    }

    // Check-out
    public BookingEntity checkOut(Long bookingId) {
        BookingEntity booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.COMPLETED);
        return bookingDao.save(booking);
    }

    // Get all bookings
    public List<BookingEntity> getAllBookings() {
        return bookingDao.findAll();
    }

    // Get booking by ID
    public BookingEntity getBookingById(Long bookingId) {
        return bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Get bookings by user
    public List<BookingEntity> getBookingByUserId(Long userId) {
        return bookingDao.findByUser_UserId(userId);
    }
}
