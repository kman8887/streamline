import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, OnboardingMovie } from '../models/movie';
import {
  MovieFiltersResponse,
  MovieRecommendationResponse,
  MoviesResponse,
  WatchListResponse,
} from '../models/moviesResponse';
import { ReviewsResponse } from '../models/reviewsResponse';
import { QueryParamBuilderService } from './queryParamBuilder.service';
import { filterOption } from '../movie-table/movie-table.component';
import { environment } from '../../environments/environments';
import { TrackLoading } from '../decorators/track-loading.decorator';
import { LoadingService } from './loading.service';

const API_URL = `${environment.apiUrl}/v1.0/`;

export interface MoviesQueryParams {
  genre?: number[];
  releaseDates?: Date[];
  tags?: number[];
  search?: string;
  watchProviders?: number[];
  sort?: string;
  ratings?: number[];
  pagination: Pagination;
  onlyShowUsersWatchProviders?: boolean;
}
export interface WatchListQueryParams {
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
    private queryParamBuilder: QueryParamBuilderService,
    public loadingService: LoadingService
  ) {}

  @TrackLoading()
  findMovie(id: string): Observable<Movie> {
    return this.httpClient.get<Movie>(API_URL + 'movies/' + id);
  }

  findMovies(queryParams: MoviesQueryParams): Observable<MoviesResponse> {
    return this.httpClient.get<MoviesResponse>(API_URL + 'movies', {
      params: this.queryParamBuilder.buildMovieParams(queryParams),
    });
  }

  getMoviesFromWatchList(
    queryParams: WatchListQueryParams
  ): Observable<WatchListResponse> {
    return this.httpClient.get<WatchListResponse>(
      API_URL + 'movies/watchlist',
      {
        params: this.queryParamBuilder.buildWatchListParams(queryParams),
      }
    );
  }

  findOnboardingMovies(pageNumber: number): Observable<OnboardingMovie[]> {
    return this.httpClient.get<OnboardingMovie[]>(
      API_URL + 'movies/onboarding',
      {
        params: this.queryParamBuilder.buildOnboardingParams(pageNumber),
      }
    );
  }

  @TrackLoading()
  getMovieFilters(): Observable<MovieFiltersResponse> {
    return this.httpClient.get<MovieFiltersResponse>(
      API_URL + 'movies/filters'
    );
  }

  @TrackLoading()
  getWatchProviders(): Observable<filterOption[]> {
    return this.httpClient.get<filterOption[]>(
      API_URL + 'movies/watch-providers'
    );
  }

  @TrackLoading()
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

  createRecommendation(): Observable<any> {
    const url = `${API_URL}recommendation/generate`;

    return this.httpClient.get<any>(url);
  }

  toggleMovieLike(movieId: string, isLiked: boolean): Observable<any> {
    const url = `${API_URL}movies/${movieId}/like`;
    return this.httpClient.post(url, { isLiked });
  }

  toggleMovieWatched(movieId: string, isWatched: boolean): Observable<any> {
    const url = `${API_URL}movies/${movieId}/watch`;
    return this.httpClient.post(url, { isWatched });
  }

  toggleMovieWatchList(
    movieId: string,
    isInWatchList: boolean
  ): Observable<any> {
    const url = `${API_URL}movies/${movieId}/watchList`;
    return this.httpClient.post(url, { isInWatchList });
  }

  @TrackLoading('reviews-table')
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
