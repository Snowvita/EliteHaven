package com.hms.elite_haven.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.HotelEntity;

public interface HotelDao extends JpaRepository<HotelEntity, Long>{

}
