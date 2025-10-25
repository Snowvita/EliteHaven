package com.hms.elite_haven.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.RoomEntity;
import com.hms.elite_haven.service.RoomService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Add a new room
    @PostMapping("/add_room")
    public ResponseEntity<RoomEntity> addRoom(@RequestBody @Valid RoomEntity room) {
        RoomEntity savedRoom = roomService.addRoom(room);
        return ResponseEntity.ok(savedRoom);
    }

    // Update room details
    @PutMapping("/update_room")
    public ResponseEntity<RoomEntity> updateRoom(@RequestBody @Valid RoomEntity room) {
        RoomEntity updatedRoom = roomService.updateRoom(room);
        return ResponseEntity.ok(updatedRoom);
    }

    // Get room by ID
    @GetMapping("/{roomId}")
    public ResponseEntity<RoomEntity> getRoomById(@PathVariable Long roomId) {
        Optional<RoomEntity> room = roomService.getRoomById(roomId);
        return room.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // Get all rooms (excluding deleted)
    @GetMapping("/all_rooms")
    public ResponseEntity<List<RoomEntity>> getAllRooms() {
        List<RoomEntity> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    // Get all rooms for a specific hotel (excluding deleted)
    @GetMapping("/room_hotel/{hotelId}")
    public ResponseEntity<List<RoomEntity>> getRoomsByHotel(@PathVariable Long hotelId) {
        List<RoomEntity> rooms = roomService.getRoomsByHotel(hotelId);
        return ResponseEntity.ok(rooms);
    }

    // Get all available rooms (excluding deleted)
    @GetMapping("/available_rooms")
    public ResponseEntity<List<RoomEntity>> getAvailableRooms() {
        List<RoomEntity> rooms = roomService.getAvailableRooms();
        return ResponseEntity.ok(rooms);
    }

    // Get available rooms by hotel (excluding deleted)
    @GetMapping("/available/hotel/{hotelId}")
    public ResponseEntity<List<RoomEntity>> getAvailableRoomsByHotel(@PathVariable Long hotelId) {
        List<RoomEntity> rooms = roomService.getAvailableRoomsByHotel(hotelId);
        return ResponseEntity.ok(rooms);
    }

    // Soft delete room
    @DeleteMapping("/soft_delete/{roomId}")
    public ResponseEntity<RoomEntity> softDeleteRoom(@PathVariable Long roomId) {
        Optional<RoomEntity> roomOpt = roomService.getRoomById(roomId);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        RoomEntity deletedRoom = roomService.deleteRoom(roomOpt.get());
        return ResponseEntity.ok(deletedRoom);
    }

    // Hard delete room (Admin only)
    @DeleteMapping("/hard_delete/{roomId}")
    public ResponseEntity<String> deleteRoomById(@PathVariable Long roomId) {
        roomService.deleteRoomById(roomId);
        return ResponseEntity.ok("Room deleted permanently");
    }
}
