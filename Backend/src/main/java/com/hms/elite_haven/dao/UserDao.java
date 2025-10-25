package com.hms.elite_haven.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.elite_haven.dao.entity.UserEntity;

@Repository
public interface UserDao extends JpaRepository<UserEntity, Long>{

}
