package com.hms.elite_haven.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.RoomPhotoEntity;
import com.hms.elite_haven.service.RoomPhotoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class RoomPhotoController {

    @Autowired
    private RoomPhotoService roomPhotoService;

    // Add a new room photo
    @PostMapping("/add_photo")
    public ResponseEntity<RoomPhotoEntity> addPhoto(@RequestBody @Valid RoomPhotoEntity roomPhoto) {
        RoomPhotoEntity savedPhoto = roomPhotoService.addPhoto(roomPhoto);
        return ResponseEntity.ok(savedPhoto);
    }

    // Get all photos by room ID
    @GetMapping("/room_photos/{roomId}")
    public ResponseEntity<List<RoomPhotoEntity>> getPhotosByRoomId(@PathVariable Long roomId) {
        List<RoomPhotoEntity> photos = roomPhotoService.getPhotosByRoomId(roomId);
        return ResponseEntity.ok(photos);
    }

    // Get photo by ID
    @GetMapping("/photo/{photoId}")
    public ResponseEntity<RoomPhotoEntity> getPhotoById(@PathVariable Long photoId) {
        Optional<RoomPhotoEntity> photo = roomPhotoService.getPhotoById(photoId);
        return photo.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Update photo details (example: mark as primary)
    @PutMapping("/update_photo")
    public ResponseEntity<RoomPhotoEntity> updatePhoto(@RequestBody @Valid RoomPhotoEntity updatedPhoto) {
        RoomPhotoEntity photo = roomPhotoService.updatePhoto(updatedPhoto);
        return ResponseEntity.ok(photo);
    }

    // Delete photo by ID
    @DeleteMapping("/delete_photo/{photoId}")
    public ResponseEntity<String> deletePhoto(@PathVariable Long photoId) {
        roomPhotoService.deletePhoto(photoId);
        return ResponseEntity.ok("Photo deleted successfully");
    }
}
