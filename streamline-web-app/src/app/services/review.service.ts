import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/movie';
import { createEditReview } from '../models/createEditReview';
import { environment } from '../../environments/environments';

const apiUrl = `${environment.apiUrl}/v1.0/`;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private httpClient: HttpClient) {}

  toggleLike(reviewId: string, isLiked: boolean): Observable<any> {
    const url = `${apiUrl}reviews/${reviewId}/like`;
    return this.httpClient.post(url, { isLiked });
  }

  createReview(body: createEditReview): Observable<Review> {
    return this.httpClient.post<Review>(
      apiUrl + 'movies/' + body.id + '/reviews',
      JSON.stringify(body, (key, value) => {
        if (key === 'id') {
          return undefined;
        }

        return value;
      })
    );
  }
}
