package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.HotelEntity;
import com.hms.elite_haven.service.HotelService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // Create a new hotel
    @PostMapping("/create_hotel")
    public ResponseEntity<HotelEntity> createHotel(@RequestBody @Valid HotelEntity hotel) {
        HotelEntity savedHotel = hotelService.createHotel(hotel);
        return ResponseEntity.ok(savedHotel);
    }

    // Get all hotels
    @GetMapping("/all_hotels")
    public ResponseEntity<List<HotelEntity>> getAllHotels() {
        List<HotelEntity> hotels = hotelService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    // Get existing hotels (excluding deleted)
    @GetMapping("/existing_hotels")
    public ResponseEntity<List<HotelEntity>> getExistingHotels() {
        List<HotelEntity> hotels = hotelService.getExistingHotels();
        return ResponseEntity.ok(hotels);
    }

    // Get hotel by ID
    @GetMapping("/get_hotel/{hotelId}")
    public ResponseEntity<HotelEntity> getHotelById(@PathVariable Long hotelId) {
        HotelEntity hotel = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(hotel);
    }

    // Get hotel by name
    @GetMapping("/get_hotel_name/{hotelName}")
    public ResponseEntity<HotelEntity> getHotelByName(@PathVariable String hotelName) {
        HotelEntity hotel = hotelService.getHotelByName(hotelName);
        return ResponseEntity.ok(hotel);
    }

    // Update hotel details
    @PutMapping("/update_hotel")
    public ResponseEntity<HotelEntity> updateHotel(@RequestBody @Valid HotelEntity hotel) {
        HotelEntity updatedHotel = hotelService.updateHotel(hotel);
        return ResponseEntity.ok(updatedHotel);
    }

    // Soft delete hotel
    @DeleteMapping("/delete_hotel/{hotelId}")
    public ResponseEntity<HotelEntity> deleteHotel(@PathVariable Long hotelId) {
        HotelEntity deletedHotel = hotelService.deleteHotel(hotelId);
        return ResponseEntity.ok(deletedHotel);
    }
}
