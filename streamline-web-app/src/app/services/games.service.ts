import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { GamesResponse } from '../models/gamesResponse';
import { ReviewsResponse } from '../models/reviewsResponse';
import { QueryParamBuilderService } from './queryParamBuilder.service';

const apiUrl = 'http://localhost:5000/api/v1.0/';

export interface GamesQueryParams {
  price?: number;
  genre?: string[];
  release_date?: Date;
  tags?: string[];
  search?: string;
  platform?: string[];
  sort?: string;
  pagination: Pagination;
}

export interface ReviewsQueryParams {
  isRecommended?: boolean[];
  sort?: string;
  pagination: Pagination;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(
    private httpClient: HttpClient,
    private queryParamBuilder: QueryParamBuilderService
  ) {}

  findGame(id: string): Observable<Game> {
    return this.httpClient.get<Game>(apiUrl + 'games/' + id);
  }

  findGames(queryParams: GamesQueryParams): Observable<GamesResponse> {
    return this.httpClient.get<GamesResponse>(apiUrl + 'games', {
      params: this.queryParamBuilder.buildGameParams(queryParams),
    });
  }

  getReviews(
    id: string,
    queryParams: ReviewsQueryParams
  ): Observable<ReviewsResponse> {
    return this.httpClient.get<ReviewsResponse>(
      apiUrl + 'games/' + id + '/reviews',
      {
        params: this.queryParamBuilder.buildReviewParams(queryParams),
      }
    );
  }
}
