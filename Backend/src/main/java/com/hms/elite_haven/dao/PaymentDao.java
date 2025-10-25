package com.hms.elite_haven.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.PaymentEntity;

public interface PaymentDao extends JpaRepository<PaymentEntity, Long>{

}
