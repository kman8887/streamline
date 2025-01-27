import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewReaction } from '../models/reviewReaction.enum';
import { Observable } from 'rxjs';
import { Review } from '../models/game';
import { createEditReview } from '../models/createEditReview';

const apiUrl = 'http://localhost:5000/api/v1.0/';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private httpClient: HttpClient) {}

  toggleReaction(id: string, reaction: ReviewReaction): Observable<Review> {
    return this.httpClient.put<Review>(
      apiUrl + 'reviews/' + id + '/reaction',
      JSON.stringify({ reaction: reaction })
    );
  }

  updateReview(body: createEditReview): Observable<Review> {
    return this.httpClient.put<Review>(
      apiUrl + 'reviews/' + body.id,
      JSON.stringify(body, (key, value) => {
        if (key === 'id') {
          return undefined;
        }

        return value;
      })
    );
  }

  createReview(body: createEditReview): Observable<Review> {
    console.log(body);
    console.log('here');
    return this.httpClient.post<Review>(
      apiUrl + 'games/' + body.id + '/reviews',
      JSON.stringify(body, (key, value) => {
        if (key === 'id') {
          return undefined;
        }

        return value;
      })
    );
  }

  deleteReview(reviewId: string): Observable<Review> {
    return this.httpClient.delete<Review>(apiUrl + 'reviews/' + reviewId);
  }
}
