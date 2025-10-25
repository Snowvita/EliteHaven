package com.hms.elite_haven.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.BookingEntity;

public interface BookingDao extends JpaRepository<BookingEntity, Long>{
List<BookingEntity> findByUser_UserId(Long userId);
}
