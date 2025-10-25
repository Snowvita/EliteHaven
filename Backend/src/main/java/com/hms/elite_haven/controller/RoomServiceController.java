package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.RoomServiceEntity;
import com.hms.elite_haven.service.RoomServiceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class RoomServiceController {

    @Autowired
    private RoomServiceService roomServiceService;

    // 1️⃣ Create a new room service or update an existing one
    @PostMapping("/save_service")
    public ResponseEntity<RoomServiceEntity> saveService(@RequestBody @Valid RoomServiceEntity service) {
        RoomServiceEntity savedService = roomServiceService.saveService(service);
        return ResponseEntity.ok(savedService);
    }

    // 2️⃣ Get all available room services
    @GetMapping("/all_services")
    public ResponseEntity<List<RoomServiceEntity>> getAllServices() {
        List<RoomServiceEntity> services = roomServiceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    // 3️⃣ Get a specific room service by ID
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<RoomServiceEntity> getServiceById(@PathVariable Long serviceId) {
        RoomServiceEntity service = roomServiceService.getServiceById(serviceId);
        return ResponseEntity.ok(service);
    }

    // 4️⃣ Delete a room service by ID
    @DeleteMapping("/delete_service/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceId) {
        roomServiceService.deleteService(serviceId);
        return ResponseEntity.ok("Service deleted successfully");
    }

    // 5️⃣ Get all services used for a particular booking
    @GetMapping("/service_booking/{bookingId}")
    public ResponseEntity<List<RoomServiceEntity>> getServicesByBooking(@PathVariable Long bookingId) {
        List<RoomServiceEntity> services = roomServiceService.getServicesByBooking(bookingId);
        return ResponseEntity.ok(services);
    }

    // 6️⃣ Get all services associated with a particular room
    @GetMapping("/service_room/{roomId}")
    public ResponseEntity<List<RoomServiceEntity>> getServicesByRoom(@PathVariable Long roomId) {
        List<RoomServiceEntity> services = roomServiceService.getServicesByRoom(roomId);
        return ResponseEntity.ok(services);
    }
}
