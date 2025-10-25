package com.hms.elite_haven.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hms.elite_haven.dao.HotelDao;
import com.hms.elite_haven.dao.entity.HotelEntity;
import com.hms.elite_haven.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
public class HotelServiceTest {

    @Mock
    private HotelDao hotelDao;

    @InjectMocks
    private HotelService hotelService;

    private HotelEntity testHotel;

    @BeforeEach
    void setUp() {
        testHotel = new HotelEntity();
        testHotel.setHotelId(1L);
        testHotel.setHotelName("Test Hotel");
        testHotel.setLocation("Test Address");
        testHotel.setIsDeleted(0);
    }

    @Test
    void createHotel_ShouldSaveAndReturnHotel() {
        // Arrange
        when(hotelDao.save(any(HotelEntity.class))).thenReturn(testHotel);

        // Act
        HotelEntity result = hotelService.createHotel(testHotel);

        // Assert
        assertNotNull(result);
        assertEquals(testHotel.getHotelName(), result.getHotelName());
        verify(hotelDao).save(testHotel);
    }

    @Test
    void getAllHotels_ShouldReturnOnlyNonDeletedHotels() {
        // Arrange
        HotelEntity deletedHotel = new HotelEntity();
        deletedHotel.setHotelId(2L);
        deletedHotel.setIsDeleted(1);

        when(hotelDao.findAll()).thenReturn(Arrays.asList(testHotel, deletedHotel));

        // Act
        List<HotelEntity> result = hotelService.getAllHotels();

        // Assert
        assertEquals(1, result.size());
        assertEquals(testHotel.getHotelId(), result.get(0).getHotelId());
    }

    @Test
    void getHotelById_WhenHotelExists_ShouldReturnHotel() {
        // Arrange
        when(hotelDao.findById(1L)).thenReturn(Optional.of(testHotel));

        // Act
        HotelEntity result = hotelService.getHotelById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testHotel.getHotelId(), result.getHotelId());
    }

    @Test
    void getHotelById_WhenHotelNotFound_ShouldThrowException() {
        // Arrange
        when(hotelDao.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> hotelService.getHotelById(1L));
    }

    @Test
    void getHotelById_WhenHotelDeleted_ShouldThrowException() {
        // Arrange
        testHotel.setIsDeleted(1);
        when(hotelDao.findById(1L)).thenReturn(Optional.of(testHotel));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> hotelService.getHotelById(1L));
    }

    @Test
    void deleteHotel_ShouldSoftDeleteHotel() {
        // Arrange
        when(hotelDao.findById(1L)).thenReturn(Optional.of(testHotel));
        when(hotelDao.save(any(HotelEntity.class))).thenReturn(testHotel);

        // Act
        HotelEntity result = hotelService.deleteHotel(1L);

        // Assert
        assertEquals(1, result.getIsDeleted());
        verify(hotelDao).save(testHotel);
    }

    @Test
    void updateHotel_ShouldUpdateAndReturnHotel() {
        // Arrange
        HotelEntity updatedHotel = new HotelEntity();
        updatedHotel.setHotelId(1L);
        updatedHotel.setHotelName("Updated Hotel");
        when(hotelDao.save(any(HotelEntity.class))).thenReturn(updatedHotel);

        // Act
        HotelEntity result = hotelService.createHotel(updatedHotel);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Hotel", result.getHotelName());
        verify(hotelDao).save(updatedHotel);
    }
}