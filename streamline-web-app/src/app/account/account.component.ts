import { Component } from '@angular/core';
import { ReviewsQueryParams } from '../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User as UserModel } from '../models/user';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, take } from 'rxjs';
import { ReviewsResponse } from '../models/reviewsResponse';
import { ReviewTableData } from '../reviews/review-table/review-table.component';
import { LoadingService } from '../services/loading.service';
import { TrackLoading } from '../decorators/track-loading.decorator';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  user: UserModel | undefined;
  loggedInUserId: string = '';
  roles: string[] = [];
  average_rating = '';
  showEdit = false;

  reviewTableData?: ReviewTableData;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public loadingService: LoadingService
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
        this.average_rating = parseFloat(this.user.avg_rating).toFixed(2);
      });
  }

  getCurrentUser(): void {
    this.loadUser$()
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response) {
          this.loggedInUserId = response._id;
          this.roles = response.myroles;

          if (this.loggedInUserId === this.route.snapshot.params['id']) {
            this.showEdit = true;
          } else {
            this.showEdit = false;
          }
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

  @TrackLoading()
  private loadUser$(): Observable<User | null | undefined> {
    return this.authService.user$;
  }
}
