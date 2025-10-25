package com.hms.elite_haven.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.HotelEntity;

public interface HotelDao extends JpaRepository<HotelEntity, Long>{

    Optional<HotelEntity> findByHotelName(String hotelName);
}
