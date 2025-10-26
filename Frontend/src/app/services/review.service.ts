import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  addReview(bookingId: number, review: ReviewModel): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(
      `${this.baseUrl}/add_review/${bookingId}`,
      review
    );
  }

  getReviewsByHotel(hotelId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(
      `${this.baseUrl}/reviews_hotel/${hotelId}`
    );
  }

  getAllReviews(): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.baseUrl}/reviews`);
  }

  getReviewsByUser(userId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(
      `${this.baseUrl}/reviews_user/${userId}`
    );
  }

  updateReview(review: ReviewModel): Observable<ReviewModel> {
    return this.http.put<ReviewModel>(`${this.baseUrl}/update_review`, review);
  }

  deleteReview(reviewId: number, userId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/delete_review/${reviewId}/user/${userId}`
    );
  }

  getAverageRating(hotelId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/hotel/${hotelId}/average`);
  }
}
