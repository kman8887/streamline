import {
  MoviesQueryParams,
  Pagination,
  ReviewsQueryParams,
  WatchListQueryParams,
} from './movies.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { isEmpty } from 'lodash';

@Injectable({ providedIn: 'root' })
export class QueryParamBuilderService {
  buildMovieParams(queryParams: MoviesQueryParams): HttpParams {
    let params = new HttpParams();

    if (queryParams.genre) {
      params = params.appendAll({ genre: queryParams.genre });
    }

    if (queryParams.tags) {
      params = params.appendAll({ tags: queryParams.tags });
    }

    if (queryParams.watchProviders) {
      params = params.appendAll({ watchProviders: queryParams.watchProviders });
    }

    if (queryParams.ratings !== undefined) {
      params = params.append('ratingFrom', queryParams.ratings[0]);
      params = params.append('ratingTo', queryParams.ratings[1]);
    }

    if (
      queryParams.releaseDates !== undefined &&
      isEmpty(queryParams.releaseDates) === false &&
      queryParams.releaseDates.length > 0 &&
      queryParams.releaseDates[0]
    ) {
      params = params.append(
        'release_date_from',
        queryParams.releaseDates[0].toISOString()
      );

      if (queryParams.releaseDates[1]) {
        params = params.append(
          'release_date_to',
          queryParams.releaseDates[1].toISOString()
        );
      }
    }

    if (queryParams.search) {
      params = params.append('search', queryParams.search);
    }

    if (queryParams.sort) {
      params = params.append('sort', queryParams.sort);
    }

    // if (queryParams.language) {
    //   params = params.append('language', queryParams.language);
    // }

    if (queryParams.pagination) {
      params = this.buildPaginationParams(queryParams.pagination, params);
    }

    return params;
  }

  buildReviewParams(
    queryParams: ReviewsQueryParams,
    userId?: string
  ): HttpParams {
    let params = new HttpParams();

    if (userId) {
      params.append('user_id', userId);
    }

    if (queryParams.isRecommended && queryParams.isRecommended.length > 0) {
      params = params.append('isRecommended', queryParams.isRecommended[0]);
    }

    if (queryParams.sort) {
      params = params.append('sort', queryParams.sort);
    }

    if (queryParams.ratings !== undefined) {
      params = params.append('ratingFrom', queryParams.ratings[0] * 2);
      params = params.append('ratingTo', queryParams.ratings[1] * 2);
    }

    if (queryParams.pagination) {
      params = this.buildPaginationParams(queryParams.pagination, params);
    }

    return params;
  }

  buildOnboardingParams(pageNumber: number): HttpParams {
    const pagination: Pagination = {
      pageNumber: pageNumber,
    };
    let params = new HttpParams();

    params = this.buildPaginationParams(pagination, params);

    return params;
  }

  buildWatchListParams(queryParams: WatchListQueryParams): HttpParams {
    let params = new HttpParams();

    if (queryParams.pagination) {
      params = this.buildPaginationParams(queryParams.pagination, params);
    }

    return params;
  }

  buildRecommendationParams(movie_id: string): HttpParams {
    let params = new HttpParams();

    if (movie_id) {
      console.log('Here');
      params = params.append('movie_id', movie_id);
    }

    return params;
  }

  private buildPaginationParams(
    pagination: Pagination,
    params: HttpParams
  ): HttpParams {
    console.log(pagination.pageNumber);
    if (pagination.pageNumber) {
      params = params.append('pn', pagination.pageNumber);
    }

    if (pagination.pageSize) {
      params = params.append('ps', pagination.pageSize);
    }

    return params;
  }
}
