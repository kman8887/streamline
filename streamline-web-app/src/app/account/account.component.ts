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
import { Observable } from 'rxjs';
import { ReviewsResponse } from '../models/reviewsResponse';
import { ReviewTableData } from '../reviews/review-table/review-table.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  user: User | undefined;
  loggedInUserId: string = '';
  roles: string[] = [];

  reviewTableData?: ReviewTableData;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUser();
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

      this.setReviewTableData();
    });
  }

  private setReviewTableData(): void {
    this.reviewTableData = {
      userId: this.loggedInUserId,
      roles: this.roles,
      getReviews: this.getReviews.bind(this),
    };
  }

  getReviews(queryParams: ReviewsQueryParams): Observable<ReviewsResponse> {
    return this.userService.getUserReviews(
      this.route.snapshot.params['id'],
      queryParams
    );
  }

  getAvatar(avatarUrl: string): string {
    return avatarUrl.replace('.jpg', '_full.jpg');
  }
}
