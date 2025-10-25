package com.hms.elite_haven.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.elite_haven.dao.BookingDao;
import com.hms.elite_haven.dao.ReviewDao;
import com.hms.elite_haven.dao.entity.BookingEntity;
import com.hms.elite_haven.dao.entity.ReviewEntity;
import com.hms.elite_haven.utils.BookingStatus;

@Service
public class ReviewService {

    @Autowired
    private ReviewDao reviewDao;

    @Autowired
    private BookingDao bookingDao;

    // ✅ 1. Add Review (only if user has checked-in)
    public ReviewEntity addReview(Long bookingId, ReviewEntity review) {
        Optional<BookingEntity> bookingOpt = bookingDao.findById(bookingId);

        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found for ID: " + bookingId);
        }

        BookingEntity booking = bookingOpt.get();

        // Ensure user has checked in
        if (booking.getStatus() != BookingStatus.CHECKED_IN && booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("You can only leave a review after checking in or completing your stay.");
        }

        // Link hotel & user automatically
        review.setHotel(booking.getRoom().getHotel());
        review.setUser(booking.getUser());

        return reviewDao.save(review);
    }

    // ✅ 2. Get all reviews for a hotel
    public List<ReviewEntity> getReviewsByHotel(Long hotelId) {
        return reviewDao.findAll().stream()
                .filter(r -> r.getHotel() != null && r.getHotel().getHotelId().equals(hotelId))
                .toList();
    }

    // ✅ 3. Get reviews by user
    public List<ReviewEntity> getReviewsByUser(Long userId) {
        return reviewDao.findAll().stream()
                .filter(r -> r.getUser() != null && r.getUser().getUserId().equals(userId))
                .toList();
    }

    // ✅ 4. Update review (only if same user)
    public ReviewEntity updateReview(Long reviewId, Long userId, ReviewEntity updatedReview) {
        ReviewEntity existing = reviewDao.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        if (!existing.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own reviews.");
        }

        if (updatedReview.getRating() > 0) existing.setRating(updatedReview.getRating());
        if (updatedReview.getComment() != null) existing.setComment(updatedReview.getComment());

        return reviewDao.save(existing);
    }

    // ✅ 5. Delete review (soft delete or actual delete)
    public void deleteReview(Long reviewId, Long userId) {
        ReviewEntity existing = reviewDao.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        if (!existing.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews.");
        }

        reviewDao.deleteById(reviewId);
    }

    // ✅ 6. Calculate average rating for a hotel
    public Double getAverageRatingForHotel(Long hotelId) {
        List<ReviewEntity> reviews = getReviewsByHotel(hotelId);

        if (reviews.isEmpty()) return 0.0;

        return reviews.stream()
                .mapToInt(ReviewEntity::getRating)
                .average()
                .orElse(0.0);
    }
}
