package com.hms.elite_haven.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.RoomPhotoDao;
import com.hms.elite_haven.dao.entity.RoomPhotoEntity;

@Service
public class RoomPhotoService {

    @Autowired
    private RoomPhotoDao roomPhotoDao;

    // Add a new photo (input is the entity)
    public RoomPhotoEntity addPhoto(RoomPhotoEntity roomPhoto) {
        return roomPhotoDao.save(roomPhoto);
    }

    // Get all photos for a room
    public List<RoomPhotoEntity> getPhotosByRoomId(Long roomId) {
        return roomPhotoDao.findByRoom_RoomId(roomId);
    }

    // Get a specific photo by ID
    public Optional<RoomPhotoEntity> getPhotoById(Long photoId) {
        return roomPhotoDao.findById(photoId);
    }

    // Update photo details (like marking it as primary)
    public RoomPhotoEntity updatePhoto(RoomPhotoEntity roomPhoto) {
        return roomPhotoDao.save(roomPhoto);
    }

    // Delete photo by ID
    public void deletePhoto(Long photoId) {
        roomPhotoDao.deleteById(photoId);
    }
}
