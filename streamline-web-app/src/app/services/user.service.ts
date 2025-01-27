import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ReviewsResponse } from '../models/reviewsResponse';
import { QueryParamBuilderService } from './queryParamBuilder.service';
import { ReviewsQueryParams } from './games.service';
import { AuthService } from '@auth0/auth0-angular';

const apiUrl = 'http://localhost:5000/api/v1.0/';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private queryParamBuilder: QueryParamBuilderService,
    private authService: AuthService
  ) {}

  getUser(id: string): Observable<User> {
    return this.httpClient.get<User>(apiUrl + 'users/' + id);
  }

  createUser(body = {}): Observable<User> {
    return this.httpClient.post<User>(apiUrl + 'users', body);
  }

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
}
