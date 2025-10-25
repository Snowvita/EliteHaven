package com.hms.elite_haven.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.RoomServiceEntity;

public interface RoomServiceDao extends JpaRepository<RoomServiceEntity, Long>{
    List<RoomServiceEntity> findByBookings_BookingId(Long bookingId);

}
