package com.hms.elite_haven.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.elite_haven.dao.entity.RoomPhotoEntity;

public interface RoomPhotoDao extends JpaRepository<RoomPhotoEntity, Long>{
    List<RoomPhotoEntity> findByRoom_RoomId(Long roomId);
}
