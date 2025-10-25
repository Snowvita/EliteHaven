package com.hms.elite_haven.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.PaymentEntity;

public interface PaymentDao extends JpaRepository<PaymentEntity, Long>{
    List<PaymentEntity> findByBooking_BookingId(Long bookingId);

}
