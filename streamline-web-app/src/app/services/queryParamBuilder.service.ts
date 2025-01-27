import { GamesQueryParams, ReviewsQueryParams } from './games.service';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QueryParamBuilderService {
  buildGameParams(queryParams: GamesQueryParams) {
    let params = new HttpParams();

    if (queryParams.genre) {
      params = params.appendAll({ genre: queryParams.genre });
    }

    if (queryParams.tags) {
      params = params.appendAll({ tags: queryParams.tags });
    }

    if (queryParams.platform) {
      params = params.appendAll({ platforms: queryParams.platform });
    }

    if (queryParams.price !== undefined && queryParams.price !== null) {
      params = params.append('price', queryParams.price.toString());
    }

    if (queryParams.release_date) {
      params = params.append(
        'release_date',
        queryParams.release_date.getFullYear()
      );
    }

    if (queryParams.search) {
      params = params.append('search', queryParams.search);
    }

    if (queryParams.sort) {
      params = params.append('sort', queryParams.sort);
    }

    if (queryParams.pagination) {
      const pagination = queryParams.pagination;
      if (pagination.pageNumber) {
        params = params.append('pn', pagination.pageNumber);
      }

      if (pagination.pageSize) {
        params = params.append('ps', pagination.pageSize);
      }
    }

    return params;
  }

  buildReviewParams(queryParams: ReviewsQueryParams, userId?: string) {
    let params = new HttpParams();

    if (userId) {
      params.append('user_id', userId);
    }

    if (queryParams.isRecommended && queryParams.isRecommended.length > 0) {
      console.log(queryParams.isRecommended);
      params = params.append('isRecommended', queryParams.isRecommended[0]);
      console.log(params);
    }

    if (queryParams.sort) {
      params = params.append('sort', queryParams.sort);
    }

    if (queryParams.pagination) {
      const pagination = queryParams.pagination;
      if (pagination.pageNumber) {
        params = params.append('pn', pagination.pageNumber);
      }

      if (pagination.pageSize) {
        params = params.append('ps', pagination.pageSize);
      }
    }

    return params;
  }
}
