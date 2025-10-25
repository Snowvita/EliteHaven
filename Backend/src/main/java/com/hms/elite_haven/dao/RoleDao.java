package com.hms.elite_haven.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.RoleEntity;

public interface RoleDao extends JpaRepository<RoleEntity, Long>{
    Optional<RoleEntity> findByRoleName(String roleName);
}
