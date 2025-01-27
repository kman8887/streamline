import { Component } from '@angular/core';
import { Game, Review } from '../models/game';
import { GamesService, ReviewsQueryParams } from '../services/games.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import {
  faFaceLaughBeam,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  faWindows,
  faApple,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '@auth0/auth0-angular';
import { ReviewReaction } from '../models/reviewReaction.enum';
import { ReviewService } from '../services/review.service';
import { createEditReview } from '../models/createEditReview';
import { editReview } from '../reviews/review-add-edit/review-add-edit.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  game: Game | undefined;
  reviews: Review[] = [];
  ReviewReaction = ReviewReaction;

  faWindows = faWindows;
  faApple = faApple;
  faLinux = faLinux;

  faFaceLaughBeam = faFaceLaughBeam;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;

  sortOptions = [
    { label: 'Newest', value: 'date:-1' },
    { label: 'Funniest', value: 'funnyCount:-1' },
    { label: 'Most Helpful', value: 'helpfulCount:-1' },
    { label: 'Most Unhelpful', value: 'notHelpfulCount:-1' },
    { label: 'Playtime', value: 'hours:-1' },
    { label: 'Users Games', value: 'products:-1' },
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
    private gamesService: GamesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.getGames();
    this.getReviews();
    this.getUser();
  }

  getGames(): void {
    this.gamesService
      .findGame(this.route.snapshot.params['id'])
      .subscribe((response) => {
        this.game = response;
        console.log(this.game);
      });
  }

  getReviews(): void {
    this.gamesService
      .getReviews(this.route.snapshot.params['id'], this.queryParams)
      .subscribe((response) => {
        this.reviews = response.data;
        this.totalRecords = response.totalRecords;
      });
  }

  getUser(): void {
    this.authService.user$.subscribe((response: any) => {
      if (response) {
        this.loggedInUserId = response._id;
        this.roles = response.myroles;
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

  getSeverity(game: Game): string | undefined {
    switch (game.sentiment) {
      case 'Overwhelmingly Positive':
        return 'over-pos';

      case 'Very Positive':
        return 'very-pos';

      case 'Mostly Positive':
        return 'most-pos';

      case 'Mixed':
        return 'mixed';

      default:
        return undefined;
    }
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
