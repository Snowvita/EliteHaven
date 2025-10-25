package com.hms.elite_haven.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.RoomEntity;
import com.hms.elite_haven.utils.RoomStatus;

public interface RoomDao extends JpaRepository<RoomEntity, Long>{
    List<RoomEntity> findByHotel_HotelId(Long hotelId);
    List<RoomEntity> findByStatus(RoomStatus status);
    List<RoomEntity> findByStatusAndHotel_HotelId(RoomStatus status, Long hotelId);
}
