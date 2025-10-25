package com.hms.elite_haven.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.elite_haven.dao.entity.ReviewEntity;
import com.hms.elite_haven.service.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 1️⃣ Add a review (only if user has checked in)
    @PostMapping("/add_review/{bookingId}")
    public ResponseEntity<ReviewEntity> addReview(
            @PathVariable Long bookingId,
            @RequestBody @Valid ReviewEntity review) {
        ReviewEntity savedReview = reviewService.addReview(bookingId, review);
        return ResponseEntity.ok(savedReview);
    }

    // 2️⃣ Get all reviews for a hotel
    @GetMapping("/reviews_hotel/{hotelId}")
    public ResponseEntity<List<ReviewEntity>> getReviewsByHotel(@PathVariable Long hotelId) {
        List<ReviewEntity> reviews = reviewService.getReviewsByHotel(hotelId);
        return ResponseEntity.ok(reviews);
    }

    // 3️⃣ Get all reviews by a user
    @GetMapping("/reviews_user/{userId}")
    public ResponseEntity<List<ReviewEntity>> getReviewsByUser(@PathVariable Long userId) {
        List<ReviewEntity> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    // 4️⃣ Update a review (only by owner)
    @PutMapping("/update_review")
    public ResponseEntity<ReviewEntity> updateReview(
            @RequestBody @Valid ReviewEntity updatedReview) {
        ReviewEntity review = reviewService.updateReview(updatedReview);
        return ResponseEntity.ok(review);
    }

    // 5️⃣ Delete a review (only by owner)
    @DeleteMapping("/delete_review/{reviewId}/user/{userId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @PathVariable Long userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.ok("Review deleted successfully");
    }

    // 6️⃣ Get average rating for a hotel
    @GetMapping("/hotel/{hotelId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long hotelId) {
        Double avgRating = reviewService.getAverageRatingForHotel(hotelId);
        return ResponseEntity.ok(avgRating);
    }
}
