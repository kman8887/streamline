import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MoviesResponse } from '../models/moviesResponse';
import { ReviewsResponse } from '../models/reviewsResponse';
import { QueryParamBuilderService } from './queryParamBuilder.service';

const apiUrl = 'http://localhost:5000/api/v1.0/';

export interface MoviesQueryParams {
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
export class MoviesService {
  constructor(
    private httpClient: HttpClient,
    private queryParamBuilder: QueryParamBuilderService
  ) {}

  findMovie(id: string): Observable<Movie> {
    return this.httpClient.get<Movie>(apiUrl + 'movies/' + id);
  }

  findMovies(queryParams: MoviesQueryParams): Observable<MoviesResponse> {
    return this.httpClient.get<MoviesResponse>(apiUrl + 'movies', {
      params: this.queryParamBuilder.buildMovieParams(queryParams),
    });
  }

  getReviews(
    id: string,
    queryParams: ReviewsQueryParams
  ): Observable<ReviewsResponse> {
    return this.httpClient.get<ReviewsResponse>(
      apiUrl + 'movies/' + id + '/reviews',
      {
        params: this.queryParamBuilder.buildReviewParams(queryParams),
      }
    );
  }
}
