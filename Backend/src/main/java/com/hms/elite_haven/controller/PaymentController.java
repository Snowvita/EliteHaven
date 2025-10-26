package com.hms.elite_haven.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.PaymentEntity;
import com.hms.elite_haven.dto.PaymentRequestDto;
import com.hms.elite_haven.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Pay booking (creates a payment and marks booking as CONFIRMED if pending)
    @PostMapping("/pay")
    public ResponseEntity<PaymentEntity> processPayment(@RequestBody PaymentRequestDto paymentDto) {
        try {
            PaymentEntity payment = paymentService.processPayment(paymentDto);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all payments
    @GetMapping("/all_payments")
    public ResponseEntity<List<PaymentEntity>> getAllPayments() {
        List<PaymentEntity> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    // Get payment by ID
    @GetMapping("/get_payment/{paymentId}")
    public ResponseEntity<PaymentEntity> getPaymentById(@PathVariable Long paymentId) {
        PaymentEntity payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }

    // Get payments by Booking ID
    @GetMapping("/get_payment_booking/{bookingId}")
    public ResponseEntity<List<PaymentEntity>> getPaymentsByBooking(@PathVariable Long bookingId) {
        List<PaymentEntity> payments = paymentService.getPaymentsByBookingId(bookingId);
        return ResponseEntity.ok(payments);
    }

    // ---------------- Admin Reports ----------------

    // Total revenue by hotel
    @GetMapping("/revenue/hotel/{hotelId}")
    public ResponseEntity<Double> getTotalRevenueByHotel(@PathVariable Long hotelId) {
        Double revenue = paymentService.getTotalRevenueByHotel(hotelId);
        return ResponseEntity.ok(revenue);
    }

    // Daily payment report
    @GetMapping("/report/daily")
    public ResponseEntity<List<PaymentEntity>> getDailyPayments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<PaymentEntity> payments = paymentService.getDailyPayments(date);
        return ResponseEntity.ok(payments);
    }

    // Monthly payment report
    @GetMapping("/report/monthly")
    public ResponseEntity<List<PaymentEntity>> getMonthlyPayments(
            @RequestParam int year,
            @RequestParam int month) {
        List<PaymentEntity> payments = paymentService.getMonthlyPayments(year, month);
        return ResponseEntity.ok(payments);
    }

    // Monthly revenue
    @GetMapping("/revenue/monthly")
    public ResponseEntity<Double> getMonthlyRevenue(
            @RequestParam int year,
            @RequestParam int month) {
        Double revenue = paymentService.getMonthlyRevenue(year, month);
        return ResponseEntity.ok(revenue);
    }
}
