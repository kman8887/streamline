import { Component, Input, OnInit } from '@angular/core';
import { ReviewReaction } from '../../models/reviewReaction.enum';
import { Review, ReviewWithMovie } from '../../models/movie';
import {
  MoviesService,
  ReviewsQueryParams,
} from '../../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { ReviewService } from '../../services/review.service';
import { ReviewsResponse } from '../../models/reviewsResponse';
import { Observable } from 'rxjs';
import { ReviewCardData } from '../review-card/review-card.component';
import { LoadingService } from '../../services/loading.service';

export interface ReviewTableData {
  movieId?: string;
  userId?: string;
  roles?: string[];
  getReviews(queryParams: ReviewsQueryParams): Observable<ReviewsResponse>;
}

@Component({
  selector: 'app-review-table',
  templateUrl: './review-table.component.html',
  styleUrl: './review-table.component.scss',
})
export class ReviewTableComponent implements OnInit {
  @Input({ required: true }) data!: ReviewTableData;

  queryParams: ReviewsQueryParams = {
    pagination: {
      pageNumber: 0,
      pageSize: 10,
    },
  };
  totalRecords = 0;
  reviews: ReviewCardData[] = [];
  ratingSliderValues: number[] = [0, 5];

  sortOptions = [
    { label: 'Newest', value: 'created_at:-1' },
    { label: 'Oldest', value: 'created_at:1' },
    { label: 'Most Liked', value: 'like_count:-1' },
  ];

  reviewTypeFilterOptions = [
    { label: 'Recommended', value: true },
    { label: 'Not Recommended', value: false },
  ];

  sortKey: string = '';

  constructor(
    private reviewService: ReviewService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getReviews();
  }

  get movieId(): string {
    if (this.data.movieId != undefined) {
      return this.data.movieId;
    }
    throw Error("Can't get Movie Id");
  }

  getReviews(): void {
    this.data.getReviews(this.queryParams).subscribe((response) => {
      this.reviews = this.mapReviews(response.reviews);
      this.totalRecords = response.total_count;
    });
  }

  shouldShowAddReviewButton(): boolean {
    return this.data.movieId != undefined;
  }

  addReview(event: any) {
    this.reviewService.createReview(event).subscribe((response) => {
      if (response) {
        this.getReviews();
      }
    });
  }

  onSortChange(event: any) {
    let value = event.value;
    console.log('sort change');

    if (value.indexOf(':') > 0) {
      this.queryParams.sort = value;
    } else {
      this.queryParams.sort = value;
    }

    this.getReviews();
  }

  onFilterChange(event: any) {
    console.log(event);
    console.log('filter change');
    console.log(this.queryParams.isRecommended);
    if (event.value.length > 0) {
      this.queryParams.isRecommended = [event.itemValue['value']];
    }
    this.getReviews();
  }

  onPageChange(event: PaginatorState) {
    console.log('page change');
    console.log(event);
    this.queryParams.pagination.pageNumber = event.page ? event.page : 0;
    this.queryParams.pagination.pageSize = event.rows ? event.rows : 10;
    this.getReviews();
  }

  onRatingFilterChange(event: any) {
    console.log(event);
    this.queryParams.ratings = this.ratingSliderValues;
    this.getReviews();
  }

  private mapReviews(reviews: Review[] | ReviewWithMovie[]): ReviewCardData[] {
    return reviews.map((review) => {
      return {
        review: review,
        user_id: this.data.userId,
        canEditAndDeleteReview: this.canEditAndDeleteReview(review),
        refreshReviews: this.getReviews.bind(this),
      } as ReviewCardData;
    });
  }

  private canEditAndDeleteReview(review: Review): boolean {
    return (
      this.data.userId != undefined &&
      this.data.roles != undefined &&
      (review.user_id === this.data.userId || this.data.roles.includes('Admin'))
    );
  }
}
