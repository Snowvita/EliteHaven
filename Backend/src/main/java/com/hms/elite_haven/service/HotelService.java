package com.hms.elite_haven.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.HotelDao;
import com.hms.elite_haven.dao.entity.HotelEntity;

@Service
public class HotelService {

    @Autowired
    private HotelDao hotelDao;

    // Create a new hotel
    public HotelEntity createHotel(HotelEntity hotel) {
        return hotelDao.save(hotel);
    }

    // Get all hotels
    public List<HotelEntity> getAllHotels() {
        return hotelDao.findAll().stream()
                .filter(hotel -> hotel.getIsDeleted() == 0)
                .toList();
    }

    // Get all hotels (excluding deleted)
    public List<HotelEntity> getExistingHotels() {
        return hotelDao.findAll().stream()
                .filter(hotel -> hotel.getIsDeleted() == 0)
                .toList();
    }

    // Get hotel by ID
    public HotelEntity getHotelById(Long hotelId) {
        return hotelDao.findById(hotelId).filter(hotel -> hotel.getIsDeleted() == 0)
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + hotelId));
    }

        // Get hotel by ID
    public HotelEntity getHotelByName(String hotelName) {
        return hotelDao.findByHotelName(hotelName).filter(hotel -> hotel.getIsDeleted() == 0)
                .orElseThrow(() -> new RuntimeException("Hotel not found with name: " + hotelName));
    }

    // Update hotel details
    public HotelEntity updateHotel(HotelEntity hotel) {
        HotelEntity existing = getHotelById(hotel.getHotelId());

        if (hotel.getHotelName() != null) existing.setHotelName(hotel.getHotelName());
        if (hotel.getLocation() != null) existing.setLocation(hotel.getLocation());
        if (hotel.getContactNumber() != null) existing.setContactNumber(hotel.getContactNumber());
        if (hotel.getDescription() != null) existing.setDescription(hotel.getDescription());

        return hotelDao.save(existing);
    }

    // Soft delete hotel
    public HotelEntity deleteHotel(Long hotelId) {
        HotelEntity hotel = getHotelById(hotelId);
        hotel.setIsDeleted(1);
        return hotelDao.save(hotel);
    }
}
