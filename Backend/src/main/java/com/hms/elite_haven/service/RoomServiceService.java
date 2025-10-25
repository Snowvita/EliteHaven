package com.hms.elite_haven.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.RoomServiceDao;
import com.hms.elite_haven.dao.entity.RoomServiceEntity;

@Service
public class RoomServiceService {

    @Autowired
    private RoomServiceDao roomServiceDao;

    // Create or update a service
    public RoomServiceEntity saveService(RoomServiceEntity service) {
        return roomServiceDao.save(service);
    }

    // Get all services
    public List<RoomServiceEntity> getAllServices() {
        return roomServiceDao.findAll();
    }

    // Get service by ID
    public RoomServiceEntity getServiceById(Long serviceId) {
        return roomServiceDao.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));
    }

    // Delete service (soft delete can be implemented if needed)
    public void deleteService(Long serviceId) {
        roomServiceDao.deleteById(serviceId);
    }

    // Get all services for a particular booking
    public List<RoomServiceEntity> getServicesByBooking(Long bookingId) {
        return roomServiceDao.findByBookings_BookingId(bookingId);
    }

    // Get all services for a particular room
    public List<RoomServiceEntity> getServicesByRoom(Long roomId) {
        // Fetch all services associated with bookings of the room
        return roomServiceDao.findAll().stream()
                .filter(service -> service.getBookings().stream()
                        .anyMatch(booking -> booking.getRoom().getRoomId().equals(roomId)))
                .toList();
    }
}
