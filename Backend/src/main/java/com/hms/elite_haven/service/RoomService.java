package com.hms.elite_haven.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.HotelDao;
import com.hms.elite_haven.dao.RoomDao;
import com.hms.elite_haven.dao.entity.RoomEntity;

import jakarta.transaction.Transactional;

@Service
public class RoomService {

    @Autowired
    private RoomDao roomDao;

    @Autowired
    private HotelDao hotelDao;

    @Autowired
    private BookingDao bookingDao;

    @Transactional
    public List<RoomEntity> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        List<Long> bookedRoomIds = bookingDao.findBookedRoomIdsBetweenDates(checkIn, checkOut);

        if (bookedRoomIds.isEmpty()) {
            return roomDao.findAll();
        }

        return roomDao.findByRoomIdNotIn(bookedRoomIds);
    }

    // Add a new room
    public RoomEntity addRoom(RoomEntity room) {
        room.setHotel(hotelDao.findById(room.getHotel().getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + room.getHotel().getHotelId())));
        return roomDao.save(room);
    }

    // Update room details
    public RoomEntity updateRoom(RoomEntity room) {
        return roomDao.save(room);
    }

    // Get room by ID
    public Optional<RoomEntity> getRoomById(Long roomId) {
        return roomDao.findById(roomId);
    }

    // Get all rooms (excluding deleted ones)
    public List<RoomEntity> getAllRooms() {
        return roomDao.findAll()
                      .stream()
                      .filter(room -> room.getIsDeleted() == 0)
                      .toList();
    }

    // Get all rooms for a specific hotel (excluding deleted)
    public List<RoomEntity> getRoomsByHotel(Long hotelId) {
        return roomDao.findByHotel_HotelId(hotelId)
                      .stream()
                      .filter(r -> r.getIsDeleted() == 0)
                      .toList();
    }

    // Soft delete room
    public RoomEntity deleteRoom(RoomEntity room) {
        room.setIsDeleted(1);
        return roomDao.save(room);
    }

    // Hard delete (if ever needed by admin)
    public void deleteRoomById(Long roomId) {
        roomDao.deleteById(roomId);
    }
}
