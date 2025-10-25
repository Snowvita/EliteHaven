package com.hms.elite_haven.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.BookingEntity;

public interface BookingDao extends JpaRepository<BookingEntity, Long>{

}
