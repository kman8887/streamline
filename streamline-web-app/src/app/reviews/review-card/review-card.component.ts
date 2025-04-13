import { Component, Input } from '@angular/core';
import { Review, ReviewWithMovie } from '../../models/movie';
import { editReview } from '../review-add-edit/review-add-edit.component';
import { ReviewService } from '../../services/review.service';

export interface ReviewCardData {
  review: Review | ReviewWithMovie;
  user_id?: string;
  canEditAndDeleteReview: boolean;
  refreshReviews(): void;
}

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
})
export class ReviewCardComponent {
  @Input({ required: true }) data!: ReviewCardData;
  @Input({ required: true }) first!: boolean;

  isReviewLiked: boolean = false;

  constructor(private reviewService: ReviewService) {}

  getAvatar(avatarUrl: string): string {
    return avatarUrl.replace('.jpg', '_full.jpg');
  }

  getEditReviewData(review: Review): editReview {
    return {
      rating: review.rating,
      text: review.review_text,
    };
  }

  shouldShowRating(): boolean {
    return (
      this.data.review.rating != undefined && this.data.review.rating != null
    );
  }

  isReviewWithMovie(review: any): review is ReviewWithMovie {
    return 'movie_id' in review && 'title' in review && 'poster_path' in review;
  }

  shouldShowMovie(): boolean {
    return this.isReviewWithMovie(this.data.review);
  }

  get moviePosterUrl() {
    if (this.isReviewWithMovie(this.data.review)) {
      const baseUrl: string = 'https://image.tmdb.org/t/p/w500';
      return baseUrl + this.data.review.poster_path;
    }

    return '';
  }

  get movieId() {
    if (this.isReviewWithMovie(this.data.review)) {
      return this.data.review.movie_id;
    }

    return '';
  }

  get movieTitle() {
    if (this.isReviewWithMovie(this.data.review)) {
      return this.data.review.title;
    }

    return '';
  }

  onReviewLikeToggle(newState: boolean): void {
    if (this.data.user_id) {
      this.data.review.isReviewLiked = newState;

      this.updateLikeCount(newState);

      this.reviewService
        .toggleLike(this.data.review.review_id, newState)
        .subscribe({
          next: () => {
            console.log(`Movie ${newState ? 'liked' : 'unliked'}`);
          },
          error: (err) => {
            console.error('Error toggling like:', err);
            this.data.review.isReviewLiked = !this.data.review.isReviewLiked; // Revert UI state on failure
            this.updateLikeCount(this.data.review.isReviewLiked);
          },
        });
    }
  }

  private updateLikeCount(newState: boolean): void {
    if (newState) {
      this.data.review.like_count++;
    } else {
      this.data.review.like_count--;
    }
  }
}
