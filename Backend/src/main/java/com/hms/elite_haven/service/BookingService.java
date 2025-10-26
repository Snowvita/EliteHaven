package com.hms.elite_haven.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.PaymentDao;
import com.hms.elite_haven.dao.RoomDao;
import com.hms.elite_haven.dao.UserDao;
import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.dao.entity.PaymentEntity;
import com.hms.elite_haven.dao.entity.RoomEntity;
import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.dto.BookingRequestDto;
import com.hms.elite_haven.utils.BookingStatus;
import com.hms.elite_haven.utils.PaymentStatus;

import jakarta.transaction.Transactional;

@Service
public class BookingService {

    @Autowired
    private BookingDao bookingDao;
    
    @Autowired
    private RoomDao roomDao;
    
    @Autowired
    private UserDao userDao;

    @Autowired
    private PaymentDao paymentDao;
    
    // Create booking from DTO
    @Transactional
    public BookingEntity createBooking(BookingRequestDto bookingDto) {
        // Fetch Room and User entities
        RoomEntity room = roomDao.findById(bookingDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + bookingDto.getRoomId()));
        
        UserEntity user = userDao.findById(bookingDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + bookingDto.getUserId()));
        
        // Check for overlaps
        boolean isOverlapping = bookingDao.existsOverlappingBooking(
                bookingDto.getRoomId(), 
                bookingDto.getCheckInDate(), 
                bookingDto.getCheckOutDate()
        );

        if (isOverlapping) {
            throw new IllegalStateException("Room already booked for the selected dates.");
        }

        // Create booking entity
        BookingEntity booking = new BookingEntity();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCheckInDate(bookingDto.getCheckInDate());
        booking.setCheckOutDate(bookingDto.getCheckOutDate());
        booking.setNumberOfGuests(bookingDto.getNumberOfGuests());
        booking.setTotalPrice(bookingDto.getTotalPrice());
        booking.setStatus(BookingStatus.PENDING);

        return bookingDao.save(booking);
    }

    // Confirm booking (after payment)
    public BookingEntity confirmBooking(Long bookingId) {
        BookingEntity booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingDao.save(booking);
    }

    // Cancel booking (only if PENDING)
    @Transactional
    public BookingEntity cancelBooking(Long bookingId) {
        BookingEntity booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }
        
        // Check 24-hour cancellation policy
        LocalDate now = LocalDate.now();
        if (now.plusDays(1).isAfter(booking.getCheckInDate())) {
            throw new RuntimeException("Cannot cancel within 24 hours of check-in");
        }
        
        // Mock refund: Find payment and mark as refunded
        List<PaymentEntity> payments = paymentDao.findByBooking_BookingId(bookingId);
        for (PaymentEntity payment : payments) {
            if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
                payment.setIsRefunded(true);  // ← FIXED
                payment.setRefundAmount(payment.getAmount());
                payment.setRefundDate(new Timestamp(System.currentTimeMillis()));
                paymentDao.save(payment);
            }
        }
        
        // Cancel booking
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
