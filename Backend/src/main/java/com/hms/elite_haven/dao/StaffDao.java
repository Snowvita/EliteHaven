package com.hms.elite_haven.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.StaffEntity;

public interface StaffDao extends JpaRepository<StaffEntity, Long>{
    List<StaffEntity> findByHotel_HotelId(Long hotelId);

}
