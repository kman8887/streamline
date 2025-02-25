import { Component } from '@angular/core';
import { MoviesService, ReviewsQueryParams } from '../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Review } from '../models/movie';
import {
  faFaceLaughBeam,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import { ReviewReaction } from '../models/reviewReaction.enum';
import { editReview } from '../reviews/review-add-edit/review-add-edit.component';
import { AuthService } from '@auth0/auth0-angular';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  user: User | undefined;
  reviews: Review[] = [];
  ReviewReaction = ReviewReaction;

  faFaceLaughBeam = faFaceLaughBeam;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;

  sortOptions = [
    { label: 'Newest', value: 'date:-1' },
    { label: 'Oldest', value: 'date:1' },
  ];

  reviewTypeFilterOptions = [
    { label: 'Recommended', value: true },
    { label: 'Not Recommended', value: false },
  ];

  sortKey: string = '';
  loggedInUserId: string = '';
  roles: string[] = [];

  totalRecords = 0;

  queryParams: ReviewsQueryParams = {
    pagination: {
      pageNumber: 0,
      pageSize: 10,
    },
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getReviews();
    this.getCurrentUser();
  }

  getUser(): void {
    this.userService
      .getUser(this.route.snapshot.params['id'])
      .subscribe((response) => {
        this.user = response;
      });
  }

  getCurrentUser(): void {
    this.authService.user$.subscribe((response: any) => {
      if (response) {
        this.loggedInUserId = response._id;
        this.roles = response.myroles;
      }
    });
  }

  getReviews(): void {
    this.userService
      .getUserReviews(this.route.snapshot.params['id'], this.queryParams)
      .subscribe((response) => {
        this.reviews = response.data;
        this.totalRecords = response.totalRecords;
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

  getAvatar(avatarUrl: string): string {
    return avatarUrl.replace('.jpg', '_full.jpg');
  }

  onPageChange(event: PaginatorState) {
    console.log('page change');
    console.log(event);
    this.queryParams.pagination.pageNumber = event.page ? event.page : 0;
    this.queryParams.pagination.pageSize = event.rows ? event.rows : 10;
    this.getReviews();
  }

  toggleState(review: Review, reaction: ReviewReaction): void {
    this.reviewService.toggleReaction(review._id, reaction).subscribe(
      () => {
        this.toggleReaction(review, reaction, this.reaction(review, reaction));
      },
      (error) => {
        console.error('Error toggling like status:', error);
      }
    );
  }

  toggleReaction(
    review: Review,
    reaction: ReviewReaction,
    present: boolean
  ): void {
    console.log(review);
    switch (reaction) {
      case ReviewReaction.Helpful: {
        if (!review.found_helpful) {
          review.found_helpful = [];
        }
        present
          ? (review.found_helpful = review.found_helpful.filter(
              (id) => id !== this.loggedInUserId
            ))
          : review.found_helpful.push(this.loggedInUserId);
        review.found_helpful = [...review.found_helpful];
        review.found_funny = review.found_funny.filter(
          (id) => id !== this.loggedInUserId
        );
        review.found_not_helpful = review.found_not_helpful.filter(
          (id) => id !== this.loggedInUserId
        );
        break;
      }
      case ReviewReaction.NotHelpful: {
        if (!review.found_not_helpful) {
          review.found_not_helpful = [];
        }
        present
          ? (review.found_not_helpful = review.found_not_helpful.filter(
              (id) => id !== this.loggedInUserId
            ))
          : review.found_not_helpful.push(this.loggedInUserId);
        review.found_not_helpful = [...review.found_not_helpful];
        review.found_funny = review.found_funny.filter(
          (id) => id !== this.loggedInUserId
        );
        review.found_helpful = review.found_helpful.filter(
          (id) => id !== this.loggedInUserId
        );
        break;
      }
      case ReviewReaction.Funny: {
        if (!review.found_funny) {
          review.found_funny = [];
        }
        present
          ? (review.found_funny = review.found_funny.filter(
              (id) => id !== this.loggedInUserId
            ))
          : review.found_funny.push(this.loggedInUserId);
        review.found_funny = [...review.found_funny];
        review.found_helpful = review.found_helpful.filter(
          (id) => id !== this.loggedInUserId
        );
        review.found_not_helpful = review.found_not_helpful.filter(
          (id) => id !== this.loggedInUserId
        );
        break;
      }
    }
  }

  reaction(review: Review, reaction: ReviewReaction): boolean {
    switch (reaction) {
      case ReviewReaction.Helpful: {
        return (
          review.found_helpful &&
          review.found_helpful.includes(this.loggedInUserId)
        );
      }
      case ReviewReaction.NotHelpful: {
        return (
          review.found_not_helpful &&
          review.found_not_helpful.includes(this.loggedInUserId)
        );
      }
      case ReviewReaction.Funny: {
        return (
          review.found_funny && review.found_funny.includes(this.loggedInUserId)
        );
      }
    }
  }

  addReview(event: any) {
    this.reviewService.createReview(event).subscribe((response) => {
      if (response) {
        this.getReviews();
      }
    });
  }

  updateReview(event: any) {
    console.log('update ' + event);
    this.reviewService.updateReview(event).subscribe((response) => {
      if (response) {
        this.getReviews();
      }
    });
  }

  getEditReviewData(review: Review): editReview {
    return {
      hours: review.hours,
      text: review.text,
      isRecommended: review.isRecommended,
    };
  }

  canEditAndDeleteReview(review: Review): boolean {
    return (
      review.user_id === this.loggedInUserId || this.roles.includes('Admin')
    );
  }

  deleteReview(id: string) {
    this.reviewService.deleteReview(id).subscribe((response) => {
      console.log(response);
      this.getReviews();
    });
  }
}
