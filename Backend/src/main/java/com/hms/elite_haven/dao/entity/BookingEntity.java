package com.hms.elite_haven.dao.entity;

import java.sql.Timestamp;
import java.time.LocalDate;

import com.hms.elite_haven.utils.BookingStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private RoomEntity room;

    @ManyToOne
    @JoinColumn(name = "booked_by_staff_id")
    private StaffEntity bookedByStaff;

    @NotNull
    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @NotNull
    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @NotNull
    @Column(name = "number_of_guests")
    private Integer numberOfGuests;  // ← ADD THIS

    @NotNull
    @Column(name = "total_price")
    private Double totalPrice;  // ← ADD THIS

    @Column(name = "created_at")
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status = BookingStatus.PENDING;
}
