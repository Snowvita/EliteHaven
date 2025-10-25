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

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.ReviewDao;
import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.dao.entity.HotelEntity;
import com.hms.elite_haven.dao.entity.ReviewEntity;
import com.hms.elite_haven.dao.entity.RoomEntity;
import com.hms.elite_haven.dao.entity.UserEntity;
import com.hms.elite_haven.utils.BookingStatus;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewDao reviewDao;

    @Mock
    private BookingDao bookingDao;

    @InjectMocks
    private ReviewService reviewService;

    private ReviewEntity testReview;
    private UserEntity testUser;
    private BookingEntity testBooking;
    private HotelEntity testHotel;
    private RoomEntity testRoom;

    @BeforeEach
    void setUp() {
        testUser = new UserEntity();
        testUser.setUserId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");

        testHotel = new HotelEntity();
        testHotel.setHotelId(1L);
        testHotel.setHotelName("Test Hotel");

        testRoom = new RoomEntity();
        testRoom.setRoomId(1L);
        testRoom.setHotel(testHotel);

        testBooking = new BookingEntity();
        testBooking.setBookingId(1L);
        testBooking.setUser(testUser);
        testBooking.setRoom(testRoom);
        testBooking.setStatus(BookingStatus.CHECKED_IN);

        testReview = new ReviewEntity();
        testReview.setReviewId(1L);
        testReview.setRating(5);
        testReview.setComment("Great stay!");
        testReview.setUser(testUser);
        testReview.setHotel(testHotel);
    }

    @Test
    void addReview_WhenCheckedIn_ShouldCreateNewReview() {
        // Arrange
        when(bookingDao.findById(1L)).thenReturn(Optional.of(testBooking));
        when(reviewDao.save(any(ReviewEntity.class))).thenReturn(testReview);

        // Act
        ReviewEntity result = reviewService.addReview(1L, testReview);

        // Assert
        assertNotNull(result);
        assertEquals(testReview.getRating(), result.getRating());
        assertEquals(testReview.getComment(), result.getComment());
        assertEquals(testBooking.getUser(), result.getUser());
        assertEquals(testBooking.getRoom().getHotel(), result.getHotel());
        verify(reviewDao).save(any(ReviewEntity.class));
    }

    @Test
    void addReview_WhenBookingNotFound_ShouldThrowException() {
        // Arrange
        when(bookingDao.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            reviewService.addReview(1L, testReview));
    }

    @Test
    void addReview_WhenNotCheckedIn_ShouldThrowException() {
        // Arrange
        testBooking.setStatus(BookingStatus.CONFIRMED);
        when(bookingDao.findById(1L)).thenReturn(Optional.of(testBooking));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            reviewService.addReview(1L, testReview));
    }

    @Test
    void getReviewsByHotel_ShouldReturnHotelReviews() {
        // Arrange
        when(reviewDao.findAll()).thenReturn(Arrays.asList(testReview));

        // Act
        List<ReviewEntity> results = reviewService.getReviewsByHotel(1L);

        // Assert
        assertEquals(1, results.size());
        assertEquals(testReview.getRating(), results.get(0).getRating());
        assertEquals(testReview.getComment(), results.get(0).getComment());
        assertEquals(testHotel.getHotelId(), results.get(0).getHotel().getHotelId());
    }

    @Test
    void getReviewsByHotel_WhenNoReviews_ShouldReturnEmptyList() {
        // Arrange
        when(reviewDao.findAll()).thenReturn(Arrays.asList());

        // Act
        List<ReviewEntity> results = reviewService.getReviewsByHotel(1L);

        // Assert
        assertTrue(results.isEmpty());
    }

    @Test
    void getReviewsByHotel_ShouldFilterByHotelId() {
        // Arrange
        HotelEntity anotherHotel = new HotelEntity();
        anotherHotel.setHotelId(2L);

        ReviewEntity anotherReview = new ReviewEntity();
        anotherReview.setHotel(anotherHotel);

        when(reviewDao.findAll()).thenReturn(Arrays.asList(testReview, anotherReview));

        // Act
        List<ReviewEntity> results = reviewService.getReviewsByHotel(1L);

        // Assert
        assertEquals(1, results.size());
        assertEquals(testHotel.getHotelId(), results.get(0).getHotel().getHotelId());
    }
}
