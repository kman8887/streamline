import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, OnboardingMovie } from '../models/movie';
import {
  MovieFiltersResponse,
  MovieRecommendationResponse,
  MoviesResponse,
} from '../models/moviesResponse';
import { ReviewsResponse } from '../models/reviewsResponse';
import { QueryParamBuilderService } from './queryParamBuilder.service';

const API_URL = 'http://localhost:5000/api/v1.0/';

export interface MoviesQueryParams {
  genre?: string[];
  releaseDates?: Date[];
  tags?: string[];
  search?: string;
  watchProviders?: string[];
  sort?: string;
  ratings?: number[];
  language: string;
  pagination: Pagination;
}

export interface ReviewsQueryParams {
  isRecommended?: boolean[];
  ratings?: number[];
  sort?: string;
  pagination: Pagination;
}

export interface Pagination {
  pageNumber: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(
    private httpClient: HttpClient,
    private queryParamBuilder: QueryParamBuilderService
  ) {}

  findMovie(id: string): Observable<Movie> {
    return this.httpClient.get<Movie>(API_URL + 'movies/' + id);
  }

  // language can be prefiled from user context now
  findMovies(queryParams: MoviesQueryParams): Observable<MoviesResponse> {
    return this.httpClient.get<MoviesResponse>(API_URL + 'movies', {
      params: this.queryParamBuilder.buildMovieParams(queryParams),
    });
  }

  // Would it make sense to have a hardcoded list of movies for the onboarding. + 3 From most popular right now. Or maybe 3 most popular from current year - 1
  findOnboardingMovies(pageNumber: number): Observable<OnboardingMovie[]> {
    return this.httpClient.get<OnboardingMovie[]>(
      API_URL + 'movies/onboarding',
      {
        params: this.queryParamBuilder.buildOnboardingParams(pageNumber),
      }
    );
  }

  getMovieFilters(): Observable<MovieFiltersResponse> {
    return this.httpClient.get<MovieFiltersResponse>(
      API_URL + 'movies/filters'
    );
  }

  getRecommendation(
    user_id: string,
    movie_id: string
  ): Observable<MovieRecommendationResponse> {
    const url = `${API_URL}recommendation/${user_id}`;

    console.log(movie_id);

    return this.httpClient.get<MovieRecommendationResponse>(url, {
      params: this.queryParamBuilder.buildRecommendationParams(movie_id),
    });
  }

  // Think idea for review was, reviews have ratings, in the row.
  // But also when create review, add rating into user interactions,
  // But also can add ratings independently. Does not update review rating
  // IDK about editing and how that should work.

  toggleMovieLike(movieId: string, isLiked: boolean): Observable<any> {
    const url = `${API_URL}movies/${movieId}/like`;
    return this.httpClient.post(url, { isLiked });
  }

  toggleMovieWatched(movieId: string, isWatched: boolean): Observable<any> {
    const url = `${API_URL}movies/${movieId}/watch`;
    return this.httpClient.post(url, { isWatched });
  }

  getReviews(
    id: string,
    queryParams: ReviewsQueryParams
  ): Observable<ReviewsResponse> {
    return this.httpClient.get<ReviewsResponse>(
      API_URL + 'movies/' + id + '/reviews',
      {
        params: this.queryParamBuilder.buildReviewParams(queryParams),
      }
    );
  }
}
