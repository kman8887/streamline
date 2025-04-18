import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUser, User, UserWatchProviders } from '../models/user';
import { ReviewsResponse } from '../models/reviewsResponse';
import { QueryParamBuilderService } from './queryParamBuilder.service';
import { ReviewsQueryParams } from './movies.service';
import { AuthService } from '@auth0/auth0-angular';
import { MovieRating } from '../ratings/ratings-onboarding/ratings-onboarding.component';
import { environment } from '../../environments/environments';
import { LoadingService } from './loading.service';
import { TrackLoading } from '../decorators/track-loading.decorator';

const apiUrl = `${environment.apiUrl}/v1.0/`;

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private queryParamBuilder: QueryParamBuilderService,
    public loadingService: LoadingService
  ) {}

  @TrackLoading()
  getUser(id: string): Observable<User> {
    return this.httpClient.get<User>(apiUrl + 'users/' + id);
  }

  @TrackLoading()
  getUserWatchProviders(id: number): Observable<UserWatchProviders> {
    return this.httpClient.get<UserWatchProviders>(
      apiUrl + 'users/' + id + '/watch-providers'
    );
  }

  @TrackLoading()
  createUser(body = {}): Observable<User> {
    return this.httpClient.post<User>(apiUrl + 'users', body);
  }

  @TrackLoading('reviews-table')
  getUserReviews(
    user_id: string,
    queryParams: ReviewsQueryParams
  ): Observable<ReviewsResponse> {
    return this.httpClient.get<ReviewsResponse>(
      apiUrl + 'users/' + user_id + '/reviews',
      {
        params: this.queryParamBuilder.buildReviewParams(queryParams, user_id),
      }
    );
  }

  @TrackLoading('onboarding')
  bulkRateMovies(
    movieRatings: MovieRating[],
    userId: number
  ): Observable<Object> {
    let url = `${apiUrl}users/${userId}/bulk-rate`;
    return this.httpClient.post(url, movieRatings);
  }

  updateUser(userId: number, body: UpdateUser): Observable<User> {
    return this.httpClient.put<User>(`${apiUrl}users/${userId}`, body);
  }
}
