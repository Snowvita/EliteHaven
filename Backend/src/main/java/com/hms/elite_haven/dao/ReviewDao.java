package com.hms.elite_haven.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.ReviewEntity;

public interface ReviewDao extends JpaRepository<ReviewEntity, Long>{

}
