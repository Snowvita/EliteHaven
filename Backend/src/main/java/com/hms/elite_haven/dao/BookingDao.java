package com.hms.elite_haven.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hms.elite_haven.dao.entity.BookingEntity;

public interface BookingDao extends JpaRepository<BookingEntity, Long>{
    List<BookingEntity> findByUser_UserId(Long userId);

    
    @Query("""
        SELECT b.room.roomId FROM BookingEntity b
        WHERE (b.status = 'CONFIRMED' OR b.status = 'PENDING' OR b.status = 'CHECKED_IN')
        AND (:checkIn < b.checkOutDate AND :checkOut >= b.checkInDate)
    """)
    List<Long> findBookedRoomIdsBetweenDates(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    @Query("""
    SELECT CASE WHEN COUNT(b) > 0 THEN TRUE ELSE FALSE END
    FROM BookingEntity b
    WHERE b.room.roomId = :roomId
      AND b.status IN ('CONFIRMED', 'PENDING', 'CHECKED_IN')
      AND (:checkIn < b.checkOutDate AND :checkOut > b.checkInDate)
    """)
    boolean existsOverlappingBooking(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);

}
