package com.hms.elite_haven.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.RoomDao;
import com.hms.elite_haven.dao.UserDao;
import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.dao.entity.RoomEntity;
import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.dto.BookingRequestDto;
import com.hms.elite_haven.utils.BookingStatus;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingDao bookingDao;

    @Mock 
    private RoomDao roomDao;

    @Mock
    private UserDao userDao;

    @InjectMocks
    private BookingService bookingService;

    private BookingEntity testBooking;

    @BeforeEach
    void setUp() {
        testBooking = new BookingEntity();
        testBooking.setBookingId(1L);
        testBooking.setStatus(BookingStatus.PENDING);
    }

    @Test
    void createBooking_ShouldSetStatusToPendingAndSave() {
        // Arrange
        BookingRequestDto bookingDto = new BookingRequestDto();
        bookingDto.setUserId(1L);
        bookingDto.setRoomId(1L);
        bookingDto.setCheckInDate(LocalDate.now().plusDays(1));
        bookingDto.setCheckOutDate(LocalDate.now().plusDays(3));
        bookingDto.setNumberOfGuests(2);
        bookingDto.setTotalPrice(500.0);
        
        // Mock room entity
        RoomEntity mockRoom = new RoomEntity();
        mockRoom.setRoomId(1L);
        
        // Mock user entity
        UserEntity mockUser = new UserEntity();
        mockUser.setUserId(1L);
        
        // Mock the DAO calls
        when(roomDao.findById(1L)).thenReturn(Optional.of(mockRoom));
        when(userDao.findById(1L)).thenReturn(Optional.of(mockUser));
        when(bookingDao.existsOverlappingBooking(any(), any(), any())).thenReturn(false);
        when(bookingDao.save(any(BookingEntity.class))).thenReturn(testBooking);

        // Act
        BookingEntity result = bookingService.createBooking(bookingDto);

        // Assert
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(roomDao).findById(1L);
        verify(userDao).findById(1L);
        verify(bookingDao).existsOverlappingBooking(1L, bookingDto.getCheckInDate(), bookingDto.getCheckOutDate());
        verify(bookingDao).save(any(BookingEntity.class));  // ← Verify with BookingEntity, not DTO
    }

    @Test
    void cancelBooking_WhenPending_ShouldSetStatusToCancelledAndSave() {
        // Arrange
        BookingEntity pendingBooking = new BookingEntity();
        pendingBooking.setStatus(BookingStatus.PENDING);
        when(bookingDao.findById(1L)).thenReturn(Optional.of(pendingBooking));
        
        BookingEntity cancelledBooking = new BookingEntity();
        cancelledBooking.setStatus(BookingStatus.CANCELLED);
        when(bookingDao.save(any(BookingEntity.class))).thenReturn(cancelledBooking);

        // Act
        BookingEntity result = bookingService.cancelBooking(1L);

        // Assert
        assertEquals(BookingStatus.CANCELLED, result.getStatus());
        verify(bookingDao).save(pendingBooking);
    }

    @Test
    void cancelBooking_WhenNotPending_ShouldThrowException() {
        // Arrange
        testBooking.setStatus(BookingStatus.CONFIRMED);
        when(bookingDao.findById(1L)).thenReturn(Optional.of(testBooking));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.cancelBooking(1L));
    }

    @Test
    void cancelBooking_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(bookingDao.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.cancelBooking(1L));
    }

    @Test
    void checkIn_ShouldSetStatusToCheckedInAndSave() {
        // Arrange
        when(bookingDao.findById(1L)).thenReturn(Optional.of(testBooking));
        testBooking.setStatus(BookingStatus.CHECKED_IN);
        when(bookingDao.save(any(BookingEntity.class))).thenReturn(testBooking);

        // Act
        BookingEntity result = bookingService.checkIn(1L);

        // Assert
        assertEquals(BookingStatus.CHECKED_IN, result.getStatus());
        verify(bookingDao).save(any(BookingEntity.class));
    }

    @Test
    void checkIn_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(bookingDao.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.checkIn(1L));
    }
}