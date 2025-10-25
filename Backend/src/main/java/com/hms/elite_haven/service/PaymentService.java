package com.hms.elite_haven.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.PaymentDao;
import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.dao.entity.PaymentEntity;
import com.hms.elite_haven.utils.BookingStatus;
import com.hms.elite_haven.utils.PaymentStatus;

@Service
public class PaymentService {

    @Autowired
    private PaymentDao paymentDao;

    @Autowired
    private BookingDao bookingDao;

    // Pay booking (marks booking as CONFIRMED)
    public PaymentEntity payBooking(PaymentEntity payment) {
        BookingEntity booking = payment.getBooking();
        if (booking == null) throw new RuntimeException("Booking required");

        // Mark payment as SUCCESS
        payment.setPaymentStatus(PaymentStatus.SUCCESS);

        // Save payment
        PaymentEntity savedPayment = paymentDao.save(payment);

        // Update booking status if it was pending
        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingDao.save(booking);
        }

        return savedPayment;
    }

    // Get all payments
    public List<PaymentEntity> getAllPayments() {
        return paymentDao.findAll();
    }

    // Get payment by ID
    public PaymentEntity getPaymentById(Long paymentId) {
        return paymentDao.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // Get all payments by Booking ID
    public List<PaymentEntity> getPaymentsByBookingId(Long bookingId) {
        return paymentDao.findByBooking_BookingId(bookingId);
    }

    // ---------------- Admin Reports ----------------

    // Total revenue per hotel
    public Double getTotalRevenueByHotel(Long hotelId) {
        return paymentDao.findAll().stream()
                .filter(payment -> payment.getBooking() != null
                        && payment.getBooking().getRoom() != null
                        && payment.getBooking().getRoom().getHotel() != null
                        && payment.getBooking().getRoom().getHotel().getHotelId().equals(hotelId)
                        && payment.getPaymentStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(PaymentEntity::getAmount)
                .sum();
    }

    // Daily payment report
    public List<PaymentEntity> getDailyPayments(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        return paymentDao.findAll().stream()
                .filter(payment -> {
                    LocalDateTime paymentTime = payment.getPaymentDate().toLocalDateTime();
                    return !paymentTime.isBefore(startOfDay) && paymentTime.isBefore(endOfDay);
                })
                .collect(Collectors.toList());
    }

    // Monthly payment report
    public List<PaymentEntity> getMonthlyPayments(int year, int month) {
        return paymentDao.findAll().stream()
                .filter(payment -> {
                    LocalDateTime paymentTime = payment.getPaymentDate().toLocalDateTime();
                    return paymentTime.getYear() == year && paymentTime.getMonthValue() == month;
                })
                .collect(Collectors.toList());
    }

    // Total revenue in a given month
    public Double getMonthlyRevenue(int year, int month) {
        return getMonthlyPayments(year, month).stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(PaymentEntity::getAmount)
                .sum();
    }
}
