package com.hms.elite_haven.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hms.elite_haven.dao.HotelDao;
import com.hms.elite_haven.dao.RoomDao;
import com.hms.elite_haven.dao.entity.HotelEntity;
import com.hms.elite_haven.dao.entity.RoomEntity;
import com.hms.elite_haven.utils.RoomType;

@ExtendWith(MockitoExtension.class)
public class RoomServiceTest {

    @Mock
    private RoomDao roomDao;

    @Mock
    private HotelDao hotelDao;

    @InjectMocks
    private RoomService roomService;

    private RoomEntity testRoom;

    @BeforeEach
    void setUp() {
        testRoom = new RoomEntity();
        testRoom.setRoomId(1L);
        testRoom.setRoomNumber("101");
        testRoom.setType(RoomType.SUITE);
        testRoom.setPricePerNight(1000.0);
        //testRoom.setStatus(RoomStatus.AVAILABLE);
        testRoom.setIsDeleted(0);
    }

    @Test
    void addRoom_ShouldSaveAndReturnRoom() {
        // Arrange
        HotelEntity hotel = new HotelEntity();
        hotel.setHotelId(1L);
        testRoom.setHotel(hotel);

        when(hotelDao.findById(1L)).thenReturn(Optional.of(hotel));
        when(roomDao.save(any(RoomEntity.class))).thenReturn(testRoom);

        // Act
        RoomEntity result = roomService.addRoom(testRoom);

        // Assert
        assertNotNull(result);
        assertEquals(testRoom.getRoomNumber(), result.getRoomNumber());
        assertEquals(testRoom.getType(), result.getType());
        verify(hotelDao).findById(1L);
        verify(roomDao).save(testRoom);
    }

    @Test
    void updateRoom_ShouldUpdateAndReturnRoom() {
        // Arrange
        when(roomDao.save(any(RoomEntity.class))).thenReturn(testRoom);

        // Act
        RoomEntity result = roomService.updateRoom(testRoom);

        // Assert
        assertNotNull(result);
        assertEquals(testRoom.getRoomNumber(), result.getRoomNumber());
        verify(roomDao).save(testRoom);
    }

    @Test
    void getRoomById_WhenRoomExists_ShouldReturnRoom() {
        // Arrange
        when(roomDao.findById(1L)).thenReturn(Optional.of(testRoom));

        // Act
        Optional<RoomEntity> result = roomService.getRoomById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testRoom.getRoomId(), result.get().getRoomId());
    }

    @Test
    void getRoomById_WhenRoomNotFound_ShouldReturnEmpty() {
        // Arrange
        when(roomDao.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<RoomEntity> result = roomService.getRoomById(1L);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void getAllRooms_ShouldReturnOnlyNonDeletedRooms() {
        // Arrange
        RoomEntity deletedRoom = new RoomEntity();
        deletedRoom.setRoomId(2L);
        deletedRoom.setIsDeleted(1);

        when(roomDao.findAll()).thenReturn(Arrays.asList(testRoom, deletedRoom));

        // Act
        List<RoomEntity> result = roomService.getAllRooms();

        // Assert
        assertEquals(1, result.size());
        assertEquals(testRoom.getRoomId(), result.get(0).getRoomId());
    }

    // @Test
    // void getAvailableRooms_ShouldReturnOnlyAvailableAndNonDeletedRooms() {
    //     // Arrange
    //     RoomEntity availableRoom = new RoomEntity();
    //     availableRoom.setRoomId(1L);
    //     availableRoom.setStatus(RoomStatus.AVAILABLE);
    //     availableRoom.setIsDeleted(0);

    //     RoomEntity occupiedRoom = new RoomEntity();
    //     occupiedRoom.setRoomId(2L);
    //     occupiedRoom.setStatus(RoomStatus.BOOKED);
    //     occupiedRoom.setIsDeleted(0);

    //     RoomEntity deletedRoom = new RoomEntity();
    //     deletedRoom.setRoomId(3L);
    //     deletedRoom.setStatus(RoomStatus.AVAILABLE);
    //     deletedRoom.setIsDeleted(1);

    //     when(roomDao.findByStatus(RoomStatus.AVAILABLE))
    //         .thenReturn(Arrays.asList(availableRoom, deletedRoom));

    //     // Act
    //     List<RoomEntity> result = roomService.getAvailableRooms();

    //     // Assert
    //     assertEquals(1, result.size());
    //     assertEquals(availableRoom.getRoomId(), result.get(0).getRoomId());
    //     assertEquals(RoomStatus.AVAILABLE, result.get(0).getStatus());
    //     verify(roomDao).findByStatus(RoomStatus.AVAILABLE);
    // }

    @Test
    void getRoomsByHotel_ShouldReturnOnlyRoomsForSpecificHotel() {
        // Arrange
        Long hotelId = 1L;
        HotelEntity hotel = new HotelEntity();
        hotel.setHotelId(hotelId);
        testRoom.setHotel(hotel);
        testRoom.setIsDeleted(0);

        when(roomDao.findByHotel_HotelId(hotelId)).thenReturn(Arrays.asList(testRoom));

        // Act
        List<RoomEntity> result = roomService.getRoomsByHotel(hotelId);

        // Assert
        assertEquals(1, result.size());
        assertEquals(hotelId, result.get(0).getHotel().getHotelId());
        verify(roomDao).findByHotel_HotelId(hotelId);
    }
}